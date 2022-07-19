from flask import Flask
from flask import request
from dotenv import load_dotenv
from redcap import Project
from flask_cors import CORS
from flask import jsonify
import os
import json
import threading
import time

from jsonschema import validate, ValidationError

load_dotenv()

api_url = os.environ.get(
    "API_URL", default="https://tuspl22-redcap.srv.mwn.de/redcap/api/"
)

super_api_key = os.environ.get(
    "SUPER_API_KEY",
    default="EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
)


def init_api_keys():

    api_keys = {}
    api_keys["test"] = os.environ.get(
        "API_KEY", default="EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
    )
    if not os.path.exists("keys.json"):
        with open("keys.json", "w", encoding="utf-8") as file:
            json.dump([], file)

    with open("keys.json", "r", encoding="utf-8") as file:
        keys = json.load(file)

        for i in keys:
            for key, value in i.items():
                api_keys[key] = value

    return api_keys


api_keys = init_api_keys()
print(api_keys)

app = Flask(__name__)
CORS(app)

cache = {}


@app.route("/redcap")
def status():
    return "<p>Connected to the RedCap Import API!</p>"


@app.route("/redcap/import", methods=["POST"])
def import_data():
    to_import = request.form.to_dict()
    if to_import["data_type"] == "survey_response":
        cache[time.time_ns()] = to_import
        user_id = to_import["user_id"]
        start_time = threading.Timer(1, lambda: collect_and_upload(cache, user_id))
        start_time.start()

    return "OK"


@app.route("/redcap/create", methods=["POST"])
def create_project():
    study = json.loads(request.get_data())
    valid, message = verify_survey(study)
    if not valid:
        return jsonify({"message": "Invalid survey: " + message})
    study_id = study["study_id"]
    study_name = study["study_name"]
    description = study["instructions"]

    record = {
        "project_title": study_name,
        "purpose": 0,
        "purpose_other": description,
        "project_notes": "Created by the REDCap Import API",
    }

    data = json.dumps(record)

    fields = {
        "token": super_api_key,
        "content": "project",
        "format": "json",
        "data": data,
    }

    r = requests.post(api_url, data=fields)
    print("HTTP Status: " + str(r.status_code))
    print(r.text)


@app.route("/redcap/add", methods=["POST"])  # Adding api keys
def add_api_key():
    data = json.loads(request.get_data())
    print(data)
    study_id = data["study_id"]
    api_key = data["api_key"]
    if study_id is None or api_key is None:
        return jsonify({"message": "Can't be empty"})
    if study_id in api_keys:
        return jsonify({"message": "Study ID already exists"})
    else:
        api_keys[study_id] = api_key
        with open("keys.json", "r", encoding="utf-8") as file:
            keys = json.load(file)
        with open("keys.json", "w", encoding="utf-8") as file:
            json.dump(keys + [{study_id: api_key}], file)
        return jsonify({"message": "API key added"})


def collect_and_upload(cache, user_id, mock=False):
    user_responses = []
    for key, response in cache.copy().items():
        if response["user_id"] == user_id:
            user_responses.append(response)
            cache.pop(key)
    if len(user_responses) > 0:
        record = {
            "redcap_repeat_instrument": user_responses[0]["module_name"],
            "redcap_repeat_instance": "3",
            "record_id": "1",
            "user_id": user_responses[0]["user_id"],
            "study_id": user_responses[0]["study_id"],
            "response_time_in_ms": user_responses[0]["response_time_in_ms"],
            "response_time": user_responses[0]["response_time"],
            "raw_data": user_responses,
        }
        for res in user_responses:
            if "responses" in res and json.loads((res["responses"])):
                record.update(json.loads(res["responses"]))
                break
            elif "entries" in res:
                record["entries"] = res["entries"]
                break

        if mock:
            return record
        else:
            with open("records.json", "a", encoding="utf-8") as file:
                json.dump(record, file)
                project = Project(api_url, api_keys[user_responses[0]["study_id"]])
                response = project.import_records([record])
                print(response)


def verify_survey(survey):

    with open("../frontend/schema.json", "r") as file:
        schema = json.load(file)

    try:
        validate(instance=survey, schema=schema)
    except ValidationError as err:
        print(err)

        return False, str(err)

    message = "Given JSON data is Valid"
    return True, message


def generate_dictionary(study):
    try:

        csvString = '"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"\n'
        for module in study["modules"]:
            for section in module["sections"]:
                for question in section["questions"]:
                    if question.type == "instruction":
                        continue
                    csvString += f'{question["d"]},{module["uuid"]},,text,{question["text"]},,,,,,,,,,,,,\n'
        print(csvString)
    except err:
        print(err)
