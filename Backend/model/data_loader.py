import pandas as pd

def load_current_ncaa_data(
    data_path="../data/trank_data.csv",
    header_path="../data/pstatheaders.xlsx"
):
    # Read ONLY the header row (fast + avoids pulling the whole sheet)
    column_names = pd.read_excel(header_path, nrows=0).columns.tolist()

    # Load raw CSV (no headers)
    df = pd.read_csv(data_path, header=None)

    # Trim to match the number of headers
    df = df.iloc[:, :len(column_names)]

    # Assign headers
    df.columns = column_names

    return df


if __name__ == "__main__":
    df = load_current_ncaa_data()
    print("Shape:", df.shape)
    print("First 5 columns:", df.columns[:5].tolist())
    print(df.head())