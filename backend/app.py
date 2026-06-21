import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from processing.single_processor import process_single_image

app = Flask(__name__)
# Enable CORS for the React frontend (running on default Vite port 5173)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint to verify frontend-backend connection.
    """
    return jsonify({
        'status': 'success',
        'message': 'Backend Flask Server is running and connected!',
        'version': '1.0'
    }), 200

@app.route('/api/process/single', methods=['POST'])
def single_process():
    """
    Endpoint for Single Image Process.
    Expects multipart/form-data with 'image' file and 'params' JSON string.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
        
    params_str = request.form.get('params', '{}')
    try:
        params = json.loads(params_str)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid params JSON'}), 400
        
    try:
        image_bytes = file.read()
        result = process_single_image(image_bytes, params)
        return jsonify({
            'status': 'success',
            'data': result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
