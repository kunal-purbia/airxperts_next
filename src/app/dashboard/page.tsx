/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { UseAuthInterface } from "@/types/UserAuth.type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const { userId, token, logout } = useAuth() as UseAuthInterface;
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userId");
    setUserToken(storedToken || token);
    setUser(storedUser || userId);
  }, [token, userId]);

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const result = await fetch("/api/clock-in", {
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
      const result = await fetch("/api/clock-out", {
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
        fetchSummary();
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

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const result = await fetch(`/api/summary/weekly?userId=${user}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { summary } = await result.json();
      setSummaryData(summary);
    } catch (error) {
      console.log("Error while fetching summary", error);
      alert("Error occurred, check console");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken && user) {
      fetchSummary();
    }
  }, [userToken, user]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="dashboard-container">
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
              {Object.keys(summaryData).map((week: any) => (
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
                      {Object.entries(summaryData[week]).map(
                        ([dte, hrs]: any) => (
                          <tr key={dte}>
                            <td>{dte}</td>
                            <td>{hrs.toFixed(2)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
