from flask import Flask, jsonify
from model.data_loader import load_current_ncaa_data, load_current_nba_data, make_ncaa_playstyle_df, make_nba_playstyle_df
from model.knn_comps import build_knn_model, find_similar_players
from model.knn_comps import FEATURE_COLS
import numpy as np
import pandas as pd
from model.archetypes import train_nba_archetypes, assign_ncaa_to_archetype, top_nba_examples, ARCHETYPE_NAMES
from headshots import get_nba_headshot, get_ncaa_headshot

def _round1(x):
    return round(float(x), 1) if x is not None else None

def _pick(row, candidates, default=None):
    for c in candidates:
        if c in row.index and pd.notna(row[c]):
            return row[c]
    return default

def _to_float(x, default=0.0):
    try:
        if x is None or (isinstance(x, float) and np.isnan(x)):
            return default
        return float(x)
    except Exception:
        return default

def _to_pct(x):
    """Accepts 0-1 or 0-100 and returns 0-100."""
    val = _to_float(x, default=0.0)
    if val <= 1.0:
        return val * 100.0
    return val

def _slug_id(name: str) -> str:
    return name.strip().lower().replace(" ", "-")

def _clamp(x, lo=0.0, hi=100.0):
    return max(lo, min(hi, x))

def compute_draftability_score(stats: dict, archetype_conf: float) -> float:
    """
    Placeholder scoring (0-100). Adjust later when your real model is ready. THIS IS JUST DUMMY
    """
    ppg = stats.get("ppg", 0.0)
    fg = stats.get("fgPct", 0.0)
    tp = stats.get("threePct", 0.0)
    ft = stats.get("ftPct", 0.0)
    bpg = stats.get("bpg", 0.0)
    tov = stats.get("topg") or 0.0
    mpg = stats.get("mpg", 0.0)

    score = 40.0
    score += 1.2 * ppg
    score += 0.15 * fg
    score += 0.10 * tp
    score += 0.10 * ft
    score += 3.0 * bpg
    score += 0.25 * mpg
    score -= 2.5 * tov
    score += 20.0 * float(archetype_conf)  # archetype certainty boost

    return _clamp(score, 0.0, 100.0)

def career_outcomes_from_score(score: float):
    """
    Produces probabilities that sum to 1.
    Outcomes are derived from draftabilityScore.
    """
    # Simple piecewise baselines
    if score >= 85:
        probs = {"Star": 0.35, "Starter": 0.45, "Rotation": 0.18, "Long Shot": 0.02}
    elif score >= 70:
        probs = {"Star": 0.15, "Starter": 0.45, "Rotation": 0.35, "Long Shot": 0.05}
    elif score >= 55:
        probs = {"Star": 0.05, "Starter": 0.25, "Rotation": 0.50, "Long Shot": 0.20}
    else:
        probs = {"Star": 0.02, "Starter": 0.10, "Rotation": 0.35, "Long Shot": 0.53}

    descriptions = {
        "Star": "High-impact NBA player; multiple seasons as a top option or elite defender.",
        "Starter": "Reliable NBA starter-level contributor with a stable role.",
        "Rotation": "Bench/rotation contributor; role depends on fit and development.",
        "Long Shot": "Needs major development or elite fit to stick long-term in the league.",
    }

    return [
        {"outcome": k, "probability": round(float(v) * 100, 1), "description": descriptions[k]}
        for k, v in probs.items()
    ]

app = Flask(__name__)

# Load + engineer data once
df_current = load_current_ncaa_data()
df_nba = load_current_nba_data()

df_current = make_ncaa_playstyle_df(df_current)
df_nba = make_nba_playstyle_df(df_nba)

K_ARCHETYPES = 8
kmeans_archetypes, df_nba_labeled, _centroids_df = train_nba_archetypes(df_nba, k=K_ARCHETYPES, min_mp=1500)


# Normalize player name column for lookup
df_current["player_name"] = df_current["player_name"].astype(str).str.strip().str.lower()
df_nba["Player"] = df_nba["Player"].astype(str).str.strip()

# Testing
df_current = df_current[
    (df_current["AST_per"] <= 60) &
    (df_current["TO_per"] <= 60) &
    (df_current["ORB_per"] <= 50) &
    (df_current["DRB_per"] <= 60)
]

# Optional but highly recommended
df_current = df_current[df_current["Min_per"] > 10]
df_current = df_current[df_current["GP"] > 10]
# Build KNN ON NBA once
knn, scaler, df_nba_clean = build_knn_model(df_nba)

@app.route("/")
def home():
    return "NBA Scouting KNN API Running"

@app.route("/players")
def list_players():
    players = df_current["player_name"].tolist()
    return jsonify(players)

@app.route("/comps/<player_name>")
def get_comps(player_name):
    import numpy as np
    import pandas as pd

    # normalize input
    player_name = player_name.strip().lower()

    player_match = df_current[df_current["player_name"] == player_name]
    if player_match.empty:
        return jsonify({"error": "Player not found"}), 404

    player_row = player_match.iloc[0]

    # -------- Debug (keep for now) --------
    print("QUERY:", player_name, "MATCHED:", player_row["player_name"])

    x = pd.to_numeric(player_row[FEATURE_COLS], errors="coerce")

    print("\n--- DEBUG NCAA VECTOR ---")
    print("MATCHED:", player_row["player_name"])
    print("NaNs:", int(x.isna().sum()), "out of", len(x))
    print("min/max:", float(np.nanmin(x)), float(np.nanmax(x)))
    print("first 8:", x.head(8).to_dict())

    sig = tuple(np.round(x.fillna(-999).to_numpy(), 6))
    print("signature hash:", hash(sig))
    # -------------------------------------

    # -------- Post-filter NBA pool by role --------
    USG_BAND = 5.0   # +/- 5 usage points (0-100 scale)
    MIN_MP = 2000     # minimum total minutes in season

    target_usg = float(player_row["usg"])

    nba_pool = df_nba_clean[
        (pd.to_numeric(df_nba_clean["MP"], errors="coerce") >= MIN_MP) &
        (pd.to_numeric(df_nba_clean["usg"], errors="coerce").between(target_usg - USG_BAND, target_usg + USG_BAND))
    ].copy()

    # Fallbacks if too strict
    if len(nba_pool) < 50:
        nba_pool = df_nba_clean[pd.to_numeric(df_nba_clean["MP"], errors="coerce") >= MIN_MP].copy()
    if len(nba_pool) < 50:
        nba_pool = df_nba_clean.copy()

    # Build KNN on the filtered pool (fast; only a few hundred rows)
    knn_pool, scaler_pool, nba_pool_clean = build_knn_model(nba_pool)

    # Now return NBA comps from that pool
    comps = find_similar_players(
        player_row,
        nba_pool_clean,
        knn_pool,
        scaler_pool,
        k=5
    )
    # --------------------------------------------

    cols = [c for c in ["Player", "Team", "Pos", "PTS", "AST", "TRB", "MP", "similarity_score"] if c in comps.columns]
    result = comps[cols].to_dict(orient="records")

    return jsonify(result)


@app.get("/archetype/<player_name>")
def get_archetype(player_name):
    name_key = player_name.strip().lower()

    row = df_current[df_current["player_name"] == name_key]
    if row.empty:
        return jsonify({"error": f"Player not found: {player_name}"}), 404

    player_row = row.iloc[0]

    cluster_id, archetype_name, confidence, _ = assign_ncaa_to_archetype(
        player_row, kmeans_archetypes
    )

    # Choose which stats you want displayed
    stat_cols = [
        "PTS", "AST", "TRB", "usg",
        "ORB_per", "DRB_per", "AST_per",
        "TS_per", "Min_per", "GP"
    ]

    # Only keep stats that actually exist
    stat_cols = [c for c in stat_cols if c in df_current.columns]

    stats_payload = {
        col: float(player_row[col])
        for col in stat_cols
        if pd.notna(player_row[col])
    }

    return jsonify({
        "player": player_row["player_name"],
        "archetype": archetype_name,
        "confidence": round(float(confidence), 4),
        "stats": stats_payload
    })

@app.get("/player/<player_name>")
def get_player(player_name):
    # Accept slug (marcus-williams) or name (marcus williams)
    name_key = player_name.strip().lower().replace("-", " ")

    # NCAA lookup uses df_current["player_name"] (already normalized in your app)
    match = df_current[df_current["player_name"] == name_key]
    if match.empty:
        return jsonify({"error": f"Player not found: {player_name}"}), 404

    row = match.iloc[0]

    # --- Archetype ---
    cluster_id, archetype_name, archetype_conf, _ = assign_ncaa_to_archetype(row, kmeans_archetypes)

    # --- Stats for your UI (match TS interface camelCase) ---
    # Minutes per game
    min_per = _to_float(_pick(row, ["Min_per"]), default=None)
    mpg = min_per * 40 * .01 if min_per is not None else None

    # Per-game stats (your dataset already has per-game columns like pts, ast, treb)
    ppg = _to_float(_pick(row, ["pts"]), default=None)
    rpg = _to_float(_pick(row, ["treb"]), default=None)
    apg = _to_float(_pick(row, ["ast"]), default=None)
    spg = _to_float(_pick(row, ["stl"]), default=None)
    bpg = _to_float(_pick(row, ["blk"]), default=None)

    # ---- Compute TRUE FG% ----
    twoPA = _to_float(_pick(row, ["twoPA"]), default=0.0)
    TPA = _to_float(_pick(row, ["TPA"]), default=0.0)

    twoP_pct = _to_pct(_pick(row, ["twoP_per"]))   # already 0-100 in your data
    threeP_pct = _to_pct(_pick(row, ["TP_per"]))
    ft_pct = _to_pct(_pick(row, ["FT_per"]))

    fg_pct = None
    if (twoPA + TPA) > 0:
        fg_pct = (twoP_pct * twoPA + threeP_pct * TPA) / (twoPA + TPA)

    stats = {
        "ppg": _round1(ppg),
        "rpg": _round1(rpg),
        "apg": _round1(apg),
        "spg": _round1(spg),
        "bpg": _round1(bpg),
        "fgPct": _round1(fg_pct),
        "threePct": _round1(threeP_pct),
        "ftPct": _round1(ft_pct),
        "topg": None,
        "mpg": _round1(mpg),
    }

    # --- NBA comps (reuse your existing comps logic/pool) ---
    # Keep it simple: just use the already-built df_nba_clean + knn + scaler
    comps_df = find_similar_players(row, df_nba_clean, knn, scaler, k=5)

    comps = []
    for _, r in comps_df.iterrows():
        nba_name = str(r.get("Player", ""))
        comps.append({
            "name": nba_name,
            "team": str(r.get("Team", "")),
            "position": str(r.get("Pos", "")),
            "matchScore": round(float(r.get("similarity_score", 0.0) * 100), 0),
            "headshotUrl": get_nba_headshot(nba_name),  # you can fill later if you add a mapping table
            "similarities": [],
            "differences": [],
            "stats": {
                "ppg": _round1(_to_float(r.get("PTS"))),
                "rpg": _round1(_to_float(r.get("TRB"))),
                "apg": _round1(_to_float(r.get("AST"))),
            }
        })

    primary_comp = comps[0]["name"] if len(comps) > 0 else ""

    # --- Draftability + outcomes, this is dummy ---
    draft_score = compute_draftability_score(stats, archetype_conf)
    outcomes = career_outcomes_from_score(draft_score)

    # --- Build Player object (match TS interface) ---
    name = str(row.get("player_name", player_name))
    school = str(_pick(row, ["School", "school", "Team", "team"], default=""))

    player_payload = {
        "id": _slug_id(name),
        "name": name.title(),
        "headshotUrl": get_ncaa_headshot(name, school=school),
        "school": school,
        "year": str(_pick(row, ["Year", "year", "Class", "class"], default="")),
        "position": str(_pick(row, ["Pos", "pos", "Position", "position"], default="")),
        "height": str(_pick(row, ["Height", "height"], default="")),
        "weight": str(_pick(row, ["Weight", "weight"], default="")),
        "archetype": archetype_name,
        "archetypeConfidence": round(float(archetype_conf) * 100, 1),
        "nbaComp": primary_comp,
        "nbaComparisons": comps,
        "stats": stats,
        "careerOutcomes": outcomes,
        "seasonLog": [],       # fill later if you add season-by-season NCAA data
        "strengths": [],       # fill later (or generate heuristically)
        "weaknesses": [],      # fill later
        "draftabilityScore": round(float(draft_score), 1),
    }

    return jsonify(player_payload)

if __name__ == "__main__":
    app.run(debug=True)