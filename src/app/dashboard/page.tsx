"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UseAuthInterface } from "@/types/UserAuth.type";
import Loading from "@/components/Loading";

interface WeeklySummary {
  [week: string]: {
    [date: string]: number;
  };
}

const Dashboard = () => {
  const { userId, token, logout } = useAuth() as UseAuthInterface;
  const router = useRouter();

  const [status, setStatus] = useState<"in" | "out" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<WeeklySummary | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = token || localStorage.getItem("token");
      const storedUserId = userId || localStorage.getItem("userId");

      setAuthToken(storedToken);
      setAuthUserId(storedUserId);
    }
  }, [token, userId]);

  const handleClockIn = async () => {
    if (!authToken) return alert("Token not found");

    try {
      setLoading(true);
      const res = await fetch("/api/clock-in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { message } = await res.json();
      alert(message);

      if (
        ["Clocked In successfully", "Active Clock-In is present"].includes(
          message
        )
      ) {
        setStatus("in");
      } else if (
        ["Invalid or expired token", "Token missing"].includes(message)
      ) {
        localStorage.clear();
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Clock-In Error:", error);
      alert("Clock-In failed, check console");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!authToken) return alert("Token not found");

    try {
      setLoading(true);
      const res = await fetch("/api/clock-out", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { message } = await res.json();
      alert(message);

      if (
        ["Clocked Out successfully", "No active clock in present"].includes(
          message
        )
      ) {
        setStatus("out");
        fetchSummary();
      } else if (
        ["Invalid or expired token", "Token missing"].includes(message)
      ) {
        localStorage.clear();
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Clock-Out Error:", error);
      alert("Clock-Out failed, check console");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!authToken || !authUserId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/summary/weekly?userId=${authUserId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const { summary } = await res.json();
      setSummaryData(summary);
    } catch (error) {
      console.error("Fetch Summary Error:", error);
      alert("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (authToken && authUserId) {
      fetchSummary();
    }
  }, [authToken, authUserId]);

  return (
    <div className="dashboard-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="dashboard-title">Welcome to Dashboard</h1>

          <div className="dashboard-actions">
            {status === "in" ? (
              <button className="btn btn-primary" onClick={handleClockOut}>
                Clock-OUT
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleClockIn}>
                Clock-IN
              </button>
            )}

            <button className="btn btn-secondary" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>

          {summaryData && (
            <div className="summary-section">
              <h3 className="summary-title">Weekly Summary</h3>
              {Object.entries(summaryData).map(([week, entries]) => (
                <div key={week} className="summary-week">
                  <strong className="summary-week-label">{week}</strong>
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(entries).map(([date, hours]) => (
                        <tr key={date}>
                          <td>{date}</td>
                          <td>{hours.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
