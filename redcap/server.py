from flask import Flask
from flask import request
from dotenv import load_dotenv
from redcap import Project
import os
import json
import threading
import time

load_dotenv()

api_url = os.environ.get("API_URL")
api_key = os.environ.get("API_KEY")
project = Project(api_url, api_key)

app = Flask(__name__)

cache = {}


@app.route("/redcap")
def status():
    print(project.export_repeating_instruments_events())
    return "<p>Connected to the RedCap Import API!</p>"


@app.route("/redcap/import", methods=["POST"])
def import_data():
    to_import = request.form.to_dict()
    if to_import["data_type"] == "survey_response":
        cache[time.time_ns()] = to_import
        user_id = to_import["user_id"]
        start_time = threading.Timer(1, lambda: collect_and_upload(user_id))
        start_time.start()
    return "OK"


def collect_and_upload(user_id):
    user_responses = []
    for key, response in cache.copy().items():
        if response["user_id"] == user_id:
            user_responses.append(response)
            cache.pop(key)
    if len(user_responses) > 0:
        record = {
            "redcap_repeat_instrument": "module_one",
            "redcap_repeat_instance": "3",
            "record_id": "1",
            "user_id": user_responses[0]["user_id"],
            "study_id": user_responses[0]["study_id"],
            "response_time": user_responses[0]["response_time_in_ms"],
            "raw_data": user_responses,
        }
        questions = json.loads(user_responses[0]["responses"])
        record.update(questions)
        with open("records.json", "a", encoding="utf-8") as file:
            json.dump(record, file)
        response = project.import_records([record])
        print(response)
