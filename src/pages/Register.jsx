import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup } from 'firebase/auth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/register', { name, email, password });
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedUser = result.user;

            const res = await axios.post('http://localhost:5000/api/register', {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photoURL: loggedUser.photoURL,
                password: 'google-auth-user',
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Registration-er por role onujayi redirection
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Google Error:", error);
            alert("Google registration failed!");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10">
            <div className="max-w-md w-full border border-gray-100 p-10 shadow-sm animate-in fade-in zoom-in duration-500">
                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center text-black">Register</h2>
                <p className="text-gray-400 text-center mb-8 text-xs uppercase tracking-widest">Join the Gentle Vibe</p>

                <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                        <input type="text" placeholder="GENTLE USER" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black font-bold" onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                        <input type="email" placeholder="YOUR@EMAIL.COM" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black font-bold" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                        <input type="password" placeholder="••••••••" className="input input-bordered rounded-none w-full focus:outline-black text-sm bg-white text-black font-bold" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-block bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-[0.2em] text-xs h-14 mt-4">Create Account</button>
                </form>

                <div className="divider text-[10px] text-gray-400 uppercase py-6">OR</div>

                <button onClick={handleGoogleRegister} type="button" className="btn btn-block btn-outline rounded-none border-gray-200 hover:bg-black hover:text-white gap-3 font-bold text-[10px] tracking-widest h-14 transition-all">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
                    CONTINUE WITH GOOGLE
                </button>

                <div className="mt-10 text-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Already have an account? </span>
                    <Link to="/login" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-500 uppercase text-black tracking-widest ml-1">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;