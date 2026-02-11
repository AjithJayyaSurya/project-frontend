import { useEffect, useState } from "react";
import api from "../api/axios";

function UserDashboard({ onLogout }) {
  const [quota, setQuota] = useState(0);
  const [usedQuota, setUsedQuota] = useState(0);
  const [expiry, setExpiry] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [error, setError] = useState("");

  const fetchQuota = async () => {
    try {
      const res = await api.get("/user/quota");

      setQuota(res.data.quota);
      setUsedQuota(res.data.usedQuota);
      setExpiry(res.data.expiry);

      const days =
        Math.ceil(
          (new Date(res.data.expiry) - new Date()) /
            (1000 * 60 * 60 * 24)
        );
      setDaysLeft(days);
    } catch (err) {
      setError("Failed to load quota");
    }
  };

  const useQuota = async () => {
    try {
      setError("");
      const res = await api.post("/user/use-quota");

      setQuota(res.data.remainingQuota);
      setUsedQuota((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Quota exhausted");
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>

      <p><b>Remaining Quota:</b> {quota}</p>
      <p><b>Used Quota:</b> {usedQuota}</p>
      <p><b>Expiry Date:</b> {new Date(expiry).toDateString()}</p>
      <p><b>Days Left:</b> {daysLeft}</p>

      <button onClick={useQuota} disabled={quota <= 0}>
        Use Quota
      </button>

      <button onClick={onLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UserDashboard;
