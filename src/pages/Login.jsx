import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full border border-gray-100 p-8 shadow-sm">
        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2 text-center">Login</h2>
        <p className="text-gray-500 text-center mb-8 text-sm uppercase tracking-wide">Welcome back to Gentle Vibe</p>
        
        <form className="space-y-6">
          <div className="form-control">
            <label className="label px-0">
              <span className="label-text font-semibold uppercase text-[12px]">Email Address</span>
            </label>
            <input type="email" placeholder="email@example.com" className="input input-bordered rounded-none focus:outline-black w-full" required />
          </div>
          
          <div className="form-control">
            <label className="label px-0">
              <span className="label-text font-semibold uppercase text-[12px]">Password</span>
            </label>
            <input type="password" placeholder="••••••••" className="input input-bordered rounded-none focus:outline-black w-full" required />
          </div>

          <button type="submit" className="btn btn-block bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-widest">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500 uppercase tracking-tight">Don't have an account? </span>
          <button className="font-bold border-b border-black pb-1 hover:text-gray-600 uppercase">Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;