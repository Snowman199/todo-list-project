from flask import Flask, jsonify, send_from_directory
import random

app = Flask(__name__, static_folder='.')

PRODUCTIVITY_TIPS = [
    "Do the hardest task first for 25 minutes.",
    "If a task takes less than 2 minutes, do it now.",
    "Break big tasks into the next smallest action.",
    "Set 3 priorities for the day, not 30.",
    "Batch similar tasks to reduce context switching.",
]


@app.get('/api/tip')
def get_tip():
    return jsonify({"tip": random.choice(PRODUCTIVITY_TIPS)})


@app.get('/')
def index():
    return send_from_directory('.', 'index.html')


@app.get('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
