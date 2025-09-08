import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { UserContext } from "./userContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ new state for success message
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSignIn, setSignIn] = useState(true);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isSignIn
        ? "http://localhost:8090/api/auth/login"
        : "http://localhost:8090/api/auth/register";

      const payload = isSignIn
        ? { email, password }
        : { fullname, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (isSignIn) {
          // ✅ LOGIN SUCCESS → go to content
          login({
            fullname: data.fullname || fullname || "User",
            email: data.email,
          });
          navigate("/content");
        } else {
          // ✅ REGISTER SUCCESS → switch to login mode
          setSignIn(true);
          setSuccess("Registration successful. Please log in."); // show message
          setIsProcessing(false);
        }
      } else {
        // ❌ FAIL → show error
        setError(
          data.message || (isSignIn ? "Login failed" : "Registration failed")
        );
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-900 transition-all duration-1000 ${
        isProcessing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden transform transition-transform duration-1000 ease-in-out">
        {/* Left Image */}
        <div className="w-1/3 pt-20">
          <img
            src="https://cdn1.iconfinder.com/data/icons/user-interface-2314/24/user_person_profile_people_avatar-1024.png"
            alt="Login Visual"
            className="w-[200px] h-[200px] object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-2/3 p-8 text-white">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="font-bold">{isSignIn ? "L" : "S"}</span>
            </div>
            <h1 className="text-2xl font-bold">
              {isSignIn ? "Login" : "Sign Up"}
            </h1>
          </div>

          <p className="text-gray-300 mb-4">
            {isSignIn
              ? "Welcome back! Log in to your account."
              : "Create a new account."}
          </p>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          {/* Full Name for Sign-Up */}
          {!isSignIn && (
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg pl-10 p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg pl-10 p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition duration-300 mb-2"
          >
            {isProcessing
              ? isSignIn
                ? "Logging in..."
                : "Signing up..."
              : isSignIn
              ? "Log in"
              : "Sign Up"}
          </button>

          {/* Toggle Login / Signup */}
          <button
            onClick={() => {
              setSignIn(!isSignIn);
              setError("");
              setSuccess("");
            }}
            className="w-full text-sm text-purple-400 hover:underline"
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
