from flask import Flask, jsonify
from model.data_loader import load_current_ncaa_data, load_current_nba_data, make_ncaa_playstyle_df, make_nba_playstyle_df
from model.knn_comps import build_knn_model, find_similar_players
from model.knn_comps import FEATURE_COLS
import numpy as np
import pandas as pd


app = Flask(__name__)

# Load + engineer data once
df_current = load_current_ncaa_data()
df_nba = load_current_nba_data()

df_current = make_ncaa_playstyle_df(df_current)
df_nba = make_nba_playstyle_df(df_nba)

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

if __name__ == "__main__":
    app.run(debug=True)