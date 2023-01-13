from flask import Flask

app = Flask(__name__)

@app.route('/app/info', methods=['GET'])
def info():
    return {'Internal service': '--------- Response from internal app ---------'}

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8000)