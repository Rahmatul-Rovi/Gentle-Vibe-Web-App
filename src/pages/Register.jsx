import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../providers/AuthProvider';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/register', { name, email, password });
            alert("Registration Successful!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedUser = result.user;

            // Google er data database-e save kora (photoURL shoho)
            await axios.post('http://localhost:5000/api/register', {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photoURL: loggedUser.photoURL, // ✅ Image link pathano holo
                password: 'google-auth-user',
            });

            alert("Google Registration/Login Successful!");
            navigate('/');
        } catch (error) {
            console.error("Google Error:", error);
            alert("Google registration failed!");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10">
            <div className="max-w-md w-full border border-gray-100 p-10 shadow-sm">
                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center text-black">Register</h2>
                <p className="text-gray-400 text-center mb-8 text-xs uppercase tracking-widest">Join the Gentle Vibe</p>

                <form className="space-y-5" onSubmit={handleRegister}>
                    <input type="text" placeholder="FULL NAME" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black" onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="EMAIL ADDRESS" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="PASSWORD" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-block bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-widest mt-4">Create Account</button>
                </form>

                <div className="divider text-[10px] text-gray-400 uppercase py-6">OR</div>

                <button onClick={handleGoogleRegister} type="button" className="btn btn-block btn-outline rounded-none border-gray-200 hover:bg-black hover:text-white gap-3 font-medium text-xs tracking-widest">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
                    CONTINUE WITH GOOGLE
                </button>

                <div className="mt-10 text-center">
                    <span className="text-gray-400 text-xs uppercase">Already have an account? </span>
                    <Link to="/login" className="text-xs font-bold border-b border-black pb-1 hover:text-gray-500 uppercase text-black">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;