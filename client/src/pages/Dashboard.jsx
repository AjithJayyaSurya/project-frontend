import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard({ onLogout }) {
  const [quota, setQuota] = useState(0);
  const [usedQuota, setUsedQuota] = useState(0);
  const [expiry, setExpiry] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuota = async () => {
    try {
      const res = await api.get("/user/quota");
      setQuota(res.data.quota);
      setUsedQuota(res.data.usedQuota);
      setExpiry(res.data.expiry);
    } catch (err) {
      setError("Failed to load quota");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get("/user/messages");
      setMessages(res.data);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      setError("");
      const res = await api.post("/user/messages", { content: newMessage });
      
      setQuota(res.data.remainingQuota);
      setUsedQuota((prev) => prev + 1);
      setNewMessage("");
      setSuccess("Message sent successfully!");
      fetchMessages();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setError("");
      const res = await api.delete(`/user/messages/${messageId}`);
      
      setQuota(res.data.remainingQuota);
      setUsedQuota((prev) => prev - 1);
      setSuccess("Message deleted and quota reverted!");
      fetchMessages();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchQuota();
    fetchMessages();
  }, []);

  // Refresh data when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchQuota();
        fetchMessages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh every 30 seconds
    const interval = setInterval(() => {
      fetchQuota();
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

  const daysLeft = Math.ceil(
    (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-600">Manage your messages and quota</p>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Quota Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Remaining Quota</p>
            <p className="text-3xl font-bold">{quota}</p>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Used Quota</p>
            <p className="text-3xl font-bold">{usedQuota}</p>
          </div>
          <div className="bg-orange-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Days Left</p>
            <p className="text-3xl font-bold">{daysLeft}</p>
          </div>
          <div className="bg-gray-500 text-white rounded-xl p-4 shadow-md">
            <p className="text-sm opacity-80">Total Messages</p>
            <p className="text-3xl font-bold">{messages.length}</p>
          </div>
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Message</h2>
          <div className="flex gap-4">
            <textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={quota <= 0}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
            />
            <button 
              onClick={handleSendMessage}
              disabled={quota <= 0 || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition self-end"
            >
              Send
            </button>
          </div>
          {quota <= 0 && (
            <p className="text-red-500 mt-2 text-sm">⚠️ Quota exceeded. Cannot send messages.</p>
          )}
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Messages</h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet. Start sending!</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3">{msg.content}</p>
                  <button 
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete (Revert Quota)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default Dashboard;
