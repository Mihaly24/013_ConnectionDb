const express = require("express");
let mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).json({ message: 'Nama, NIM, and Kelas are required' });
    }

    const sql = "INSERT INTO mahasiswa (nama, nim, kelas) VALUES (?, ?, ?)";
    db.query(sql, [nama, nim, kelas], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error inserting data into database', error: err });
        }
        res.status(201).json({ message: 'New biodata added successfully', id: result.insertId });
    });
});

app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).json({ message: 'Nama, NIM, and Kelas are required' });
    }

    const sql = "UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ? WHERE id = ?";
    db.query(sql, [nama, nim, kelas, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error updating data in database', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Biodata not found with id: ' + id });
        }
        res.status(200).json({ message: 'Biodata updated successfully' });
    });
});

app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM mahasiswa WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error deleting data from database', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Biodata not found with id: ' + id });
        }
        res.status(200).json({ message: 'Biodata deleted successfully' });
    });
});