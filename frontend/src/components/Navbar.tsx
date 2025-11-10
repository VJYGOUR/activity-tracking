import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
  showMenu: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenu }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
      {" "}
      {/* Dark background */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button & title */}
          <div className="flex items-center">
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <div className="flex items-center ml-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⏱️</span>
              </div>
              <h1
                onClick={() => navigate("/")}
                className="ml-2 text-xl font-bold text-white cursor-pointer"
              >
                LogTaskr
              </h1>
              {/* White text */}
            </div>
          </div>

          {/* Right side - User/Auth status */}
          <div className="flex items-center space-x-4">
            {showMenu ? (
              <div className="flex items-center space-x-2 bg-blue-900/50 px-3 py-1 rounded-full">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  U
                </div>
                <span className="text-sm font-medium text-blue-200">
                  Welcome!
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Please log in to track your time
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
