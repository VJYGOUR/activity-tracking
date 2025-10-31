import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    {
      id: "add-activity",
      label: "Add Activity",
      icon: "➕",
      path: "/add-activity",
    },
    { id: "history", label: "History", icon: "📝", path: "/history" },
    { id: "analytics", label: "Analytics", icon: "📊", path: "/analytics" },
    { id: "categories", label: "Categories", icon: "🏷️", path: "/categories" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
  fixed lg:static inset-y-0 left-0 z-50
  w-64 bg-gray-800 shadow-xl lg:shadow-none border-r border-gray-700 // Dark background
  transform transition-transform duration-300 ease-in-out
  flex flex-col
  ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menu</h2>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`
    flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
    ${
      isActive(item.path)
        ? "bg-blue-900/50 text-blue-300 border-r-2 border-blue-500"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }
  `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar footer with logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Active User
                </p>
                <p className="text-xs text-gray-500 truncate">Tracking time</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
