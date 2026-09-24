import { useState } from "react";
import "./App.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = () => {
    if (username === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          alert("Login successful");
          onLogin();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Login error:", error);
        alert("Unable to connect to server");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>B2B Order Management</h1>
          <p>Login to your account</p>
        </div>

        <div className="login-form">

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={loginUser}>
            Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;

