import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LogTaskr
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Testimonials
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your Time
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master Your Day
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Simple, intuitive time tracking for coding, studying, reading, and
              everything else that matters. Understand where your time goes and
              boost your productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  Launch Dashboard 🚀
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
                  >
                    See Demo
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Preview */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Time Tracking Preview */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Today's Activities</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/20 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💻</span>
                        <span>Coding</span>
                      </div>
                      <span className="font-bold">2h 15m</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/20 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📚</span>
                        <span>Studying</span>
                      </div>
                      <span className="font-bold">1h 30m</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/20 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💑</span>
                        <span>GF Time</span>
                      </div>
                      <span className="font-bold">45m</span>
                    </div>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today's Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          4h 30m
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⏱️</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Productivity</p>
                        <p className="text-2xl font-bold text-gray-900">87%</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📈</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Time Tracking in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start tracking your time in less than a minute. No complicated
              setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Time Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand and optimize how you spend your
              time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Time?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of productive people who use LogTaskr to understand
            and optimize their daily activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                Go to Dashboard 🚀
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                >
                  See Live Demo
                </Link>
              </>
            )}
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • Free forever plan • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                LogTaskr
              </h3>
              <p className="text-gray-400">
                Helping you make the most of every minute.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LogTaskr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Steps data
const steps = [
  {
    title: "Choose Activity",
    description:
      "Select from coding, studying, reading, or create your own custom categories.",
  },
  {
    title: "Log Your Time",
    description:
      "Enter how much time you spent. Just minutes or hours - no complicated timers.",
  },
  {
    title: "See Insights",
    description:
      "View your daily totals and understand where your time goes with simple charts.",
  },
];

// Features data
const features = [
  {
    icon: "⏱️",
    title: "Quick Time Entry",
    description:
      "Log activities in seconds with our simple, intuitive interface. No complex setup required.",
  },
  {
    icon: "🏷️",
    title: "Custom Categories",
    description:
      "Track coding, studying, reading, or create your own categories for anything you do.",
  },
  {
    icon: "📊",
    title: "Visual Dashboard",
    description:
      "See your time distribution with clean charts and understand your productivity patterns.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description:
      "Track your time from anywhere with our responsive design that works on all devices.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    description:
      "Your data stays yours. We never share your activity data with third parties.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    description:
      "Set goals and track your progress over time to build better habits and routines.",
  },
];

export default Home;
