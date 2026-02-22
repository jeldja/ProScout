import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances

# --- Imports from your KNN comps module ---
# If your project structure is different, change this import to:
# from model.knn_comps import _ensure_numeric, FEATURE_COLS, apply_feature_weights
from .knn_comps import _ensure_numeric, FEATURE_COLS

# Optional: only if you actually have it in knn_comps
try:
    from knn_comps import apply_feature_weights
except Exception:
    def apply_feature_weights(X, feature_cols):
        return X


def _build_X(df: pd.DataFrame, min_mp: int | None = None):
    """
    Build feature matrix:
    - drop NA
    - optional minutes filter (NBA only)
    - ensure numeric
    - apply_feature_weights (if available)
    - L2 normalize rows
    Returns: X, df_clean
    """
    df_clean = df.dropna(subset=FEATURE_COLS).copy()

    if min_mp is not None and "MP" in df_clean.columns:
        df_clean["MP"] = pd.to_numeric(df_clean["MP"], errors="coerce")
        df_clean = df_clean[df_clean["MP"] >= min_mp]

    df_clean = _ensure_numeric(df_clean, FEATURE_COLS)

    X = df_clean[FEATURE_COLS].to_numpy(dtype="float64")

    # If you are weighting features in KNN, do the same here
    try:
        X = apply_feature_weights(X, FEATURE_COLS)
    except Exception:
        pass

    # L2 normalize for cosine-ish clustering
    norms = np.linalg.norm(X, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1.0, norms)
    X = X / norms

    return X, df_clean


def train_nba_archetypes(df_nba: pd.DataFrame, k: int = 8, min_mp: int = 1500):
    """
    Train KMeans archetypes on NBA.
    Returns: kmeans, df_nba_labeled, centroids_df
    """
    X, df_clean = _build_X(df_nba, min_mp=min_mp)

    kmeans = KMeans(n_clusters=k, random_state=42, n_init=25)
    labels = kmeans.fit_predict(X)

    df_clean = df_clean.copy()
    df_clean["cluster"] = labels

    # distance to centroid (for prototype examples)
    dists = pairwise_distances(X, kmeans.cluster_centers_, metric="euclidean")
    df_clean["dist_to_centroid"] = dists[np.arange(len(X)), labels]

    centroids_df = pd.DataFrame(kmeans.cluster_centers_, columns=FEATURE_COLS)

    return kmeans, df_clean, centroids_df


ARCHETYPE_NAMES = {
    0: "Primary Wing Scorer",
    1: "3-and-D Lengthy Wing",
    2: "Ball-Dominant Offensive Guards",
    3: "Defensive Utility Wing",
    4: "Rebounding Interior Big",
    5: "Versatile Point Forward",
    6: "2-Way Sharp-Shooter",
    7: "Pass-First Ball-Handler",
}


def assign_ncaa_to_archetype(player_row: pd.Series, kmeans: KMeans):
    """
    Returns: cluster_id, archetype_name, confidence, centroid_distances
    """
    # Pull features safely
    x = pd.to_numeric(player_row.reindex(FEATURE_COLS), errors="coerce").astype(float).to_numpy().reshape(1, -1)

    # If you are weighting features in KNN, do the same here
    try:
        x = apply_feature_weights(x, FEATURE_COLS)
    except Exception:
        pass

    # L2 normalize
    norm = np.linalg.norm(x, axis=1, keepdims=True)
    norm = np.where(norm == 0, 1.0, norm)
    x = x / norm

    centroid_dists = pairwise_distances(x, kmeans.cluster_centers_, metric="euclidean")[0]
    cluster_id = int(np.argmin(centroid_dists))

    # confidence based on gap between 1st and 2nd closest centroid
    d_sorted = np.sort(centroid_dists)
    if len(d_sorted) >= 2 and d_sorted[1] > 0:
        confidence = float(1.0 - (d_sorted[0] / d_sorted[1]))
    else:
        confidence = 0.0

    return cluster_id, ARCHETYPE_NAMES.get(cluster_id, f"Cluster {cluster_id}"), confidence, centroid_dists


def top_nba_examples(df_nba_labeled: pd.DataFrame, cluster_id: int, n: int = 20):
    sub = df_nba_labeled[df_nba_labeled["cluster"] == cluster_id].copy()
    sub = sub.sort_values("dist_to_centroid", ascending=True).head(n)
    return sub


def inspect_archetypes_k8(df_nba):
    """
    Fit k=8 and print the 20 closest players to each centroid.
    """
    df_clean = df_nba.dropna(subset=FEATURE_COLS).copy()
    if "MP" in df_clean.columns:
        df_clean["MP"] = pd.to_numeric(df_clean["MP"], errors="coerce")
        df_clean = df_clean[df_clean["MP"] >= 1500]

    df_clean = _ensure_numeric(df_clean, FEATURE_COLS)
    X = df_clean[FEATURE_COLS].to_numpy(dtype="float64")

    # L2 normalize
    norms = np.linalg.norm(X, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1.0, norms)
    X = X / norms

    kmeans = KMeans(n_clusters=8, random_state=42, n_init=25)
    labels = kmeans.fit_predict(X)

    df_clean["cluster"] = labels

    # distance to centroid
    dists = pairwise_distances(X, kmeans.cluster_centers_, metric="euclidean")
    df_clean["dist_to_centroid"] = dists[np.arange(len(X)), labels]

    # Print clusters
    for c in range(8):
        print("\n" + "=" * 60)
        print(f"CLUSTER {c} — {ARCHETYPE_NAMES.get(c, f'Cluster {c}')}")
        print("=" * 60)

        cluster_df = (
            df_clean[df_clean["cluster"] == c]
            .sort_values("dist_to_centroid")
            .head(20)
        )

        cols_to_show = [col for col in ["Player", "Team", "Pos", "PTS", "AST", "TRB", "usg"] if col in cluster_df.columns]
        print(cluster_df[cols_to_show])


if __name__ == "__main__":
    from data_loader import load_current_nba_data, make_nba_playstyle_df

    df_nba = load_current_nba_data()
    df_nba = make_nba_playstyle_df(df_nba)

    inspect_archetypes_k8(df_nba)