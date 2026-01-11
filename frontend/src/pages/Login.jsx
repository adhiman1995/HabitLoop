import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import Logo from '../components/Logo';

const Login = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative z-10 transition-all hover:shadow-blue-200/20">
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center p-3 ring-1 ring-blue-50">
                            <Logo className="w-full h-full text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                        {/* <p className="text-slate-500 font-medium">Enter your details to access your workspace</p> */}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100 flex items-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-3.5 text-slate-400 text-lg transition-colors group-focus-within:text-blue-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-3.5 text-slate-400 text-lg transition-colors group-focus-within:text-blue-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FiArrowRight className="text-lg" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
