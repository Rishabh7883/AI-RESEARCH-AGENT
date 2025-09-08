import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NFTShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const nftData = [
    {
      id: 1,
      image: "https://tse4.mm.bing.net/th/id/OIP.A_vtM9VmnBiWq8q9y9ElhQHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      title: "AI Research Companion",
      description: "An intelligent assistant designed to simplify the way you explore, analyze, and summarize information. Powered by advanced algorithms, it helps you discover knowledge faster and make informed decisions.",
      traits: "Context-Aware Insights."
    },
    {
       id: 2,
    image: "https://tse3.mm.bing.net/th/id/OIP._xbOFF7Y1wzYnwslBISPdAHaEp?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Smarter Research with AI",
    description: "Turn complex research tasks into effortless explorations. Our AI tool scours multiple sources, extracts the most relevant information, and presents it in an easy-to-understand format—all within moments.",
    traits: "Data You Can Trust"
    },
    {
      id: 3,
      image: "https://www.brandignity.com/wp-content/uploads/2011/04/Understanding-Google-Search-Engine-Ranking.png",
      
      title: "Explore Ideas. Discover Knowledge.",
      description: "Unlock the potential of intelligent research. This AI-driven platform helps you dive deep into subjects, analyze content, and generate insights, empowering you to expand your understanding effortlessly.",
      traits: "Innovative Solutions"
    },
    {
      id: 4,
      image: "https://cdn-thumbnails.huggingface.co/social-thumbnails/spaces/DataPrism/Research-Assistant.png",
      title: "Your Personal Research Assistant.",
      description: "Ask questions, explore topics, and find answers—all with the help of AI. Whether you’re a student, researcher, or enthusiast, this tool helps you learn more while saving time and effort.",
      traits: "Knowledge at Your Fingertips, these Weirdos are known for their creative problem-solving abilities and innovative approaches to decentralized finance."
    }
  ];

  const handleButtonClick = () => {
    navigate("/login")
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === nftData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? nftData.length - 1 : prevIndex - 1
    );
  };

  const currentNFT = nftData[currentIndex];

  return (
    <div>
    <div className="min-h-screen bg-gray-900 relative">
      {/* Navbar */}
      <nav className="relative z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">
                AI Research
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Agent
                </span>
              </h2>
            </div>

            {/* Desktop Navigation */}


            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <button 
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-sm rounded-lg mt-2">
                <a href="#" className="text-white hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-300">
                  Home
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-300">
                  Collection
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-300">
                  Roadmap
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-300">
                  Team
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-300">
                  FAQ
                </a>
                <button 
                  onClick={handleButtonClick}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 relative min-h-[calc(100vh-64px)]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"></div>
        </div>
        
        <div className="max-w-6xl w-full flex items-center justify-between gap-12 relative z-10">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 z-20"
            aria-label="Previous NFT"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* NFT Card Container */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              {/* Card Stack Effect */}
              <div className="absolute inset-0 bg-gray-300 rounded-3xl transform rotate-3 scale-95 opacity-30"></div>
              <div className="absolute inset-0 bg-gray-200 rounded-3xl transform rotate-1 scale-98 opacity-50"></div>
              
              {/* Main Card */}
              <div className="relative bg-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                <div className="text-center">
                  {/* NFT Image */}
                  <div className="relative mb-6 group">
  <div className="w-full h-full rounded-2xl shadow-lg overflow-hidden">
    <img 
      src={currentNFT.image}
      alt={`Weirdo NFT ${currentNFT.id}`}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    />
  </div>
</div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110 z-20"
            aria-label="Next NFT"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Content Section */}
          <div className="flex-1 text-white max-w-lg">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight transition-all duration-500">
                {currentNFT.title}
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed transition-all duration-500">
                {currentNFT.description}
              </p>
              
              <p className="text-gray-400 text-base leading-relaxed transition-all duration-500">
                {currentNFT.traits}
              </p>
              
              <button 
                onClick={handleButtonClick} 
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        <button className="fixed bottom-8 right-8 p-3 bg-gray-700 hover:bg-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 z-20">
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <footer className="bg-gray-700 text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-white font-bold text-lg mb-2">About Weirdos Club</h3>
              <p className="text-sm">
                Join the InsightHub, a community of curious minds and data enthusiasts. Explore cutting-edge research tools, uncover valuable information, and connect with fellow knowledge seekers.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Collection</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Contact Us</h3>
              <p className="text-sm">
                Have questions? Reach out via our social channels or drop us an email.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-purple-400 transition-colors">Twitter</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Discord</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Instagram</a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
            © 2025 Ai Research Agent. All rights reserved.
          </div>
        </div>
      </footer>
      </div>

  );
};

export default NFTShowcase;