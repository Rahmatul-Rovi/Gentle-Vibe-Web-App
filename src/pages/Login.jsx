import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'; 
import { Eye, EyeOff } from 'lucide-react'; 
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext); 

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    // Redirect Logic
    const handleRedirect = (userData) => {
        if (userData.role === 'admin') {
            navigate('/admin'); 
        } else if (userData.role === 'manager') {
            navigate('/manager/dashboard'); 
        } else {
            navigate('/user/profile'); 
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Firebase Login
            await signInWithEmailAndPassword(auth, email, password);
            
            // Backend Login
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            const userData = res.data.user;

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Remember Me login password save
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            setUser(userData);
            handleRedirect(userData);

            Swal.fire({ icon: 'success', title: 'Welcome Back!', text: `Logged in as ${userData.name}`, timer: 2000, showConfirmButton: false });
            
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: err.response?.data?.message || "Check your credentials." });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedUser = result.user;

            // Check Google Login Registration
            const res = await axios.post('http://localhost:5000/api/register', {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photoURL: loggedUser.photoURL,
                password: 'google-auth-user',
            });

            const userData = res.data.user;
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData); 
            handleRedirect(userData);

            Swal.fire({ icon: 'success', title: 'Google Login Success!', timer: 1500, showConfirmButton: false });

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Google Login Error' });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10">
            <div className="max-w-md w-full border border-gray-100 p-10 shadow-sm animate-in fade-in zoom-in duration-500">
                <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center text-black">Login</h2>
                <p className="text-gray-400 text-center mb-8 text-xs uppercase tracking-widest">GENTLE-VIBE Apparel</p>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            value={email}
                            placeholder="Enter Your Email" 
                            className="input input-bordered rounded-none w-full focus:outline-black bg-white text-black font-bold" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                        <div className="relative">
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                placeholder="Enter Your Password" 
                                className="input input-bordered rounded-none w-full focus:outline-black bg-white text-black font-bold pr-12" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="remember"
                            className="checkbox checkbox-xs rounded-none border-black" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 cursor-pointer">
                            Remember Me
                        </label>
                    </div>

                    <button type="submit" className="btn btn-block bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-[0.2em] text-xs h-14">
                        Sign In
                    </button>
                </form>

                <div className="divider text-[10px] text-gray-400 uppercase py-6">OR</div>

                <button onClick={handleGoogleLogin} className="btn btn-block btn-outline rounded-none border-gray-200 hover:bg-black hover:text-white gap-3 font-bold text-[10px] tracking-widest text-black h-14 transition-all">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
                    CONTINUE WITH GOOGLE
                </button>

                <div className="mt-10 text-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">New here? </span>
                    <Link to="/register" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-500 uppercase text-black tracking-widest ml-1">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;