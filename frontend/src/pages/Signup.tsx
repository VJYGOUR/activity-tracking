import { useForm } from "react-hook-form";
import axiosInstance from "../axios/axiosInstance";
import handleApiError from "../utils/handleApiError";
import { useNavigate, Link } from "react-router-dom";
import { useFormMessage } from "../utils/useFormMessage";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    plan: "free" | "paid";
  };
  verificationEmailSent?: boolean;
}

const Signup = () => {
  const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
    useFormMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const password = watch("password");

  const onSubmit = useCallback(
    async (data: SignupForm) => {
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(true);

      try {
        const response = await axiosInstance.post<SignupResponse>(
          "/auth/signup",
          {
            name: data.name,
            email: data.email,
            password: data.password,
          }
        );

        if (response.data.verificationEmailSent === false) {
          setSuccessMessage(
            "Account created successfully! However, we couldn't send the verification email. Please contact support."
          );
        } else {
          setSuccessMessage(
            "Account created successfully! Please check your email for verification link before logging in."
          );
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        setErrorMessage(handleApiError(axiosError));
      } finally {
        setIsLoading(false);
      }
    },
    [setSuccessMessage, setErrorMessage]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Background Accent Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Logo + Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              LogTaskr
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-1">
              Create Your Account
            </h2>
            <p className="text-gray-400 text-sm">
              Find your dumb work — and start working smarter.
            </p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-emerald-600/10 border border-emerald-400/40 text-emerald-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              ✅ {successMessage}
              {successMessage.includes("check your email") && (
                <div className="mt-2 text-emerald-400 text-xs">
                  Didn’t receive it?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="underline hover:text-emerald-300"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-600/10 border border-red-400/40 text-red-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
                placeholder="John Doe"
                disabled={isLoading}
                className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Must include uppercase, lowercase & number",
                  },
                })}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm pt-4 border-t border-white/10">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mt-6 text-xs text-gray-400">
            <span className="text-blue-400">ℹ️</span> You’ll receive a
            verification email to activate your account. Check spam if it
            doesn’t arrive within 5 minutes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
