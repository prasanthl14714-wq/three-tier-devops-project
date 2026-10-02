const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Health check
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            status: "success",
            message: "Backend and database are running successfully"
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Backend is running, but database is unavailable"
        });
    }
});

// Get all employees
app.get("/api/employees", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM employees ORDER BY id DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error("Error fetching employees:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch employees"
        });
    }
});

// Add an employee
app.post("/api/employees", async (req, res) => {
    try {
        const { name, email, department } = req.body;

        if (!name || !email || !department) {
            return res.status(400).json({
                status: "error",
                message: "Name, email, and department are required"
            });
        }

        const [result] = await db.query(
            "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)",
            [name, email, department]
        );

        res.status(201).json({
            status: "success",
            message: "Employee added successfully",
            employeeId: result.insertId
        });
    } catch (error) {
        console.error("Error adding employee:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "error",
                message: "Email already exists"
            });
        }

        res.status(500).json({
            status: "error",
            message: "Failed to add employee"
        });
    }
});

// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM employees WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "Employee not found"
            });
        }

        res.json({
            status: "success",
            message: "Employee deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting employee:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to delete employee"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
