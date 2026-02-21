from flask import Flask, jsonify, request
from model.data_loader import load_current_ncaa_data, load_past_ncaa_data
from model.knn_comps import build_knn_model, find_similar_players, FEATURE_COLS

app = Flask(__name__)

# Load data once at startup
df_current = load_current_ncaa_data()
df_past = load_past_ncaa_data()



# Build KNN once at startup
knn, scaler, df_past_clean = build_knn_model(df_past)


@app.route("/")
def home():
    return "NBA Scouting KNN API Running"


@app.route("/players")
def list_players():
    players = df_current["player_name"].tolist()
    return jsonify(players)


@app.route("/comps/<player_name>")
def get_comps(player_name):
    # normalize input
    player_name = player_name.strip().lower()

    df_current["player_name"] = df_current["player_name"].astype(str).str.strip().str.lower()

    player_match = df_current[df_current["player_name"] == player_name]

    if player_match.empty:
        return jsonify({"error": "Player not found"}), 404

    player_row = player_match.iloc[0]

    comps = find_similar_players(
        player_row,
        df_past_clean,
        knn,
        scaler,
        k=5
    )

    result = comps[["player_name", "similarity_score"]].to_dict(orient="records")

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)