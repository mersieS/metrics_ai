
import React, { useState } from 'react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isRegistering) {
        // Register Logic
        if (username.length < 3 || password.length < 4) {
            setError("Kullanıcı adı en az 3, şifre en az 4 karakter olmalı.");
            setIsLoading(false);
            return;
        }
        // Save user to localStorage (simulating DB)
        localStorage.setItem('METRIX_SAVED_USER', JSON.stringify({ username, password, email }));
        setIsRegistering(false); // Switch back to login
        alert("Hesap oluşturuldu! Lütfen giriş yapın.");
        setIsLoading(false);
      } else {
        // Login Logic
        const savedUserStr = localStorage.getItem('METRIX_SAVED_USER');
        
        // Default admin/password backdoor for demo purposes if no user created
        if ((username === 'admin' && password === 'password') || savedUserStr) {
            if (savedUserStr) {
                const savedUser = JSON.parse(savedUserStr);
                if (username === savedUser.username && password === savedUser.password) {
                    localStorage.setItem('METRIX_USER', username);
                    onLogin();
                    return;
                } else if (username === 'admin' && password === 'password') {
                     // Allow demo admin even if local user exists
                    localStorage.setItem('METRIX_USER', 'admin');
                    onLogin();
                    return;
                }
            } else {
                 // Only demo user exists
                 if (username === 'admin' && password === 'password') {
                    localStorage.setItem('METRIX_USER', 'admin');
                    onLogin();
                    return;
                 }
            }
            setError("Kullanıcı adı veya şifre hatalı.");
        } else {
            setError("Kullanıcı bulunamadı. Lütfen kayıt olun.");
        }
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-slate-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-slate-700 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">MetriX <span className="text-indigo-400">AI</span></h1>
          <p className="text-slate-400 mt-2">
              {isRegistering ? "Yeni Yönetici Hesabı Oluştur" : "Yönetici Paneli Girişi"}
          </p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="admin"
            />
          </div>
          
          {isRegistering && (
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">E-posta</label>
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="ornek@sirket.com"
                />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-indigo-600/20 mt-6"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isRegistering ? "Kayıt Ol" : "Giriş Yap"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                }}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
                {isRegistering ? "Zaten hesabınız var mı? Giriş Yapın" : "Hesabınız yok mu? Kayıt Olun"}
            </button>
        </div>
      </div>
    </div>
  );
};
