"""
Resolve NBA and NCAA player headshot URLs.
- NBA: Uses nba_api to get person ID, then cdn.nba.com
- NCAA: ESPN CDN - fetches from ESPN API (roster by team) when school is known
"""
import json
import re
from functools import lru_cache
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

try:
    from nba_api.stats.static import players as nba_players
    NBA_API_AVAILABLE = True
except ImportError:
    NBA_API_AVAILABLE = False

NBA_CDN = "https://cdn.nba.com/headshots/nba/latest/1040x760"
ESPN_NCAA_CDN = "https://a.espncdn.com/i/headshots/mens-college-basketball/players/full"
ESPN_TEAMS_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams"
ESPN_ROSTER_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/{team_id}/roster"
UI_AVATARS = "https://ui-avatars.com/api"

_espn_team_cache: dict[str, str] = {}  # normalized_name -> team_id


def _normalize_name(name: str) -> str:
    """Normalize for matching: lowercase, strip, collapse spaces."""
    if not name or not isinstance(name, str):
        return ""
    return re.sub(r"\s+", " ", name.strip().lower())


def _normalize_school(school: str) -> str:
    """Normalize school name for ESPN team matching."""
    s = _normalize_name(school)
    if not s:
        return ""
    # Common abbreviations (trank/Barttorvik uses "Utah St.", "N.C. State", etc.)
    s = re.sub(r"\bst\.?\s*$", " state", s)
    s = re.sub(r"\bfla\.?\s*$", " florida", s)
    s = re.sub(r"\bcar\.?\s*$", " carolina", s)
    s = s.replace("n.c.", "nc ").replace("n.c ", "nc ")
    s = re.sub(r"\s+", " ", s).strip()
    # Remove common mascots/suffixes for flexible matching
    for suffix in (
        " cyclones", " buckeyes", " hawkeyes", " hoosiers", " boilermakers",
        " wolverines", " spartans", " wildcats", " badgers", " gophers",
        " fighting illini", " illini", " cornhuskers", " terrapins",
        " blue devils", " tar heels", " cavaliers", " seminoles", " hurricanes",
        " cardinals", " bearcats", " jayhawks", " sooners", " longhorns",
        " aggies", " tigers", " bulldogs", " crimson tide", " rebels",
        " cougars", " bearcats", " mountaineers", " hokies", " yellow jackets",
    ):
        if s.endswith(suffix):
            s = s[: -len(suffix)].strip()
            break
    return s


def _fetch_json(url: str) -> dict | list | None:
    """Fetch JSON from URL. Returns None on error."""
    try:
        req = Request(url, headers={"User-Agent": "Hacklytics2026/1.0"})
        with urlopen(req, timeout=8) as resp:
            return json.loads(resp.read().decode())
    except (URLError, HTTPError, json.JSONDecodeError, OSError):
        return None


def _get_espn_team_id(school: str) -> str | None:
    """Map school name to ESPN team ID. Caches teams list."""
    global _espn_team_cache
    if not school or not school.strip():
        return None

    norm_school = _normalize_school(school)
    if not norm_school:
        return None

    if not _espn_team_cache:
        data = _fetch_json(ESPN_TEAMS_URL)
        if not data or "sports" not in data:
            return None
        for sport in data.get("sports", []):
            for league in sport.get("leagues", []):
                for team in league.get("teams", []):
                    t = team.get("team") if isinstance(team, dict) else team
                    if not t:
                        continue
                    tid = t.get("id")
                    if not tid:
                        continue
                    # Build match keys from location, shortDisplayName, displayName, abbreviation
                    for key in (
                        _normalize_school(t.get("location", "")),
                        _normalize_school(t.get("shortDisplayName", "")),
                        _normalize_school(t.get("displayName", "")),
                        _normalize_name(t.get("abbreviation", "")),
                        _normalize_name(t.get("name", "")),
                    ):
                        if key:
                            _espn_team_cache[key] = str(tid)
                    # Also store "iowa state" -> 66, "ohio state" -> 194, etc.
                    loc = _normalize_name(t.get("location", ""))
                    if loc:
                        _espn_team_cache[loc] = str(tid)

    # Try exact match first, then prefix/substring
    if norm_school in _espn_team_cache:
        return _espn_team_cache[norm_school]
    # Try without spaces (e.g. "ohiostate")
    key_no_spaces = norm_school.replace(" ", "")
    if key_no_spaces in _espn_team_cache:
        return _espn_team_cache[key_no_spaces]
    # Try matching any of our keys that contains the school or vice versa
    for k, tid in _espn_team_cache.items():
        if norm_school in k or k in norm_school:
            return tid
    return None


def _fetch_espn_headshot_from_roster(team_id: str, player_name: str) -> str | None:
    """Fetch roster for team, find player by name, return headshot URL."""
    url = ESPN_ROSTER_URL.format(team_id=team_id)
    data = _fetch_json(url)
    if not data or "athletes" not in data:
        return None

    norm_query = _normalize_name(player_name)
    if not norm_query:
        return None

    for athlete in data.get("athletes", []):
        full = athlete.get("fullName") or ""
        display = athlete.get("displayName") or ""
        norm_full = _normalize_name(full)
        norm_display = _normalize_name(display)
        if norm_query == norm_full or norm_query == norm_display:
            h = athlete.get("headshot") or {}
            href = h.get("href") if isinstance(h, dict) else None
            if href:
                return href
        # Fuzzy: "first last" matches "last, first" or "first last"
        parts_q = set(norm_query.split())
        parts_f = set(norm_full.split())
        if parts_q and parts_q == parts_f:
            h = athlete.get("headshot") or {}
            href = h.get("href") if isinstance(h, dict) else None
            if href:
                return href

    return None


@lru_cache(maxsize=500)
def get_nba_headshot(player_name: str) -> str:
    """
    Return NBA player headshot URL from cdn.nba.com, or placeholder if not found.
    """
    if not player_name or not player_name.strip():
        return _placeholder_headshot(player_name or "?", "NBA")

    if not NBA_API_AVAILABLE:
        return _placeholder_headshot(player_name, "NBA")

    try:
        name = _normalize_name(player_name)
        if not name:
            return _placeholder_headshot(player_name, "NBA")

        # nba_api expects "First Last" format
        parts = name.split()
        if len(parts) < 2:
            return _placeholder_headshot(player_name, "NBA")

        matches = nba_players.find_players_by_full_name(player_name.strip())
        if not matches:
            # Try last-name-first or variations
            last_first = f"{parts[-1]} {parts[0]}"
            matches = nba_players.find_players_by_full_name(last_first)
        if not matches:
            return _placeholder_headshot(player_name, "NBA")

        # Prefer current/active player (first result is often best match)
        first = matches[0]
        person_id = first.get("id") if isinstance(first, dict) else getattr(first, "id", None)
        if person_id is None:
            return _placeholder_headshot(player_name, "NBA")

        return f"{NBA_CDN}/{person_id}.png"
    except Exception:
        return _placeholder_headshot(player_name, "NBA")


def _placeholder_headshot(name: str, context: str = "") -> str:
    """Professional-looking fallback when no real headshot is found."""
    clean = (name or "?").strip()
    if not clean:
        clean = "?"
    return f"{UI_AVATARS}/?name={clean.replace(' ', '+')}&background=1a1a2e&color=ff6b35&bold=true&size=260"


@lru_cache(maxsize=1000)
def get_ncaa_headshot(player_name: str, espn_id: str | None = None, school: str = "") -> str:
    """
    Return NCAA player headshot URL from ESPN CDN.
    - If espn_id provided: use direct CDN URL.
    - If school provided: fetch ESPN roster and match player by name.
    - Else: professional placeholder.
    """
    if espn_id and str(espn_id).isdigit():
        return f"{ESPN_NCAA_CDN}/{espn_id}.png"

    if player_name and school:
        team_id = _get_espn_team_id(school)
        if team_id:
            url = _fetch_espn_headshot_from_roster(team_id, player_name)
            if url:
                return url

    return _placeholder_headshot(player_name or "?", "NCAA")
