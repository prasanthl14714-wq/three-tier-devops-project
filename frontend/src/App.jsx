import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:30500/api";

function App() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        department: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/employees`);

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setMessage("Unable to connect to the backend.");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addEmployee = async (event) => {
        event.preventDefault();

        if (!form.name || !form.email || !form.department) {
            setMessage("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to add employee.");
                return;
            }

            setMessage("Employee added successfully.");

            setForm({
                name: "",
                email: "",
                department: ""
            });

            await fetchEmployees();
        } catch (error) {
            setMessage("Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete employee.");
                return;
            }

            setMessage("Employee deleted successfully.");
            await fetchEmployees();
        } catch (error) {
            setMessage("Unable to connect to the backend.");
        }
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Employee Management System</h1>
                <p>Three-Tier CI/CD Application</p>
            </header>

            <main className="container">
                <section className="card">
                    <h2>Add Employee</h2>

                    <form onSubmit={addEmployee}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Employee Name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={form.department}
                            onChange={handleChange}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Employee"}
                        </button>
                    </form>

                    {message && <p className="message">{message}</p>}
                </section>

                <section className="card">
                    <div className="section-header">
                        <h2>Employees</h2>

                        <button onClick={fetchEmployees}>
                            Refresh
                        </button>
                    </div>

                    {employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.department}</td>
                                            <td>
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteEmployee(employee.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            <footer className="footer">
                <p>
                    React + Node.js + Express + MySQL
                </p>
            </footer>
        </div>
    );
}

export default App;
