import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsLoggedIn, setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const data = response.data; 

      if (data.user) {
        localStorage.setItem("digly_user", JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem("digly_token", data.token);
      }

      setUser(data.user);
      setIsLoggedIn(true);

      if (data.user && data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
      <div className="w-full max-w-md rounded-2xl border border-[#E7DDD0] bg-[#FFFDF9] p-8">
        <h1
          className="text-3xl text-[#3E2F26]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-[#6B5B4D]">
          Sign in to continue exploring books
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-[#D8CDBF] px-4 py-3 outline-none focus:border-[#8B6F47] bg-[#FFFDF9]"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-[#D8CDBF] px-4 py-3 outline-none focus:border-[#8B6F47] bg-[#FFFDF9]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-full bg-[#6B4F3A] py-3 text-white transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5A4230]"
            }`}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[#6B5B4D]">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#6B4F3A] font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;