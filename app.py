from flask import Flask, jsonify, request
import sqlite3
import csv
from flask_cors import CORS  # Importar CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask app!"})

# Conexión a la base de datos
def connect_db():
    conn = sqlite3.connect("jugadores.db")
    return conn

# Inicializar la base de datos y cargar datos del CSV
def init_db():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jugadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            team TEXT NOT NULL,
            number INTEGER
        )
    ''')
    conn.commit()

    # Cargar datos desde el CSV a la base de datos si está vacío
    cursor.execute("SELECT COUNT(*) FROM jugadores")
    if cursor.fetchone()[0] == 0:
        with open("jugadores.csv", newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                cursor.execute("INSERT INTO jugadores (name, team, number) VALUES (?, ?, NULL)",
                               (row["player_name"], row["team_abreviation"]))
        conn.commit()
    conn.close()

# Rutas para CRUD
@app.route("/players", methods=["GET"])
def get_players():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jugadores")
    players = cursor.fetchall()
    conn.close()
    return jsonify([{"id": row[0], "name": row[1], "team": row[2], "number": row[3]} for row in players])

@app.route("/players", methods=["POST"])
def add_player():
    data = request.get_json()
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO jugadores (name, team, number) VALUES (?, ?, ?)",
                   (data["name"], data["team"], data.get("number")))  # Puede ser NULL si no se envía
    conn.commit()
    conn.close()
    return jsonify({"status": "Player added"}), 201

@app.route("/players/<int:id>", methods=["PUT"])
def update_player(id):
    data = request.get_json()
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE jugadores SET name = ?, team = ?, number = ? WHERE id = ?",
                   (data["name"], data["team"], data.get("number"), id))
    conn.commit()
    conn.close()
    return jsonify({"status": "Player updated"})

@app.route("/players/<int:id>", methods=["DELETE"])
def delete_player(id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM jugadores WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "Player deleted"})

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
