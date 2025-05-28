"use client";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        alert("Mandatory fields cannot be empty");
      } else {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await res.json();

        alert(result.message);
        if (result.token && result.message === "Login successful") {
          login(result.token);
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.log("Error while logging in user", error);
      alert("Error occurred, check console")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container form-box">
          <h2>Login Form</h2>
          <form className="user-form" onSubmit={handleSubmit}>
            <label>
              <strong>
                <em>Email:</em>
              </strong>
            </label>
            <input
              className="input-field"
              type="email"
              placeholder="Enter email"
              pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>
              <strong>
                <em>Password:</em>
              </strong>
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                className="input-field"
                type={viewPassword ? "string" : "password"}
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                style={{ padding: "5px 8px" }}
                onClick={() => setViewPassword(!viewPassword)}
              >
                {viewPassword ? "Hide" : "View"}
              </button>
            </div>
            <input type="submit" value="SUBMIT" className="button" />
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
