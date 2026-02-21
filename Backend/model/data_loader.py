import os
import pandas as pd
import numpy as np

# absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../Backend
DATA_DIR = os.path.join(BASE_DIR, "data")                               # .../Backend/data


def load_current_ncaa_data():
    # Data files live in Backend/data/
    data_path = os.path.join(DATA_DIR, "trank_data.csv")
    header_path = os.path.join(DATA_DIR, "pstatheaders.xlsx")

    # Load header row (column names) from Excel
    column_names = pd.read_excel(header_path, nrows=0).columns.tolist()

    # Load raw CSV
    df = pd.read_csv(data_path, header=None)

    # Trim to match the number of headers 
    df = df.iloc[:, :len(column_names)]

    # Assign headers
    df.columns = column_names

    df.columns = df.columns.str.strip()

    df = df.iloc[:, :-2]


    return df


def load_past_ncaa_data():
    ncaa_path = os.path.join(DATA_DIR, "CollegeBasketballPlayers2009-2021.csv")
    drafted_path = os.path.join(DATA_DIR, "DraftedPlayers2009-2021.xlsx")

    df_ncaa = pd.read_csv(ncaa_path, low_memory=False)
    df_drafted = pd.read_excel(drafted_path)

    # Normalize names
    drafted_name_col = [col for col in df_drafted.columns if col.lower() in ["player", "player_name", "name"]][0]

    df_ncaa["player_name"] = df_ncaa["player_name"].astype(str).str.strip().str.lower()
    df_drafted[drafted_name_col] = df_drafted[drafted_name_col].astype(str).str.strip().str.lower()

    # Keep only drafted players
    df = df_ncaa.merge(
        df_drafted[[drafted_name_col]],
        left_on="player_name",
        right_on=drafted_name_col,
        how="inner"
    )

    df = df.dropna()

    df = df.iloc[:, :-3]

    df.columns = df.columns.str.strip()

    return df

def load_current_nba_data():
    adv_path = os.path.join(DATA_DIR, "2025_advanced.csv")
    per_path = os.path.join(DATA_DIR, "2025_per_game.csv")
    shoot_path = os.path.join(DATA_DIR, "2025_shooting.csv")

    df_adv = pd.read_csv(adv_path)
    df_per = pd.read_csv(per_path)

    # shooting has an extra top row of grouped headers -> use the 2nd row as header
    df_shoot = pd.read_csv(shoot_path, header=1)

    # Clean column names: strip + remove leading/trailing whitespace
    for df in [df_adv, df_per, df_shoot]:
        df.columns = df.columns.astype(str).str.strip()

    # Some exports use "Tm" instead of "Team"
    for df in [df_adv, df_per, df_shoot]:
        if "Tm" in df.columns and "Team" not in df.columns:
            df.rename(columns={"Tm": "Team"}, inplace=True)

    # Fix the specific shooting split column names that have leading spaces in the CSV
    df_shoot.rename(columns={
        " 3-10": "3-10",
        " 10-16": "10-16",
    }, inplace=True)

    # Rename the weird last column (-9999) to something usable (it contains player ids)
    if "-9999" in df_shoot.columns:
        df_shoot.rename(columns={"-9999": "player_id"}, inplace=True)

    # Remove asterisks from player names
    for df in [df_adv, df_per, df_shoot]:
        if "Player" in df.columns:
            df["Player"] = (
                df["Player"].astype(str)
                .str.replace("*", "", regex=False)
                .str.strip()
            )

    # Drop League Average if present
    for name, df in [("adv", df_adv), ("per", df_per), ("shoot", df_shoot)]:
        if "Player" in df.columns:
            df = df[df["Player"] != "League Average"]
        if name == "adv": df_adv = df
        if name == "per": df_per = df
        if name == "shoot": df_shoot = df

    # Natural join keys (these exist in your shooting file: Player, Age, Team)
    join_keys = ["Player", "Team", "Age"]

    df = df_adv.merge(df_per, on=join_keys, how="inner", suffixes=("", "_per"))
    df = df.merge(df_shoot, on=join_keys, how="inner", suffixes=("", "_shoot"))

    # Remove duplicated columns that result from merge
    df = df.loc[:, ~df.columns.duplicated()]

    return df


def make_nba_playstyle_df(df_nba: pd.DataFrame) -> pd.DataFrame:
    df = df_nba.copy()

    # Basic cleaning
    df["Player"] = (
        df["Player"]
        .astype(str)
        .str.replace("*", "", regex=False)
        .str.strip()
    )

    df = df[df["Player"] != "League Average"]

    def to_num(col):
        return pd.to_numeric(col, errors="coerce")

    # Shot attempt shares

    for c in ["0-3", "3-10", "10-16", "16-3P", "3P_shoot"]:
        df[c] = to_num(df[c])

    df["rim_share"] = df["0-3"]
    df["mid_share"] = df["3-10"] + df["10-16"] + df["16-3P"]
    df["three_share"] = df["3P_shoot"]

    # Shot efficiency by zone

    for c in ["0-3.1", "3-10.1", "10-16.1", "16-3P.1", "3P.1"]:
        df[c] = to_num(df[c])

    df["rim_fg_pct"] = df["0-3.1"]
    df["three_fg_pct"] = df["3P.1"]

    mid_attempts = df["3-10"] + df["10-16"] + df["16-3P"]

    df["mid_fg_pct"] = np.where(
        mid_attempts > 0,
        (
            df["3-10"] * df["3-10.1"] +
            df["10-16"] * df["10-16.1"] +
            df["16-3P"] * df["16-3P.1"]
        ) / mid_attempts,
        np.nan
    )


    # Rename advanced rate stats to match NCAA naming
  
    rename_map = {
        "USG%": "usg",
        "TS%": "TS_per",
        "AST%": "AST_per",
        "TOV%": "TO_per",
        "ORB%": "ORB_per",
        "DRB%": "DRB_per",
        "STL%": "stl_per",
        "BLK%": "blk_per",
        "eFG%": "eFG",
        "FTr": "ftr",
        "3PAr": "TPAr"
    }

    df.rename(columns=rename_map, inplace=True)

    # Convert these to numeric as well
    rate_cols = list(rename_map.values())
    for c in rate_cols:
        if c in df.columns:
            df[c] = to_num(df[c])

    
    # Add per 36
    for c in ["PTS", "AST", "TRB", "MP"]:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    df = df[df["MP"] > 0]  # avoid divide by zero

    df["pts_per36"] = 36.0 * df["PTS"] / df["MP"]
    df["ast_per36"] = 36.0 * df["AST"] / df["MP"]
    df["trb_per36"] = 36.0 * df["TRB"] / df["MP"]

    # Downweight them slightly (important for cosine)


    return df

def make_ncaa_playstyle_df(df_ncaa: pd.DataFrame) -> pd.DataFrame:
    df = df_ncaa.copy()

    def to_num(col):
        return pd.to_numeric(col, errors="coerce")

    # Convert relevant columns to numeric

    cols_needed = [
        "rimmade+rimmiss",
        "rimmade/(rimmade+rimmiss)",
        "midmade+midmiss",
        "midmade/(midmade+midmiss)",
        "TPA",
        "TP_per",
        "twoPA"
    ]

    for c in cols_needed:
        if c in df.columns:
            df[c] = to_num(df[c])


    # Attempt Shares


    total_attempts = (
        df["rimmade+rimmiss"] +
        df["midmade+midmiss"] +
        df["TPA"]
    )

    df["rim_share"] = df["rimmade+rimmiss"] / total_attempts
    df["mid_share"] = df["midmade+midmiss"] / total_attempts
    df["three_share"] = df["TPA"] / total_attempts


    # FG% by Zone
 

    df["rim_fg_pct"] = df["rimmade/(rimmade+rimmiss)"]
    df["mid_fg_pct"] = df["midmade/(midmade+midmiss)"]
    df["three_fg_pct"] = df["TP_per"]

    PCT_COLS = [
    "TS_per", "eFG",
    "rim_fg_pct", "mid_fg_pct", "three_fg_pct",
    "FT_per", "twoP_per", "TP_per"
    ]

    for c in PCT_COLS:
        if c in df.columns:
            df[c] = pct_to_decimal_if_needed(df[c])


    # Per 36
    for c in ["pts", "ast", "treb", "mp"]:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    df = df[df["mp"] > 0]

    df["pts_per36"] = 36.0 * df["pts"] / df["mp"]
    df["ast_per36"] = 36.0 * df["ast"] / df["mp"]
    df["trb_per36"] = 36.0 * df["treb"] / df["mp"]

    return df

def pct_to_decimal_if_needed(s):
    s = pd.to_numeric(s, errors="coerce")
    med = s.dropna().median()
    # if median is > 1.5, it's almost certainly 0–100 style percent
    return s / 100.0 if med > 1.5 else s

if __name__ == "__main__":
    print("---- CURRENT NCAA ----")
    df_current = load_current_ncaa_data()
    print("Shape:", df_current.shape)
    print(df_current.head(5))

    print("\n---- PAST NCAA (Drafted Only) ----")
    df_past = load_past_ncaa_data()
    print("Shape:", df_past.shape)
    print(df_past.head(5))

    print("\n---- CURRENT NBA ----")
    df_nba = load_current_nba_data()
    print("Shape:", df_nba.shape)
    print(df_nba.head(5))
    df_nba = make_nba_playstyle_df(df_nba)
    df_past = make_ncaa_playstyle_df(df_past)
    df_current = make_ncaa_playstyle_df(df_current)
    print("\n---- NBA MERGED COLS ----")
    print(df_nba.columns.tolist())  
    print("\n---- NCAA Cols ----")
    print(df_current.columns.to_list)
