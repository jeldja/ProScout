import os
import pandas as pd

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

    return df


if __name__ == "__main__":
    print("---- CURRENT NCAA ----")
    df_current = load_current_ncaa_data()
    print("Shape:", df_current.shape)
    print(df_current.head(5))

    print("\n---- PAST NCAA (Drafted Only) ----")
    df_past = load_past_ncaa_data()
    print("Shape:", df_past.shape)
    print(df_past.head(5))

