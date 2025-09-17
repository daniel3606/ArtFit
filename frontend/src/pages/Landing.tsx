import { Link } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";

export default function Login() {
  useEffect(() => {
    document.title = "ArtFit Design - Login";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      {/* Logo + Title */}
      <div className="flex items-center mb-8">
        <img
          src={logo}
          alt="ArtFit Logo"
          className="w-20 h-20 object-contain block"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">ArtFit</h1>
      </div>

      {/* Page title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

      {/* Form */}
      <form
        action="/login"
        method="post"
        className="w-full max-w-md space-y-6"
      >
        {/* Username */}
        <div className="relative w-full group">
          <input
            type="text"
            name="username"
            id="username"
            className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
          />
          <label
            htmlFor="username"
            className="absolute top-3 -z-10 origin-[0] scale-100 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium"
          >
            Username
          </label>
        </div>

        {/* Password */}
        <div className="relative w-full group">
          <input
            type="password"
            name="password"
            id="password"
            className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute top-3 -z-10 origin-[0] scale-100 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium"
          >
            Password
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Login
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 w-full max-w-md flex justify-between text-sm text-gray-700">
        <Link to="/register" className="hover:text-blue-600">
          Register
        </Link>
        <Link to="/forgot-password" className="hover:text-blue-600">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
