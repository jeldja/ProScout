"""
Resolve NBA and NCAA player headshot URLs.
- NBA: Uses nba_api to get person ID, then cdn.nba.com
- NCAA: ESPN CDN when we have ID; otherwise ui-avatars placeholder
"""
import re
from functools import lru_cache

try:
    from nba_api.stats.static import players as nba_players
    NBA_API_AVAILABLE = True
except ImportError:
    NBA_API_AVAILABLE = False

NBA_CDN = "https://cdn.nba.com/headshots/nba/latest/1040x760"
ESPN_NCAA_CDN = "https://a.espncdn.com/i/headshots/mens-college-basketball/players/full"
UI_AVATARS = "https://ui-avatars.com/api"


def _normalize_name(name: str) -> str:
    """Normalize for matching: lowercase, strip, collapse spaces."""
    if not name or not isinstance(name, str):
        return ""
    return re.sub(r"\s+", " ", name.strip().lower())


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


def get_ncaa_headshot(player_name: str, espn_id: str | None = None, school: str = "") -> str:
    """
    Return NCAA player headshot URL.
    Uses ESPN CDN if espn_id provided; otherwise a professional placeholder.
    """
    if espn_id and str(espn_id).isdigit():
        return f"{ESPN_NCAA_CDN}/{espn_id}.png"
    return _placeholder_headshot(player_name or "?", "NCAA")
