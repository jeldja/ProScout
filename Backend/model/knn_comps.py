import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

FEATURE_COLS = [
    # shot selection (where they shoot)
    "rim_share",
    "mid_share",
    "three_share",

    # shot efficiency (how well they shoot there)
    "rim_fg_pct",
    "mid_fg_pct",
    "three_fg_pct",

    # role + efficiency
    "usg",
    "TS_per",
    "eFG",
    "ftr",

    # playmaking + mistakes
    "AST_per",
    "TO_per",

    # rebounding + defense events
    "ORB_per",
    "DRB_per",
    "stl_per",
    "blk_per",

    # Per 36
    "pts_per36",
    "ast_per36",
    "trb_per36",
]


def _ensure_numeric(df, cols):
    """Coerce specified columns to numeric (float)."""
    out = df.copy()
    for c in cols:
        if c not in out.columns:
            raise KeyError(f"Missing required column: {c}")
        out[c] = np.asarray(out[c], dtype="float64")
    return out


from sklearn.neighbors import NearestNeighbors

def build_knn_model(df_nba, metric="cosine"):
    """
    Fit KNN on NBA players (reference dataset).
    Since we're using cosine distance on mostly normalized features (shares/percentages),
    we do NOT standardize. This avoids cross-league scaling distortion.
    """
    df_nba_clean = df_nba.dropna(subset=FEATURE_COLS).copy()
    df_nba_clean = _ensure_numeric(df_nba_clean, FEATURE_COLS)

    X = df_nba_clean[FEATURE_COLS].to_numpy(dtype="float64")

    knn = NearestNeighbors(n_neighbors=10, metric=metric)
    knn.fit(X)

    # keep return signature compatible with your app (scaler=None)
    return knn, None, df_nba_clean


def find_similar_players(player_row, df_nba_clean, knn, scaler, k=5):
    x = player_row[FEATURE_COLS].astype(float).to_numpy().reshape(1, -1)

    # If scaler exists, apply it; otherwise use raw features
    if scaler is not None:
        x = scaler.transform(x)

    distances, indices = knn.kneighbors(x, n_neighbors=k)

    comps = df_nba_clean.iloc[indices[0]].copy()
    comps["similarity_score"] = 1 - distances[0]

    return comps.sort_values("similarity_score", ascending=False)