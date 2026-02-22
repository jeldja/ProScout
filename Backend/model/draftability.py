"""
NBA projection model: train on former NCAA players (2009-2021 drafted) and how they
performed in the NBA. Uses scaled demographics (age, height) and NCAA production stats,
then predicts how good current college players will be in the NBA.
"""

import os
import re

import pandas as pd
import numpy as np

import data_loader

# =========================
# Paths / Inputs
# =========================


# Historical NCAA pool (former/current nba player college stats)
df_ncaa = data_loader.load_past_ncaa_data()

# Local B-Ref exports
NBA_STATS_PATH = os.path.join(data_loader.DATA_DIR, "NBA_Stats_2009_2026.csv")
NBA_ADV_PATH = os.path.join(data_loader.DATA_DIR, "NBA_Advanced_2009_2026.csv")

# =========================
# Helper functions
# =========================
def normalize_player_name(s: pd.Series) -> pd.Series:
    return (
        s.astype(str)
        .str.replace("*", "", regex=False)
        .str.strip()
        .str.lower()
    )

def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out.columns = out.columns.astype(str).str.strip()
    return out

def pick_one_row_per_player_season(df: pd.DataFrame,
                                  player_id_col="Player-additional",
                                  season_col="Season",
                                  team_col="Team") -> pd.DataFrame:
   
    df = df.copy()

    # Some exports use "Tm" instead of "Team"
    if team_col not in df.columns and "Tm" in df.columns:
        team_col = "Tm"

    # Create priority: TOT best (0), XTM next (1), team rows last (2)
    team = df[team_col].astype(str).str.strip().fillna("")

    is_tot = team.eq("TOT")
    is_xtm = team.str.match(r"^\d+TM$")  # 2TM, 3TM, 4TM...
    priority = np.where(is_tot, 0, np.where(is_xtm, 1, 2))

    df["_priority"] = priority

    # Sort so the best row for each (player, season) comes first
    df = df.sort_values([player_id_col, season_col, "_priority"])

    # Keep first row per (player, season)
    df = df.drop_duplicates(subset=[player_id_col, season_col], keep="first")

    return df.drop(columns=["_priority"], errors="ignore")


# =========================
# Load NBA regular + advanced
# =========================

nba_stats = clean_columns(pd.read_csv(NBA_STATS_PATH, encoding="utf-8", encoding_errors="ignore"))
nba_adv   = clean_columns(pd.read_csv(NBA_ADV_PATH,   encoding="utf-8", encoding_errors="ignore"))

# Make sure keys exist and normalize player names for merging later
for d in [nba_stats, nba_adv]:
    # Make sure these exist
    if "Player-additional" not in d.columns:
        raise ValueError("Expected 'Player-additional' column in NBA CSV (Basketball-Reference player id).")
    if "Season" not in d.columns:
        raise ValueError("Expected 'Season' column in NBA CSV.")

    if "Player" in d.columns:
        d["Player"] = normalize_player_name(d["Player"])


# =========================
# One row per player-season (fix traded players with multiple rows)
# =========================

nba_stats_1 = pick_one_row_per_player_season(nba_stats, player_id_col="Player-additional", season_col="Season", team_col="Team")
nba_adv_1   = pick_one_row_per_player_season(nba_adv,   player_id_col="Player-additional", season_col="Season", team_col="Team")


# =========================
# Merge regular + advanced on (Player-additional, Season)
# =========================

KEYS = ["Player-additional", "Season"]

# handle dupes in the two datasets
nba_merged = nba_stats_1.merge(
    nba_adv_1,
    on=KEYS,
    how="inner",
    suffixes=("_reg", "_adv")
)

#rename from merging
nba_merged = nba_merged.rename(columns={
    "Player_reg": "Player",
    "Age_reg": "Age",
    "Team_reg": "Team",
    "G_reg": "G",
    "GS_reg": "GS",
    "MP_reg": "MP",
    "Rk_reg": "Rk"
})

# Keep a clean "player_name" column (use whichever Player column exists)
if "Player_reg" in nba_merged.columns:
    nba_merged["player_name"] = nba_merged["Player_reg"]
elif "Player_adv" in nba_merged.columns:
    nba_merged["player_name"] = nba_merged["Player_adv"]
elif "Player" in nba_merged.columns:
    nba_merged["player_name"] = nba_merged["Player"]
else:
    nba_merged["player_name"] = None


# =========================
# Filter NBA rows to players present in NCAA training pool
# =========================

# normalize NCAA player names for formatting
df_ncaa["player_name"] = normalize_player_name(df_ncaa["player_name"])

# Match NBA players to NCAA drafted players
nba_for_training = nba_merged[nba_merged["player_name"].isin(df_ncaa["player_name"])].copy()


# ----------------------------
# Clean NCAA data to match NBA data
# ----------------------------

# Normalize player names
df_ncaa["player_name"] = (
    df_ncaa["player_name"]
    .astype(str)
    .str.replace("*", "", regex=False)
    .str.strip()
    .str.lower()
)

# Clean column names (remove accidental spaces)
df_ncaa.columns = df_ncaa.columns.astype(str).str.strip()

# Make sure year is numeric
df_ncaa["year"] = pd.to_numeric(df_ncaa["year"], errors="coerce")

# lean team/conf text
for c in ["team", "conf"]:
    if c in df_ncaa.columns:
        df_ncaa[c] = df_ncaa[c].astype(str).str.strip()

# Keep ONLY FINAL college season per player (latest year)
ncaa_train = (
    df_ncaa
    .dropna(subset=["player_name", "year"])
    .sort_values(["player_name", "year"])
    .drop_duplicates(subset="player_name", keep="last")
    .reset_index(drop=True)
)



# Create Peak values and seasons for past NBA players - BPM, VORP, PTS, MP
# Used later for model targets and draftability score. We define "peak season" as highest VORP season

for col in ["BPM", "VORP", "PTS", "MP"]:
    if col in nba_for_training.columns:
        nba_for_training[col] = pd.to_numeric(nba_for_training[col], errors="coerce")

# drop rows missing the peak selector
nba_tmp = nba_for_training.dropna(subset=["player_name", "VORP"]).copy()

# PEAK SEASON = max VORP per player
idx = nba_tmp.groupby("player_name")["VORP"].idxmax()
nba_peaks = nba_tmp.loc[idx, ["player_name", "Season", "BPM", "VORP", "PTS", "MP"]].copy()

nba_peaks = nba_peaks.rename(columns={
    "Season": "peak_season",
    "BPM": "peak_bpm",
    "VORP": "peak_vorp",
    "PTS": "peak_pts",
    "MP": "peak_mp"
}).reset_index(drop=True)


# MERGE PEAK NBA WITH NCAA DATA

train_df = ncaa_train.merge(nba_peaks, on="player_name", how="inner")

# Encode class year to numeric, used for assessing draft model
year_map = {
    "Fr": 1,
    "So": 2,
    "Jr": 3,
    "Sr": 4
}
train_df["class_num"] = train_df["yr"].map(year_map)


# ----------------------------
# Fix Excel height column ht -> height_in (inches)
# Excel mistake fixing
# ----------------------------

MONTH_TO_FEET = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4,
    "may": 5, "jun": 6, "jul": 7, "aug": 8,
    "sep": 9, "oct": 10, "nov": 11, "dec": 12
}

def parse_height_in(x):
    if pd.isna(x):
        return np.nan

    s = str(x).strip()
    if "-" not in s:
        return np.nan

    a, b = s.split("-", 1)
    a = a.strip()
    b3 = b.strip().lower()[:3]

    # If right side is a month abbreviation -> day-month format like "2-Jun"
    # feet = Jun (6), inches = 2
    if b3 in MONTH_TO_FEET:
        try:
            feet = MONTH_TO_FEET[b3]
            inches = int(re.sub(r"\D", "", a) or "0")
            return feet * 12 + inches
        except:
            return np.nan

    # If left side is a month abbreviation -> month-day format like "Jun-00"
    # feet = Jun (6), inches = 00
    a3 = a.lower()[:3]
    if a3 in MONTH_TO_FEET:
        try:
            feet = MONTH_TO_FEET[a3]
            inches = int(re.sub(r"\D", "", b) or "0")
            return feet * 12 + inches
        except:
            return np.nan

    return np.nan

train_df["height_in"] = train_df["ht"].apply(parse_height_in)

# =========================
# Define modeling targets + feature columns
# =========================

# NBA outcomes we want to predict
TARGET_COLS = ["peak_bpm", "peak_vorp", "peak_pts", "peak_mp"]

# College Statistic Features that are used for modeling
FEATURE_COLS = [
    "Min_per",
    "ORtg",
    "usg",
    "eFG",
    "TS_per",
    "TP_per",
    "twoP_per",
    "ftr",
    "bpm",
    "pts",
    "treb",
    "ast",
    "ORB_per",
    "DRB_per",
    "AST_per",
    "TO_per",
    "blk_per",
    "stl_per",
    "height_in", 
    "class_num" 
]

# Columns to don't want as features
DROP_COLS = [
    "player_name", "team", "conf", "yr", "type", "pid", "peak_season",
    "ht"  # you can drop this now since you have height_in
]

# Drop draft pick to avoid leakage
if "pick" in train_df.columns:
    DROP_COLS.append("pick")

# Keep ONLY numeric columns for features 
feature_cols = [
    c for c in train_df.columns
    if c not in set(DROP_COLS + TARGET_COLS)
    and pd.api.types.is_numeric_dtype(train_df[c])
]

# Training table, features + targets
df_model = train_df[feature_cols + TARGET_COLS].dropna().reset_index(drop=True)


# =========================
# Load current NCAA players (inference dataset)
# =========================

CURRENT_PATH = os.path.join(data_loader.DATA_DIR, "current_NCAA_players.csv")
df_current = pd.read_csv(CURRENT_PATH, low_memory=False)

# Strip column names
df_current.columns = df_current.columns.astype(str).str.strip()

df_current["player_name"] = (
    df_current["player_name"]
      .astype(str)
      .str.replace("*", "", regex=False)
      .str.strip()
      .str.lower()
)

def clean_ncaa_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.astype(str).str.strip()
    return df

train_df = clean_ncaa_columns(train_df)
df_current = clean_ncaa_columns(df_current)

df_current["class_num"] = df_current["yr"].map(year_map)
df_current["height_in"] = df_current["ht"].apply(parse_height_in)


# CREATE DF FOR TRAINING AND CURRENT DATA
def build_model_df(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Ensure numeric
    for col in FEATURE_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Fix percentage scaling
    pct_cols = ["TS_per", "eFG", "TP_per", "twoP_per", "ftr"]

    for col in pct_cols:
        if col in df.columns:
            if df[col].max() > 1:
                df[col] = df[col] / 100

    # Ensure all features exist
    for col in FEATURE_COLS:
        if col not in df.columns:
            df[col] = 0

    # Final selection + fill
    df_model = df[FEATURE_COLS].fillna(0)

    return df_model

df_training_model = build_model_df(train_df)
df_current_model = build_model_df(df_current)

# =========================
# SAVE DEBUG CSVs (VERY IMPORTANT)
# =========================

# 1. Training dataset
train_debug = pd.concat(
    [
        train_df[["player_name", "team", "conf"]].reset_index(drop=True),
        df_training_model.reset_index(drop=True),
        train_df[TARGET_COLS].reset_index(drop=True)
    ],
    axis=1
)

# 2. Current dataset (features only)
current_debug = pd.concat(
    [
        df_current[["player_name", "team", "conf"]].reset_index(drop=True),
        df_current_model.reset_index(drop=True)
    ],
    axis=1
)





# =========================
# Model training + inference (MLP)
# =========================

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np

# -------------------------
# Build ONE aligned training dataframe
# -------------------------
# concatenate features and targets into single dataframe for:
# - rows stay aligned and safely drop rows with missing targets

X_df = build_model_df(df_model)[FEATURE_COLS].apply(pd.to_numeric, errors="coerce").fillna(0)
y_df = df_model[TARGET_COLS].apply(pd.to_numeric, errors="coerce")

train_all = pd.concat([X_df, y_df], axis=1)

# Drop any rows with missing targets (features can stay with fillna(0))
train_all = train_all.dropna(subset=TARGET_COLS).reset_index(drop=True)

X = train_all[FEATURE_COLS]
y = train_all[TARGET_COLS]

print("X/y shapes:", X.shape, y.shape)

# -------------------------
# 2) Train/validation split
# -------------------------
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------
# Scale targets (fit scaler only on training labels)
# -------------------------
y_scaler = StandardScaler()
y_train_scaled = y_scaler.fit_transform(y_train)
y_val_scaled   = y_scaler.transform(y_val)

# -------------------------
# Define and fit MLP
# -------------------------
mlp = MLPRegressor(
    hidden_layer_sizes=(128, 64),
    activation="relu",
    solver="adam",
    alpha=1e-4,
    learning_rate_init=1e-3,
    batch_size=64,
    max_iter=800,
    early_stopping=True,
    validation_fraction=0.15,
    n_iter_no_change=25,
    random_state=42
)

mlp_model = Pipeline([
    ("x_scaler", StandardScaler()),
    ("mlp", mlp)
])

mlp_model.fit(X_train, y_train_scaled)

# -------------------------
# Validation )
# -------------------------
# Used for model sanity and not used later
pred_val_scaled = mlp_model.predict(X_val)
pred_val = y_scaler.inverse_transform(pred_val_scaled)
pred_val = pd.DataFrame(pred_val, columns=TARGET_COLS, index=y_val.index)

# -------------------------
# Predict current players (same FEATURE_COLS!)
# -------------------------
X_current = (
    df_current_model[FEATURE_COLS]
    .apply(pd.to_numeric, errors="coerce")
    .fillna(0)
)

pred_current_scaled = mlp_model.predict(X_current)
pred_current = y_scaler.inverse_transform(pred_current_scaled)
pred_current = pd.DataFrame(pred_current, columns=TARGET_COLS)

# Bundle predictions with other identifiers
pred_out = pd.concat(
    [
        df_current[["player_name", "team", "conf", "GP", "Min_per", "mp"]].reset_index(drop=True),
        pred_current.reset_index(drop=True)
    ],
    axis=1
)

# add class_num for scoring to base off of age/class (younger = better for draftability)
if "class_num" in df_current_model.columns:
    pred_out["class_num"] = pd.to_numeric(df_current_model["class_num"], errors="coerce").reset_index(drop=True)
elif "yr" in df_current.columns:
    year_map = {"Fr": 1, "So": 2, "Jr": 3, "Sr": 4}
    pred_out["class_num"] = df_current["yr"].map(year_map).reset_index(drop=True)
else:
    pred_out["class_num"] = np.nan

# -------------------------
# Eligibility filter + dedupe
# -------------------------
gp = pd.to_numeric(pred_out["GP"], errors="coerce").fillna(0)
mpg = pd.to_numeric(pred_out["mp"], errors="coerce").fillna(0)        # minutes per game
min_per = pd.to_numeric(pred_out["Min_per"], errors="coerce").fillna(0)

elig_mask = (gp >= 10) & (mpg >= 12) & (min_per >= 18)
pred_out["eligible"] = elig_mask

# keep minutes numeric
pred_out["mp"] = pd.to_numeric(pred_out["mp"], errors="coerce").fillna(0)

# dedupe players and keep highest mpg if multiple rows per player
pred_out = (
    pred_out.sort_values(["player_name", "mp"], ascending=[True, False])
            .drop_duplicates("player_name", keep="first")
            .reset_index(drop=True)
)

# -------------------------
# Guardrails: clip to training distribution
# -------------------------
for col in TARGET_COLS:
    lo = float(y[col].quantile(0.01))
    hi = float(y[col].quantile(0.99))
    pred_out[col] = pred_out[col].clip(lo, hi)

# -------------------------
# Draftability score (0-100): heavy class emphasis + 4 predicted stats
# -------------------------
# Create single composite score using:
# - Predicted NBA Peak metrics through model
# - class year (Fr=1 best => score=1.0; Sr=4 => score=0.0)

bounds = {}
# get rid of outliers
for col in TARGET_COLS:
    lo = float(y[col].quantile(0.05))
    hi = float(y[col].quantile(0.95))
    bounds[col] = (lo, hi)

def robust_minmax(series, lo, hi):
    s = pd.to_numeric(series, errors="coerce")
    s = s.clip(lo, hi)
    return (s - lo) / (hi - lo + 1e-9)

# scale each predicted stat to 0..1 based on training distribution
bpm_s  = robust_minmax(pred_out["peak_bpm"],  *bounds["peak_bpm"])
vorp_s = robust_minmax(pred_out["peak_vorp"], *bounds["peak_vorp"])
pts_s  = robust_minmax(pred_out["peak_pts"],  *bounds["peak_pts"])
mp_s   = robust_minmax(pred_out["peak_mp"],   *bounds["peak_mp"])

# class score: younger is better. (Fr=1 best => score=1.0; Sr=4 => score=0.0)
class_num = pd.to_numeric(pred_out["class_num"], errors="coerce")
class_s = (1.0 - (class_num - 1.0) / 3.0).clip(0, 1).fillna(0.5)

# weights (heavier emphasis on class)
W_CLASS = 0.40
W_BPM   = 0.20
W_VORP  = 0.20
W_PTS   = 0.10
W_MP    = 0.10

raw = (W_CLASS*class_s + W_BPM*bpm_s + W_VORP*vorp_s + W_PTS*pts_s + W_MP*mp_s)

# -------------------------
# Rescale to 0–100 so top player = 100
# -------------------------

pred_out["draftability_raw"] = raw  

# Only rescale among eligible players
eligible_scores = pred_out.loc[pred_out["eligible"], "draftability_raw"]

if len(eligible_scores) > 0:
    min_score = eligible_scores.min()
    max_score = eligible_scores.max()

    # Avoid divide-by-zero if all values are same
    if max_score - min_score > 1e-9:
        scaled = (pred_out["draftability_raw"] - min_score) / (max_score - min_score)
    else:
        scaled = np.zeros(len(pred_out))

    pred_out["draftability_score"] = 100.0 * scaled
else:
    pred_out["draftability_score"] = 0.0

# Ineligible players get 0 no matter what
pred_out.loc[~pred_out["eligible"], "draftability_score"] = 0.0

# Clean up
pred_out["draftability_score"] = pred_out["draftability_score"].clip(0, 100)


# -------------------------
# Percentiles for the four peak stats
# -------------------------
eligible_mask = pred_out["eligible"].fillna(False)
PCT_COLS = ["peak_bpm", "peak_vorp", "peak_pts", "peak_mp"]
for col in PCT_COLS:
    pct_name = f"{col}_pct"

    pred_out[pct_name] = 0.0  # default for ineligible

    pred_out.loc[eligible_mask, pct_name] = (
        pred_out.loc[eligible_mask, col]
        .rank(method="average", pct=True)
        .mul(100.0)
    )


# ==============================
# FINAL DATAFRAME - USED IN UI
# ==============================
pred_out = pred_out.sort_values("draftability_score", ascending=False).reset_index(drop=True)
output_path = os.path.join(data_loader.DATA_DIR, "mlp_current_predictions_with_draftability.csv")
pred_out.to_csv(output_path, index=False)


# Little profile print
stats_cols = TARGET_COLS + ["draftability_score"]
profile = pred_out[stats_cols].describe(
    percentiles=[0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99]
)

print(profile)