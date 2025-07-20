import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/register.css";


function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, email, password);
            navigate("/login");
        } catch (error) {
            setError(error.response || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register_container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regUsername">Username:</label>
                    <input
                        type="text"
                        id="regUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regEmail">Email:</label>
                    <input
                        type="email"
                        id="regEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regPassword">Password:</label>
                    <input
                        type="password"
                        id="regPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                <button type="submit" className="register_button">Register</button>
            </form>
        </div>
    );
}

export default Register;
