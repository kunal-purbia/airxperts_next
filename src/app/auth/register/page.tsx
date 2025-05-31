"use client";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (password !== confirmPassword) {
        alert("Passwords do not match");
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await res.json();

        alert(result.message);
        if (result.message === "User created successfully") {
          router.push("/auth/login");
        }
      }
    } catch (error) {
      console.log("Error while registering user", error);
      alert("Error occurred, check console");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container form-box">
          <h2>Registration Form</h2>
          <form className="user-form" onSubmit={handleSubmit}>
            <label>
              <strong>
                <em>Name:</em>
              </strong>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <label>
              <strong>
                <em>Confirm Password:</em>
              </strong>
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                className="input-field"
                type={viewConfirmPassword ? "string" : "password"}
                placeholder="Re-enter password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                style={{ padding: "5px 8px" }}
                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
              >
                {viewConfirmPassword ? "Hide" : "View"}
              </button>
            </div>
            <input type="submit" value="SUBMIT" className="button" />
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
