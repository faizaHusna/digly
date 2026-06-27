import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccessMsg(response.data.message || "Register sukses!");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal melakukan registrasi.");
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
          Create Account
        </h1>

        <p className="mt-2 text-sm text-[#6B5B4D]">
          Join Digly and start reading
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-600 border border-green-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)} // Ikat ke state name
            className="w-full rounded-full border border-[#D8CDBF] px-4 py-3 outline-none focus:border-[#8B6F47] bg-[#FFFDF9]"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Ikat ke state email
            className="w-full rounded-full border border-[#D8CDBF] px-4 py-3 outline-none focus:border-[#8B6F47] bg-[#FFFDF9]"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Ikat ke state password
            className="w-full rounded-full border border-[#D8CDBF] px-4 py-3 outline-none focus:border-[#8B6F47] bg-[#FFFDF9]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-full bg-[#6B4F3A] py-3 text-white transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5A4230]"
            }`}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[#6B5B4D]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6B4F3A] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;