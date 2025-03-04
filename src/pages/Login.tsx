import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      setLoading(false);
      if (email === "admin@example.com" && password === "password") {
        alert("Login Successful!");
        navigate("/");
      } else {
        setError(true);
      }
    }, 1500); // Simulating API call delay
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <motion.form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <motion.button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded flex justify-center"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="border-2 border-white border-t-transparent w-5 h-5 rounded-full"
              ></motion.div>
            ) : (
              "Login"
            )}
          </motion.button>
        </motion.form>

        {error && (
          <motion.p
            className="text-red-500 text-sm mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Invalid Credentials! Try again.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Login;