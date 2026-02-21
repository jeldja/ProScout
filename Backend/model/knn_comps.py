import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors


FEATURE_COLS = [
    "ORtg",
    "usg",
    "eFG",
    "TS_per",
    "ORB_per",
    "DRB_per",
    "AST_per",
    "TO_per",
    "FTA",
    "FT_per",
    "twoPA",
    "twoP_per",
    "TPA",
    "TP_per",
    "blk_per",
    "stl_per",
    "ftr",
    "porpag",
    "adjoe",
    "ast/tov",
    "rimmade+rimmiss",
    "rimmade/(rimmade+rimmiss)",
    "midmade+midmiss",
    "midmade/(midmade+midmiss)",
    "dunksmiss+dunksmade",
    "dunksmade/(dunksmade+dunksmiss)",
    "adrtg",
    "dporpag",
    "stops",
    "pts", 
    "oreb", 
    "dreb", 
    "treb", 
    "ast", 
    "stl", 
    "blk"

]


def build_knn_model(df_past):
    df_past = df_past.dropna(subset=FEATURE_COLS)

    X = df_past[FEATURE_COLS].astype(float).to_numpy()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    knn = NearestNeighbors(n_neighbors=5, metric="cosine")
    knn.fit(X_scaled)

    return knn, scaler, df_past


def find_similar_players(player_row, df_past, knn, scaler, k=5):
    x = player_row[FEATURE_COLS].astype(float).to_numpy().reshape(1, -1)
    x_scaled = scaler.transform(x)

    distances, indices = knn.kneighbors(x_scaled, n_neighbors=k)

    comps = df_past.iloc[indices[0]].copy()
    comps["similarity_score"] = 1 - distances[0]

    return comps.sort_values("similarity_score", ascending=False)