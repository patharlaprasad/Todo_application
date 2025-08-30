# app.py

from flask import Flask, request, jsonify, render_template
import json
from datetime import datetime
import os

app = Flask(__name__)
TASKS_FILE = 'tasks.json'

# Helper function to load tasks from the file
def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    try:
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

# Helper function to save tasks to the file
def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API Endpoint to get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    return jsonify(tasks)

# API Endpoint to add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    tasks = load_tasks()
    
    new_task = {
        'id': len(tasks) + 1, # Simple ID generation
        'title': data['title'],
        'description': data.get('description', ''),
        'category': data.get('category', 'General'),
        'completed': False,
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    tasks.append(new_task)
    save_tasks(tasks)
    
    return jsonify(new_task), 201

# API Endpoint to mark a task as completed
@app.route('/api/tasks/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    tasks = load_tasks()
    task_found = False
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task.get('completed', False) # Toggle completion
            task_found = True
            break
    
    if not task_found:
        return jsonify({'error': 'Task not found'}), 404

    save_tasks(tasks)
    return jsonify({'success': True})

# API Endpoint to delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    
    # Filter out the task with the given id
    tasks_to_keep = [task for task in tasks if task['id'] != task_id]

    if len(tasks_to_keep) == len(tasks):
        return jsonify({'error': 'Task not found'}), 404
        
    save_tasks(tasks_to_keep)
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)