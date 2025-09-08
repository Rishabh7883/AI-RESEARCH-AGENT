import React, { useState, useEffect } from "react";
import {
  Search,
  LogOut,
  Sparkles
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../components/userContext";

 function toTitleCase(text) {
  return text != null
    ? text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Guest";
}

const Content = ({ userId = "user123" }) => {
   const { user } = useContext(UserContext);
  const [userName, setUserName] = useState(toTitleCase(user?.fullname));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearch, setCurrentSearch] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
 
  useEffect(() => {
    setTimeout(() => setUserName(toTitleCase(user?.fullname)), 500);
  }, [userId]);

 

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);

    try {
      const response = await fetch(
        `http://localhost:8090/research?topic=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: searchTerm }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      console.log(data);

      const formattedResult = {
        id: Date.now(),
        topic: toTitleCase(data.topic),
        summary: data.result.summary ? data.result.summary.split("*") : [],
        links: data.result.links || [],
        query: searchTerm,
        timestamp: new Date(),
        savedAt: new Date(),
      };

      setCurrentSearch(formattedResult);
      setSearchHistory([formattedResult, ...searchHistory]);
      setSearchTerm("");
    } catch (error) {
      console.error(error);
      alert("Error fetching search results. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSavePDF = () => {
    if (!currentSearch) return;
    const pdfContent = `
      <html>
      <head>
      <meta charset="utf-8">
      <title>${currentSearch.topic}</title>
      <style>
        body { font-family: sans-serif; background: #1f2937; color: #f0f0f0; margin: 40px; }
        .summary { margin: 20px 0; }
        .links div { margin: 10px 0; }
      </style>
      </head>
      <body>
        <h1>${currentSearch.topic}</h1>
        <p>Original Search: ${currentSearch.timestamp.toLocaleString()}</p>
        <br>
        <h2>Summary: </h2>
        <hr>
        <ul class="summary">
          ${currentSearch.summary
            .map((point) => (point ? `<li>${point}</li>` : ""))
            .join("")}
        </ul>
        <br>
        <h2>Related Articles: </h2>
        <hr>
   <div class="links">
   ${currentSearch.links
        .map(
            (_link) => `<div><a href="${_link.link}" target="_blank" style="font-size:clamp(30px, 2vw, 16px); color:#4ea1f3; text-decoration:underline; word-break:break-word;">${_link.link}</a></div>`
            )
         .join("")}
      </div>
      </body>
      </html>
    `;
    const blob = new Blob([pdfContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${currentSearch.topic
      .replace(/\s+/g, "-")
      .toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  
 const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ important for cookies/session
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear any frontend state (if storing user info)
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        // Redirect user to login page
        window.location.href = "/login";
      } else {
        const error = await response.json();
        alert("Logout failed ❌: " + error.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong!");
    }
  };
 
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900 text-white">
      {/* Header */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold"><span className="text-red-600">AI</span> Reasearch Agent</h1>
          <div className="flex items-center space-x-4">
            <span>{userName}</span>
            <button onClick={handleLogout}>
              <LogOut />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-800 rounded-3xl px-4 py-4 shadow-lg mb-6">
          <Search className="w-6 h-6 text-gray-400 mr-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search topics..."
            className="w-full bg-transparent outline-none"
            disabled={isSearching}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="ml-4 px-4 py-2 bg-gray-700 rounded-xl"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Main Content */}
        <div
          className={`relative z-10 flex flex-col ${
            currentSearch
              ? "pt-20"
              : "justify-center min-h-[calc(100vh-80px)]"
          } transition-all duration-700`}
        >
          <div className="max-w-6xl mx-auto px-6 w-full">
            {/* Welcome Message */}
            {!currentSearch && (
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Welcome,{" "}
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {userName}
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Discover knowledge, explore ideas, and find answers with our
                  intelligent search platform.
                </p>
                <div className="flex items-center justify-center space-x-2 text-white/80">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm">
                    Powered by AI • Instant Results • Save & Share
                  </span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            )}

            {/* Current Search Result */}
            {currentSearch && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {currentSearch.topic}
                </h2>

                {/* Summary as bullets */}
                <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
                  {currentSearch.summary.map(
                    (point, idx) => point && <li key={idx}>{point}</li>
                  )}
                </ul>

                {/* Links */}
                <div className="space-y-2">
                  {currentSearch.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 hover:underline cursor-pointer"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>

                <button
                  onClick={handleSavePDF}
                  className="mt-4 px-6 py-2 bg-purple-600 rounded-xl"
                >
                  Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
