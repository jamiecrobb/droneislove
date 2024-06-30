from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import time
from .localise import LocalisationModel, Localiser

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
model = LocalisationModel.from_file("localisation_model.txt")
localiser = Localiser(100, model)

# Example route that accepts POST requests

volumes = {}


@app.route('/sendvolume', methods=['POST'])
def send_volume():
    response = Response()
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    volumes[data['device_id']] = {
        "volume": data['volume'],
        "position": (data["pos_x"], data["pos_y"]),
        "last_updated" : time.time()
    }
    return response, 200


@app.route('/getvolumes')
def get_volumes():
    recently = 5.0
    recently_updated_volumes = {k : v for k, v in volumes.items() if time.time() - v["last_updated"] <= recently}
    response = jsonify(recently_updated_volumes)
    return response, 200

@app.route("/getcoordinate")
def get_coordinate():
    positions = [
        x["position"] for x in volumes
    ]
    observations = [
        x["volume"] for x in volumes
    ]
    estimate = localiser.localise(observations, positions)
    response = jsonify({
        "pos_x" : estimate[0],
        "pos_y" : estimate[1]
    })
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)
