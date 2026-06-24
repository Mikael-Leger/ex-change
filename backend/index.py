from flask import Flask, request, send_from_directory, render_template
from flask_cors import CORS
import os
from datetime import date, timedelta
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__,
            static_folder="./static",
            template_folder="../public")

CORS(app)

api_url = os.getenv("API_URL")
api_key = os.getenv("API_KEY")

# Free, key-less ECB time-series API used only for the historical sparkline.
HISTORY_API = "https://api.frankfurter.app"

def getCurrentRates():
    res = requests.get(api_url + "/v1/latest?apikey=" + api_key)
    json = res.json()
    return json["data"]

def calculResult(amount, from_rate, to_rate):
    base = amount / from_rate
    return base * to_rate

def getHistory(from_devise, to_devise, days):
    # Same currency -> flat line at parity, no external call needed.
    if from_devise == to_devise:
        today = date.today()
        return [
            {"date": (today - timedelta(days=d)).isoformat(), "rate": 1.0}
            for d in range(days, -1, -1)
        ]

    end = date.today()
    start = end - timedelta(days=days)
    url = f"{HISTORY_API}/{start.isoformat()}..{end.isoformat()}"
    res = requests.get(url, params={"from": from_devise, "to": to_devise}, timeout=10)
    res.raise_for_status()
    rates = res.json().get("rates", {})

    series = [
        {"date": day, "rate": values[to_devise]}
        for day, values in sorted(rates.items())
        if to_devise in values
    ]
    return series

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

@app.route("/history", methods=["GET"])
def history():
    from_devise = request.args.get("from")
    to_devise = request.args.get("to")
    try:
        days = int(request.args.get("days", 30))
    except ValueError:
        days = 30
    days = max(7, min(days, 365))

    if not from_devise or not to_devise:
        return {"error": "Missing 'from' or 'to'"}, 400

    try:
        return {"history": getHistory(from_devise, to_devise, days)}
    except requests.RequestException:
        # History is a non-critical enhancement: never fail the request,
        # the frontend simply hides the sparkline when the series is empty.
        return {"history": []}

@app.route("/api", methods=["GET"])
def api():
    return {"api_url": api_url}

if __name__ == "__main__":
    app.run(debug=True)
