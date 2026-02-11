import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedUser = result.user;

            const res = await axios.post('http://localhost:5000/api/register', {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photoURL: loggedUser.photoURL, // ✅ Photo pathano holo
                password: 'google-auth-user',
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10">
            <div className="max-w-md w-full border border-gray-100 p-10 shadow-sm">
                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center text-black">Login</h2>
                <p className="text-gray-400 text-center mb-8 text-xs uppercase tracking-widest">Gentle Vibe Apparel</p>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <input type="email" placeholder="EMAIL" className="input input-bordered rounded-none w-full focus:outline-black bg-white text-black" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="PASSWORD" className="input input-bordered rounded-none w-full focus:outline-black bg-white text-black" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-block bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-widest">Sign In</button>
                </form>

                <div className="divider text-[10px] text-gray-400 uppercase py-6">OR</div>

                <button onClick={handleGoogleLogin} className="btn btn-block btn-outline rounded-none border-gray-200 hover:bg-black hover:text-white gap-3 font-medium text-xs tracking-widest text-black">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
                    CONTINUE WITH GOOGLE
                </button>

                <div className="mt-10 text-center">
                    <span className="text-gray-400 text-xs uppercase">New here? </span>
                    <Link to="/register" className="text-xs font-bold border-b border-black pb-1 hover:text-gray-500 uppercase text-black">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;