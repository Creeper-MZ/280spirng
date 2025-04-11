from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
# 配置CORS允许跨域请求
CORS(app)

# 数据文件路径
USERS_FILE = 'eris_users.txt'
TEAMS_FILE = 'teams.txt'
RESPONSES_FILE = 'responses.txt'
WORK_HOURS_FILE = 'work_hours.txt'
REPORTS_FILE = 'reports.txt'
# 辅助函数：读取数据文件
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

# 辅助函数：写入数据文件
def write_data_file(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=2)
    return True

# 用户管理路由
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

# 团队管理路由
@app.route('/api/teams', methods=['GET'])
def get_teams():
    return jsonify(read_data_file(TEAMS_FILE))

@app.route('/api/teams', methods=['POST'])
def update_team():
    data = request.get_json()
    teams_data = read_data_file(TEAMS_FILE)
    
    # 找到并更新团队，或添加新团队
    found = False
    if 'teams' not in teams_data:
        teams_data['teams'] = []
        
    for i, team in enumerate(teams_data['teams']):
        if team['id'] == data['id']:
            teams_data['teams'][i] = data
            found = True
            break
    
    if not found:
        teams_data['teams'].append(data)
    
    write_data_file(TEAMS_FILE, teams_data)
    return jsonify({"success": True})

# 响应追踪路由
@app.route('/api/responses', methods=['GET'])
def get_responses():
    return jsonify(read_data_file(RESPONSES_FILE))

@app.route('/api/responses', methods=['POST'])
def update_response():
    data = request.get_json()
    responses_data = read_data_file(RESPONSES_FILE)
    
    # 找到并更新响应，或添加新响应
    found = False
    if 'responses' not in responses_data:
        responses_data['responses'] = []
        
    for i, response in enumerate(responses_data['responses']):
        if response['id'] == data['id']:
            responses_data['responses'][i] = data
            found = True
            break
    
    if not found:
        responses_data['responses'].append(data)
    
    write_data_file(RESPONSES_FILE, responses_data)
    return jsonify({"success": True})
# 添加无前缀的用户路由
@app.route('/users', methods=['GET'])
def get_users_alt():
    return get_users()

@app.route('/teams', methods=['GET'])
def get_teams_alt():
    return get_teams()

@app.route('/responses', methods=['GET'])
def get_responses_alt():
    return get_responses()
# 初始化数据文件
def initialize_data_files():
    if not os.path.exists(WORK_HOURS_FILE):
        write_data_file(WORK_HOURS_FILE, {
            "workHours": []
        })

    # Initialize reports data
    if not os.path.exists(REPORTS_FILE):
        write_data_file(REPORTS_FILE, {
            "reports": []
        })
    # 初始化用户数据
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
    
    # 初始化团队数据
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
    
    # 初始化响应数据
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
@app.route('/work-hours', methods=['GET'])
def get_work_hours():
    return jsonify(read_data_file(WORK_HOURS_FILE))

@app.route('/work-hours', methods=['POST'])
def update_work_hours():
    data = request.get_json()
    work_hours_data = read_data_file(WORK_HOURS_FILE)
    
    # Find and update work hour entry or add new one
    found = False
    if 'workHours' not in work_hours_data:
        work_hours_data['workHours'] = []
        
    for i, entry in enumerate(work_hours_data['workHours']):
        if entry['id'] == data['id']:
            work_hours_data['workHours'][i] = data
            found = True
            break
    
    if not found:
        work_hours_data['workHours'].append(data)
    
    write_data_file(WORK_HOURS_FILE, work_hours_data)
    return jsonify({"success": True})
@app.route('/reports', methods=['GET'])
def get_reports():
    return jsonify(read_data_file(REPORTS_FILE))

@app.route('/reports', methods=['POST'])
def update_report():
    data = request.get_json()
    reports_data = read_data_file(REPORTS_FILE)
    
    # Find and update report or add new one
    found = False
    if 'reports' not in reports_data:
        reports_data['reports'] = []
        
    for i, report in enumerate(reports_data['reports']):
        if report['id'] == data['id']:
            reports_data['reports'][i] = data
            found = True
            break
    
    if not found:
        reports_data['reports'].append(data)
    
    write_data_file(REPORTS_FILE, reports_data)
    return jsonify({"success": True})
if __name__ == '__main__':
    # 初始化数据文件
    initialize_data_files()
    # 运行应用
    app.run(debug=True, port=5000, host='0.0.0.0')