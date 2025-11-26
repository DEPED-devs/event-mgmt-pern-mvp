import React, { useState } from "react";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    position: "",
    phone: "",
    password: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.school ||
      !formData.position ||
      !formData.phone ||
      !formData.password
    ) {
      setSubmissionStatus({
        success: false,
        message: "Please fill in all fields.",
      });
      return;
    }
    setSubmissionStatus({ success: true, message: "Registration successful!" });
    setFormData({
      fullName: "",
      email: "",
      school: "",
      position: "",
      phone: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-md p-4 border-b-2 border-blue-700">
        <h1 className="text-white text-2xl font-semibold text-center">
          Registration
        </h1>
      </header>

      {/* Registration Form */}
      <main className="flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Register Now
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block mb-2 font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="school"
                className="block mb-2 font-semibold text-gray-700"
              >
                School / Organization
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Example School"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="block mb-2 font-semibold text-gray-700"
              >
                Position / Role
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Teacher / Coordinator"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 font-semibold text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+63 912 345 6789"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
          {submissionStatus && (
            <p
              className={`mt-4 text-center font-semibold ${
                submissionStatus.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {submissionStatus.message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
