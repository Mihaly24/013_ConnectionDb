const express = require("express");
let mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3308,
    password: "Invaders_24",
    database: "biodata"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        return;
    }
    console.log("Connected to the MySQL server");
});

app.get("/biodata", (req, res) => {
    const query = "SELECT * FROM mahasiswa";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.json(results);
    });
});

