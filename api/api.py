import time
import json
from flask import Flask, request

from task_repo import TaskRepository

app = Flask(__name__)

task_repo = TaskRepository()


@app.route('/tasks')
def show_tasks():
    task_repo.connect()
    all_results = task_repo.inspect_all()
    task_repo.close()
    return json.dumps(all_results)


@app.route('/add', methods=['POST'])
def add_task():
    task = request.json
    if task:
        task_name = task['taskName']
        task_description = task['taskDescription']
        task_due = task['taskDue']
        task_due = task_due.replace("T", " ").replace("Z", "")
        task_repo.connect()
        task_repo.save_new(task_name, task_description, task_due)
        task_repo.close()
        return task

    return "The task was malformed"


@app.route('/update', methods=['POST'])
def update_task():
    task = request.json
    if task:
        task_id = task['taskid']
        task_complete = task['taskcomplete']
        task_repo.connect()
        task_repo.update_task(task_id, task_complete)
        task_repo.close()
        return task
    return task
