from flask import Flask
from flask import request
from redcap import Project
from dotenv import load_dotenv
import os

load_dotenv()

api_url = os.environ.get("API_URL")
api_key = os.environ.get("API_KEY")
project = Project(api_url, api_key)

app = Flask(__name__)


@app.route("/redcap")
def status():
    return "<p>Connected to the RedCap Import API!</p>"


@app.route("/redcap/import", methods=["POST"])
def import_data():
    to_import = request.get_json()
    print(to_import, response)
    response = project.import_records(to_import)
    return response
