const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json()); // Fix JSON middleware

// Configure MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "m2222002@",
    database: "library"
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
});

app.get("/bookshop/:id", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE shop_id = ?";

    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the book", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

app.get("/cities", (req, res) => {
    const query = "SELECT city FROM bookshop";

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving cities", details: err.message });
        }
        res.json(results);
    });
});

app.get("/bookshop/name/:name", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE name = ?";

    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

app.get("/bookshop/email/:email", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE email = ?";

    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

app.put("/bookshop/newname/:id", (req, res) => {
    const { name } = req.body;

    const query = "UPDATE bookshop SET name = ? WHERE shop_id = ?";

    connection.query(query, [req.body.name, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop name", details: err.message });
        }
        res.json({ message: "Bookshop name updated successfully" });
    });
});

app.put("/bookshop/newemail/:id", (req, res) => {
    const { email } = req.body;
    const query = "UPDATE bookshop SET email = ? WHERE shop_id = ?";

    connection.query(query, [req.body.email, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop email", details: err.message });
        }
        res.json({ message: "Bookshop email updated successfully" });
    });
});

app.post("/bookshop/add", (req, res) => {
    const { city, name, contactNumber, email, address } = req.body;
    const query = "INSERT INTO bookshop (city, name, contactNumber, email, address) VALUES (?, ?, ?, ?, ?)";

    connection.query(query, [city, name, contactNumber, email, address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error adding bookshop", details: err.message });
        }
        res.json({ message: "Bookshop added successfully" });
    });
});

app.delete("/bookshop/delete/:id", (req, res) => {
    const query = "DELETE FROM bookshop WHERE shop_id = ?";

    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting bookshop", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json({ message: "Bookshop deleted successfully" });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
