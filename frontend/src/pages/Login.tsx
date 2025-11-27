import { useForm } from "react-hook-form";
import axiosInstance from "../axios/axiosInstance";
import handleApiError from "../utils/handleApiError";
import { useAuth } from "../utils/AuthContext";
import { useFormMessage } from "../utils/useFormMessage";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    resetMessages,
  } = useFormMessage();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      resetMessages();
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/auth/login", data); //succesfully login hone par cookies me token set kardiye
        console.log("response is", response);
        setSuccessMessage("Logged in successfully!");
        await login(); // is function ko execute karke 'me' controller run kiya or request object me cookie already set hogyi thi login par, to cookie ka use karke user findout kiya and recieve kiya frontend me , or usko user state me set kiya fir protected route component hai uske through agr user available hua toh authenticated pages dikhege vrna nhi
        navigate("/dashboard");
      } catch (err) {
        setErrorMessage(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [resetMessages, setSuccessMessage, login, navigate, setErrorMessage]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-4">
      <div className="w-full max-w-md relative">
        {/* Background Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              LogTaskr
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">
              Continue tracking smarter — find your dumb work.
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {successMessage && (
              <div className="bg-emerald-600/10 border border-emerald-400/40 text-emerald-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
                ✅ {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-600/10 border border-red-400/40 text-red-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm pt-4 border-t border-white/10">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create one
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mt-6 text-xs text-gray-400">
            <span className="text-blue-400">💡</span> Tip: Use LogTaskr to find
            your dumb work — and start working smarter today.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
