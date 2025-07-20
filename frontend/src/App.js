import React from "react";
import { BrowserRouter as useNavigate, Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";
import AuthContext from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/header.css"


function Header() {
    const { isAuthenticated, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <nav>
                <Link to="/" className="link"> Home (Tarefas) </Link>
                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="link">Login</Link>
                        <Link to="/register" className="link">Registro</Link>
                    </>
                )}
            </nav>
            {isAuthenticated && (
                <button onClick={handleLogout} className="logout_button">
                    Logout
                </button>
            )}
        </header>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<TaskList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>
            </AuthProvider>
        </Router>
    );
}

export default App;
