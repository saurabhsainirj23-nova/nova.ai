import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventName: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Replace this with your backend API endpoint
      const res = await axios.post("http://localhost:5000/api/register-event", formData);
      setMessage("🎉 Registration successful!");
      setFormData({ name: "", email: "", phone: "", eventName: "" });
    } catch (error) {
      console.error(error);
      setMessage("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🎟️ EventSphere Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Event Name Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1">Select Event</label>
            <select
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Choose an Event --</option>
              <option value="Tech Innovators Summit">Tech Innovators Summit</option>
              <option value="Music Fiesta 2025">Music Fiesta 2025</option>
              <option value="Startup Hackathon">Startup Hackathon</option>
              <option value="Art & Culture Fest">Art & Culture Fest</option>
              <option value="Coding Championship">Coding Championship</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p className={`text-center mt-4 ${message.includes("successful") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;
