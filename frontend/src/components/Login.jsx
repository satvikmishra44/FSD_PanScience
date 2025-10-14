import { useState } from "react";
import { showToast } from "./Toast";
import axios from 'axios'
import { useNavigate } from "react-router";


function Login({backendUrl}) {

    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try{
            const res = await axios.post(`${backendUrl}/auth/login`, {email: mail, password: pass});
            localStorage.setItem('taskToken', res.data?.token);
            localStorage.setItem('taskUser', JSON.stringify(res.data));
            console.log(res);
            showToast("Login Succesful", "success");
            navigate('/dashboard');
        }catch(err){
            showToast(err.response?.data?.message || 'Invalid Credentials', 'error');
            console.error(err)
        }
    }


    return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
          <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Sign In
          </h2>

          <div className="space-y-5">
            <div className="flex flex-col space-y-1">
              <label
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                value={mail} onChange={(e) => setMail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                value={pass} onChange={(e) => setPass(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don’t have an account?{" "}
            <a
              onClick={() => navigate('/register')}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
    );
}

export default Login;

