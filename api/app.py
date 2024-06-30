from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import time

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Example route that accepts POST requests

volumes = {}


@app.route('/sendvolume', methods=['POST'])
def send_volume():
    response = Response()
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    volumes[data['device_id']] = {
        "volume": data['volume'],
        "last_updated" : time.time()
    }
    return response, 200


@app.route('/getvolumes')
def get_volumes():
    print(volumes)
    recently = 5.0
    recently_updated_volumes = {k : v for k, v in volumes.items() if time.time() - v["last_updated"] <= recently}
    response = jsonify(recently_updated_volumes)
    return response, 200


if __name__ == '__main__':
    app.run(debug=True)
