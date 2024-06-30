from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import time
from .localise import LocalisationModel, Localiser
import random

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
model = LocalisationModel.from_file("localisation_model.txt")
localiser = Localiser(100, model)

# Example route that accepts POST requests

volumes = {}

hardcoded_positions = [
    (2.5, 2),
    (2, 2.5),
    (2.5, 2.5),
    (2, 2),
]
hardcoded_positions_it = 0


@app.route('/sendvolume', methods=['POST'])
def send_volume():
    global hardcoded_positions_it
    response = Response()
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)

    prev_entry = volumes.get(data["device_id"], {})
    prev_entry["volume"] = data["volume"]
    prev_entry["last_updated"] = time.time()
    if "position" not in prev_entry:
        prev_entry["position"] = \
            hardcoded_positions[hardcoded_positions_it]
        hardcoded_positions_it = (
            hardcoded_positions_it + 1) % len(hardcoded_positions)
    volumes[data["device_id"]] = prev_entry
    return response, 200


@app.route('/getvolumes')
def get_volumes():
    recently = 5.0
    recently_updated_volumes = {k: v for k, v in volumes.items(
    ) if time.time() - v["last_updated"] <= recently}
    response = jsonify(recently_updated_volumes)
    return response, 200


@app.route("/getcoordinate")
def get_coordinate():
    min_volume = 0.2
    indices = [
        i for i, val in enumerate(volumes.values()) if val["volume"] > min_volume
    ]
    positions = [
        x["position"] for i, x in enumerate(volumes.values()) if i in indices
    ]
    observations = [
        x["volume"] for i, x in enumerate(volumes.values()) if i in indices
    ]
    print(f"len(observations) observations with significant reading")
    estimate = localiser.localise(observations, positions)
    response = jsonify({
        "x": estimate[0],
        "y": estimate[1],
        "confidence": random.random()
    })
    return response, 200


if __name__ == '__main__':
    app.run(debug=True)
