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

// Add a new book
app.post("/books", (req, res) => {
    const { id, name, title } = req.body;
    const query = "INSERT INTO books (id, name, title) VALUES (?, ?, ?)";
    
    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding new book", details: err.message });
        }
        res.status(201).json({ message: "Book has been added" });
    });
});

// Get all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the books", details: err.message });
        }
        res.json(results);
    });
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";
    
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the book", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(results[0]);
    });
});

// Update book by ID
app.put("/books/:id", (req, res) => {
    const { name, title } = req.body;
    const query = "UPDATE books SET name = ?, title = ? WHERE id = ?";
    
    connection.query(query, [name, title, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been updated" });
    });
});

// Delete book by ID
app.delete("/books/:id", (req, res) => {
    const query = "DELETE FROM books WHERE id = ?";
    
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been deleted" });
    });
});

// Update translation by book ID
app.patch("/books/:id/translation", (req, res) => {
    const { language } = req.body; // Fixed typo

    if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "Invalid or missing language" });
    }

    const query = "UPDATE books SET title = CONCAT(title, ' - (', ?, ')') WHERE id = ?";
    
    connection.query(query, [language, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating translation", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book translation has been updated" });
    });
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
});