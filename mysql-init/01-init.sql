USE employeeSystem;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    country VARCHAR(100),
    role VARCHAR(100),
    wage INT
);