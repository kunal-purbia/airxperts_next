"use client";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const result = await fetch("http://localhost:3000/api/clock-in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message } = await result.json();
      alert(message);

      if (
        message === "Clocked In successfully" ||
        message === "Active Clock-In is present"
      ) {
        setStatus("in");
      }
    } catch (error) {
      console.log("Error while clocking in", error);
      alert("Error occurred, check console");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      // Example logic — implement real API call
      const result = await fetch("http://localhost:3000/api/clock-out", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message } = await result.json();
      alert(message);

      if (
        message === "Clocked Out successfully" ||
        message === "No active clock in present"
      ) {
        setStatus("out");
      }
    } catch (error) {
      console.log("Error while clocking out", error);
      alert("Error occurred, check console");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container form-box">
          <h1>Welcome to Dashboard</h1>
          <div style={{ display: "flex", gap: "16px" }}>
            {status === "in" ? (
              <button className="button" onClick={handleClockOut}>
                Clock-OUT
              </button>
            ) : (
              <button className="button" onClick={handleClockIn}>
                Clock-IN
              </button>
            )}
            <button className="button" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
