import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingQuota, setEditingQuota] = useState(null);
  const [newQuota, setNewQuota] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get("/admin/messages");
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Delete failed");
    }
  };

  const handleSetQuota = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/quota`, { quota: parseInt(newQuota) });
      await fetchUsers(); // Refresh users data
      setEditingQuota(null);
      setNewQuota("");
      setSuccess("Quota updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update quota");
    }
  };

  const handleMessageStatus = async (messageId, status) => {
    try {
      await api.put(`/admin/messages/${messageId}/status`, { status });
      await fetchMessages(); // Refresh messages data
      setSuccess(`Message ${status} successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update message status");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  // Refresh data when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUsers();
        fetchMessages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUsers();
      fetchMessages();
    }, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const pendingMessages = messages.filter(m => m.status === "pending");
  const acceptedMessages = messages.filter(m => m.status === "accepted");
  const rejectedMessages = messages.filter(m => m.status === "rejected");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, quotas, and messages</p>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Pending Messages</p>
            <p className="text-3xl font-bold">{pendingMessages.length}</p>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Accepted Messages</p>
            <p className="text-3xl font-bold">{acceptedMessages.length}</p>
          </div>
          <div className="bg-red-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Rejected Messages</p>
            <p className="text-3xl font-bold">{rejectedMessages.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "users" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Users & Quotas
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "messages" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Message Management
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quota</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Used</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {editingQuota === u._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newQuota}
                              onChange={(e) => setNewQuota(e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                              placeholder="Quota"
                            />
                            <button
                              onClick={() => handleSetQuota(u._id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingQuota(null)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium">{u.quota}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.usedQuota}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingQuota(u._id);
                              setNewQuota(u.quota.toString());
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Set Quota
                          </button>
                          {u.role !== "ADMIN" && (
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Message Management</h2>
            
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          From: {msg.sender?.name || "Unknown"} ({msg.sender?.email || "N/A"})
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{msg.content}</p>
                    
                    {msg.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMessageStatus(msg._id, "accepted")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleMessageStatus(msg._id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
