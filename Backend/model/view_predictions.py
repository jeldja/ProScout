"""
View/access MLP predictions produced by draftability.py.
Loads the predictions CSV and provides lookup by player name.
"""

import os
import pandas as pd
from model import data_loader

PREDICTIONS_PATH = os.path.join(data_loader.DATA_DIR, "mlp_current_predictions_with_draftability.csv")
_pred_df: pd.DataFrame | None = None


def _load_predictions() -> pd.DataFrame:
    """Load predictions CSV (cached)."""
    global _pred_df
    if _pred_df is None:
        _pred_df = pd.read_csv(PREDICTIONS_PATH)
        _pred_df["player_name"] = _pred_df["player_name"].astype(str).str.strip().str.lower()
    return _pred_df


def get_player_projections(player_name: str) -> dict | None:
    """
    Look up projected NBA peak stats, percentiles, and draftability for a player.
    Returns dict with: peak_bpm, peak_vorp, peak_pts, peak_mp, draftability_score,
    and peak_bpm_pct, peak_vorp_pct, peak_pts_pct, peak_mp_pct (0-100 percentile vs peers).
    """
    try:
        df = _load_predictions()
    except FileNotFoundError:
        return None

    name_key = str(player_name).strip().lower()
    match = df[df["player_name"] == name_key]
    if match.empty:
        return None

    row = match.iloc[0]
    return {
        "peak_bpm": float(row.get("peak_bpm", 0)),
        "peak_vorp": float(row.get("peak_vorp", 0)),
        "peak_pts": float(row.get("peak_pts", 0)),
        "peak_mp": float(row.get("peak_mp", 0)),
        "peak_bpm_pct": float(row.get("peak_bpm_pct", 50)),
        "peak_vorp_pct": float(row.get("peak_vorp_pct", 50)),
        "peak_pts_pct": float(row.get("peak_pts_pct", 50)),
        "peak_mp_pct": float(row.get("peak_mp_pct", 50)),
        "draftability_score": float(row.get("draftability_score", 0)),
    }