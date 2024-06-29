from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Example route that accepts POST requests

volumes = {}


@app.route('/sendvolume', methods=['POST'])
def send_volume():
    response = Response()
    response.headers.add("Acces-Control-Allow-Origin", "*")
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    volumes[data['device_id']] = {"volume": data['volume']}
    return response, 200


@app.route('/getvolumes')
def get_volumes():
    response = jsonify(volumes)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, 200


if __name__ == '__main__':
    app.run(debug=True, ssl_context=(
        '../frontend/cert.pem', '../frontend/key.pem'))
