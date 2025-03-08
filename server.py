from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Data file paths
USERS_FILE = 'eris_users.txt'
TEAMS_FILE = 'teams.txt'
RESPONSES_FILE = 'responses.txt'

# Helper functions to read/write data files
def read_data_file(filename):
    if not os.path.exists(filename):
        if filename == USERS_FILE:
            return {"subscribers": [], "employees": []}
        elif filename == TEAMS_FILE:
            return {"teams": []}
        elif filename == RESPONSES_FILE:
            return {"responses": []}
        return {}
    
    try:
        with open(filename, 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return {}

def write_data_file(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=2)
    return True

# Routes for user management
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(read_data_file(USERS_FILE))

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    users_data = read_data_file(USERS_FILE)
    
    if 'isEmployee' in data and data['isEmployee']:
        users_data['employees'].append(data)
    else:
        users_data['subscribers'].append(data)
    
    write_data_file(USERS_FILE, users_data)
    return jsonify({"success": True})

# Routes for team management
@app.route('/api/teams', methods=['GET'])
def get_teams():
    return jsonify(read_data_file(TEAMS_FILE))

@app.route('/api/teams', methods=['POST'])
def update_team():
    data = request.get_json()
    teams_data = read_data_file(TEAMS_FILE)
    
    # Find and update the team or add a new one
    found = False
    for i, team in enumerate(teams_data['teams']):
        if team['id'] == data['id']:
            teams_data['teams'][i] = data
            found = True
            break
    
    if not found:
        teams_data['teams'].append(data)
    
    write_data_file(TEAMS_FILE, teams_data)
    return jsonify({"success": True})

# Routes for response tracking
@app.route('/api/responses', methods=['GET'])
def get_responses():
    return jsonify(read_data_file(RESPONSES_FILE))

@app.route('/api/responses', methods=['POST'])
def update_response():
    data = request.get_json()
    responses_data = read_data_file(RESPONSES_FILE)
    
    # Find and update the response or add a new one
    found = False
    for i, response in enumerate(responses_data['responses']):
        if response['id'] == data['id']:
            responses_data['responses'][i] = data
            found = True
            break
    
    if not found:
        responses_data['responses'].append(data)
    
    write_data_file(RESPONSES_FILE, responses_data)
    return jsonify({"success": True})

if __name__ == '__main__':
    # Initialize files if they don't exist
    if not os.path.exists(USERS_FILE):
        write_data_file(USERS_FILE, {
            "subscribers": [],
            "employees": [{
                "firstName": "ERIS",
                "lastName": "Employee",
                "email": "employee@eris.com",
                "phone": "1234567890",
                "password": "employee123",
                "isEmployee": True
            }]
        })
    
    if not os.path.exists(TEAMS_FILE):
        write_data_file(TEAMS_FILE, {
            "teams": [
                {
                    "id": "team-1",
                    "name": "Alpha Team",
                    "grade": 3,
                    "status": "available",
                    "members": [
                        {
                            "id": "emp-1",
                            "name": "John Medic",
                            "role": "Team Lead",
                            "qualification": "Critical Care"
                        },
                        {
                            "id": "emp-2",
                            "name": "Sarah Nurse",
                            "role": "Paramedic",
                            "qualification": "Advanced Life Support"
                        }
                    ],
                    "baseStation": "Station Alpha"
                },
                {
                    "id": "team-2",
                    "name": "Bravo Team",
                    "grade": 2,
                    "status": "on-call",
                    "members": [
                        {
                            "id": "emp-4",
                            "name": "Lisa Paramedic",
                            "role": "Team Lead",
                            "qualification": "Advanced Life Support"
                        },
                        {
                            "id": "emp-5",
                            "name": "Tom Helper",
                            "role": "EMT",
                            "qualification": "Basic Life Support"
                        }
                    ],
                    "baseStation": "Station Bravo"
                }
            ]
        })
    
    if not os.path.exists(RESPONSES_FILE):
        write_data_file(RESPONSES_FILE, {
            "responses": [
                {
                    "id": "resp-1",
                    "teamId": "team-1",
                    "priority": 2,
                    "status": "on-scene",
                    "location": "123 Main St",
                    "dispatchTime": "2023-11-01T10:30:00",
                    "arrivalTime": "2023-11-01T10:45:00"
                }
            ]
        })
    
    app.run(debug=True, port=5000)