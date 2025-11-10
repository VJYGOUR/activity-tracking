// Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../utils/AuthContext";
import SubscriptionPage from "./SubscriptionPage";

/**
 * Redesigned Home page: "Find Your Dumb Work"
 * - Keeps all logic intact (useAuth, SubscriptionPage, steps, features, conditional links)
 * - Upgrades UI with modern visuals and motion
 * - Requires framer-motion + Tailwind
 */

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-slate-100">
      {/* Navigation */}
      <nav className="bg-white/6 backdrop-blur-sm border-b border-white/6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                  LogTaskr
                </h1>
                <p className="text-xs text-slate-400 -mt-1">
                  Find your dumb work.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-300 hover:text-white transition"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-white transition"
              >
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <span>Dashboard</span>
                  <span aria-hidden>🚀</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white transition font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-3 bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-xl transition"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: copy */}
            <div className="lg:col-span-6">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
              >
                Find your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                  Dumb Work
                </span>
                <div className="mt-2 text-indigo-200 text-2xl font-medium">
                  Work smarter starts here.
                </div>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.6 }}
                className="mt-6 text-lg text-slate-300 max-w-2xl"
              >
                You can’t optimize what you can’t see. LogTaskr shows where your
                time leaks away — so you can cut distractions, protect deep
                work, and build better habits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold shadow-lg hover:scale-[1.02] transition transform"
                  >
                    Launch Dashboard
                    <span className="ml-3">🚀</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold shadow hover:shadow-xl transition transform"
                    >
                      Start Free Trial
                      <span className="ml-3">✨</span>
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 text-slate-200 hover:border-white/30 transition"
                    >
                      See Demo
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36, duration: 0.5 }}
                className="mt-6 text-sm text-slate-400"
              >
                <span className="inline-block mr-4">
                  No credit card required
                </span>
                <span className="inline-block mr-4">•</span>
                <span className="inline-block">Free forever plan</span>
              </motion.div>
            </div>

            {/* Right: premium mockup */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* glowing background */}
                <div className="absolute -inset-2 blur-3xl opacity-30 bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500 rounded-3xl transform -translate-y-3 scale-[1.02]"></div>

                {/* glass card */}
                <div className="relative bg-white/6 backdrop-blur-md border border-white/8 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-slate-50 font-semibold">
                        Today's Focus
                      </h4>
                      <p className="text-xs text-slate-400">
                        See where your effort is going
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
                      <span className="w-2 h-2 rounded-full bg-yellow-400/80"></span>
                      <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 space-y-3">
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium">💻 Coding</div>
                          <div className="font-semibold">2h 15m</div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-white/40 rounded-full"
                            style={{ width: "60%" }}
                          />
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 text-slate-200">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">📚</div>
                            <div>Studying</div>
                          </div>
                          <div className="font-semibold">1h 30m</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 space-y-3">
                      <div className="bg-white/5 rounded-xl p-3 text-slate-200">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">☕</div>
                            <div>Break Time</div>
                          </div>
                          <div className="font-semibold">45m</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">
                            Today's Total
                          </p>
                          <p className="font-bold text-slate-50 text-xl">
                            4h 30m
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-700/30 rounded-lg flex items-center justify-center">
                          <span>⏱️</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-slate-400">
                    Built for creators · private & secure
                  </div>
                </div>

                {/* small floating CTA */}
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="absolute -bottom-6 right-4"
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold shadow-lg"
                  >
                    Start free trial
                    <span>→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Find. Track. Improve.</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              In three simple steps, discover where your time goes and take
              action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ translateY: -6 }}
                className="bg-white/4 rounded-2xl p-8 text-center border border-white/6"
              >
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional Subscription prompt */}
      {user?.plan === "free" && <SubscriptionPage />}

      {/* Features */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-slate-900 to-indigo-950"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Tools to Help You Work Smarter
            </h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Spot time leaks, measure progress, and build habits that stick.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white/5 border border-white/6 rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl shadow">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white"
          >
            Find Your Dumb Work. Do More Smart Work.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mt-4 text-slate-200"
          >
            Join creators using LogTaskr to reclaim focus and ship better work —
            without working longer hours.
          </motion.p>

          <div className="mt-8 flex justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow hover:scale-[1.02] transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow hover:scale-[1.02] transition"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
                >
                  See Live Demo
                </Link>
              </>
            )}
          </div>

          <p className="text-slate-300 mt-4 text-sm">
            No credit card • Free forever plan • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-white/6 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                LogTaskr
              </h3>
              <p className="mt-3 text-slate-400">
                Helping you find where your dumb work hides — and do more of
                what matters.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/6 mt-10 pt-8 text-center text-slate-500">
            <p>© 2024 LogTaskr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Steps and features are intentionally preserved (only copy adjusted)
const steps = [
  {
    title: "Choose Activity",
    description:
      "Pick what you're doing — coding, studying, reading, or your own custom category.",
  },
  {
    title: "Log Your Time",
    description:
      "Add your time in seconds — no complex timers or confusing settings.",
  },
  {
    title: "Spot Your Dumb Work",
    description:
      "See patterns, distractions, and where your effort leaks away. Awareness is the first step to working smarter.",
  },
];

const features = [
  {
    icon: "⏱️",
    title: "Quick Time Entry",
    description:
      "Log activities in seconds with a simple, intuitive interface. No friction, no distractions.",
  },
  {
    icon: "🏷️",
    title: "Custom Categories",
    description:
      "Track coding, studying, reading, or anything you do. You define what matters.",
  },
  {
    icon: "📊",
    title: "Visual Insights",
    description:
      "Understand your productivity patterns with clean, meaningful charts that reveal where your dumb work hides.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description:
      "Track from anywhere with a responsive, distraction-free design built for any device.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    description:
      "Your data is yours alone. LogTaskr never shares or sells your information.",
  },
  {
    icon: "📈",
    title: "Habit Builder",
    description:
      "Use your insights to make better decisions, improve focus, and build smarter habits over time.",
  },
];

export default Home;
