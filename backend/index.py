from flask import Flask, request, send_from_directory, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv 
import requests

load_dotenv() 

app = Flask(__name__,
            static_folder="./static",
            template_folder="../public")

CORS(app)

api_url = os.getenv("API_URL")
api_key = os.getenv("API_KEY")

def getCurrentRates():
    res = requests.get(api_url + "/v1/latest?apikey=" + api_key)
    json = res.json()
    return json["data"]

def calculResult(amount, from_rate, to_rate):
    base = amount / from_rate
    return base * to_rate

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/convert", methods=["POST"])
def convert():
    data = request.json
    try:
        rates = data["rates"]
        amount = float(data["amount"])
        from_devise = data["from"]
        to_devise = data["to"]

        from_rate = rates.get(from_devise)
        to_rate = rates.get(to_devise)

        result = calculResult(amount, from_rate, to_rate)

        return {"result": result}
    except ValueError:
        return {"error": "Invalid input"}, 400

@app.route("/rates", methods=["GET"])
def rates():
    return getCurrentRates()

@app.route("/api", methods=["GET"])
def api():
    return {"api_url": api_url}

if __name__ == "__main__":
    app.run(debug=True)
