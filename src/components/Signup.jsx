import { useState, useCallback, useEffect, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import bg from "../assets/image.jpg";
import amuLogo from "../assets/Group 1.svg";
import DotField from "./DotField";

const quotes = [
  { text: "Capturing Moments,", subtitle: "Creating Memories" },
  { text: "Life feels better", subtitle: "when you slow down" },
  { text: "Enjoy where you are,", subtitle: "not just where you're going" },
];

const Signup = () => {
  const [activeQuote, setActiveQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  // Auto-play quote slider
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveQuote((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  const goToQuote = (index) => {
    if (index === activeQuote) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveQuote(index);
      setIsAnimating(false);
    }, 400);
    startAutoPlay();
  };
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const fetchGoogleProfile = useCallback(async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const profile = await res.json();
      return profile;
    } catch (err) {
      console.error("Error fetching Google profile:", err);
      throw err;
    }
  }, []);


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setAuthError("");
      try {
        const profile = await fetchGoogleProfile(tokenResponse.access_token);
        setGoogleUser(profile);
        setAuthSuccess(
          `Welcome, ${profile.name}! Signed in with ${profile.email}`
        );

        const nameParts = (profile.name || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || prev.firstName,
          lastName: nameParts.slice(1).join(" ") || prev.lastName,
          email: profile.email || prev.email,
        }));
      } catch {
        setAuthError("Failed to retrieve Google profile. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setAuthError("Google sign-in was cancelled or failed. Please try again.");
      setGoogleLoading(false);
    },
    flow: "implicit",
  });

  const handleGoogleClick = () => {
    setAuthError("");
    setAuthSuccess("");
    setGoogleLoading(true);
    googleLogin();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#120F17] px-4 py-8 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#A855F7"
            gradientTo="#B497CF"
            glowColor="transparent"
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex w-[100vw] h-auto md:h-[85vh] sm:w-[90vw] max-w-6xl max-h-none md:max-h-[700px] rounded-2xl border border-[#3d3450]/60 bg-[#1e1729]/90 backdrop-blur-md shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] p-3 md:p-4 gap-4">
        {/* Left Side - Image Panel */}
        <div className="hidden md:flex md:w-[45%] relative flex-col rounded-xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1729]/80 via-transparent to-transparent" />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between p-6">
            {/* AMU Logo */}
            <img src={amuLogo} alt="AMU Logo" className="h-7 w-auto" />
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-white/90 bg-gray-500/20 border border-white/10 rounded-full px-4 py-1.5 hover:bg-gray-500/30 transition-colors"
            >
              Back to website
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Bottom text - Quote Slider */}
          <div className="relative z-10 mt-auto p-8 pb-10 text-center">
            <div className="h-[70px] flex items-center justify-center overflow-hidden">
              <h2
                className="text-white text-2xl font-light leading-snug transition-all duration-400 ease-in-out"
                style={{
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating
                    ? "translateY(20px)"
                    : "translateY(0)",
                  transition:
                    "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
                }}
              >
                {quotes[activeQuote].text}
                <br />
                {quotes[activeQuote].subtitle}
              </h2>
            </div>
            {/* Carousel dots - clickable */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuote(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/70 ${index === activeQuote
                    ? "w-8 bg-white"
                    : "w-6 bg-white/40"
                    }`}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="w-full md:flex-1 flex flex-col justify-center px-4 md:px-8 py-6 overflow-y-auto">
          <h1 className="text-white text-3xl md:text-4xl font-normal mb-2">
            Create an account
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account?{" "}
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              Log in
            </a>
          </p>

          {/* Auth Messages */}
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {authSuccess}
            </div>
          )}

          {/* Google User Avatar (shown after successful login) */}
          {googleUser && (
            <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 animate-[fadeIn_0.3s_ease-out]">
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                className="w-10 h-10 rounded-full border-2 border-purple-500"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-white text-sm font-normal">
                  {googleUser.name}
                </p>
                <p className="text-gray-400 text-xs">{googleUser.email}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            {/* Name Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="flex-1 bg-[#2a2035] border border-[#3d3450] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="flex-1 bg-[#2a2035] border border-[#3d3450] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#2a2035] border border-[#3d3450] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#2a2035] border border-[#3d3450] rounded-lg px-4 py-3 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center transition-all ${agreed
                    ? "bg-purple-500 border-purple-500"
                    : "bg-transparent border-[#3d3450]"
                    } border-2`}
                >
                  {agreed && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-normal py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-600/20"
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#3d3450]" />
            <span className="text-gray-500 text-xs whitespace-nowrap">
              Or register with
            </span>
            <div className="flex-1 h-px bg-[#3d3450]" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Google Auth Button - Real OAuth */}
            <button
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className="flex-1 flex items-center justify-center gap-2.5 border border-[#3d3450] rounded-lg py-3 text-white text-sm font-normal hover:bg-[#2a2035] hover:border-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {googleLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="31.4 31.4"
                      strokeLinecap="round"
                      className="opacity-30"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                  Google
                </>
              )}
            </button>

            {/* Apple Button */}
            <button className="flex-1 flex items-center justify-center gap-2.5 border border-[#3d3450] rounded-lg py-3 text-white text-sm font-normal hover:bg-[#2a2035] hover:border-purple-500/40 transition-all duration-200 group">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="group-hover:scale-110 transition-transform duration-200"
              >
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
