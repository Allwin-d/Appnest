
import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const PlayHopLogin = ({onEmailSelect, setShowLogin, theme}:any) => {
  const { t } = useTranslation();
  console.log("theme", theme);
  
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const MOCKAPI_ENDPOINT = 'https://68b022a13b8db1ae9c02da6c.mockapi.io/users';

  // Theme-based styling
  const isDark = theme === 'dark';
  
  const themeClasses = {
    background: isDark ? 'bg-gray-900' : 'bg-gray-100',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    border: isDark ? 'border-gray-600' : 'border-gray-300',
    borderActive: isDark ? 'border-green-400' : 'border-green-500',
    hoverBg: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    closeButtonBg: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200',
    inputBg: isDark ? 'bg-transparent' : 'bg-white',
    messageBg: isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300',
    activeTabText: 'text-green-400',
    inactiveTabText: isDark ? 'text-gray-400' : 'text-gray-500',
    inactiveTabHover: isDark ? 'hover:text-gray-300' : 'hover:text-gray-400',
    buttonPrimary: 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700',
    buttonSecondary: isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");
    try {
        const res = await fetch(MOCKAPI_ENDPOINT);
        const users = await res.json();
        const existingUsers = users.find((user:any) => user.email === email);
        console.log(existingUsers)
    
      if (existingUsers) {
        const existingEmail = existingUsers.email;
        setMessage(`Email already exists: ${existingEmail}`);
        console.log("existingdata", existingEmail);
        onEmailSelect(existingEmail);
        navigate("/");
        return;
      }

    if(!existingUsers){
      const response = await fetch(MOCKAPI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          loginTime: new Date().toISOString(),
          type: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save new user");
      }

      const data = await response.json();
      console.log("newUser", data);

      setMessage("Data saved successfully!");
      onEmailSelect(data.email);
      setEmail("");
      setPassword("");
      navigate("/"); 
    } 
  } catch (error) {
      console.error("Error:", error);
      setMessage("Error saving data. Please check your MockAPI endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    setMessage('Facebook login clicked (demo only)');
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <div className={`${themeClasses.background} min-h-screen flex items-center justify-center p-4 relative transition-colors`}>
      {/* Close Button - Top Right */}
      <button
        onClick={handleClose}
        className={`absolute top-6 right-6 ${themeClasses.textMuted} ${themeClasses.text} transition-colors z-10 p-2 rounded-full ${themeClasses.closeButtonBg}`}
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center relative">
              <div className="text-white text-lg font-bold">🐸</div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
            </div>
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold`}>playhop</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 font-semibold border-b-2 bg-transparent transition-colors ${
              activeTab === 'login'
                ? `${themeClasses.activeTabText} border-green-400`
                : `${themeClasses.inactiveTabText} ${themeClasses.border} ${themeClasses.inactiveTabHover}`
            }`}
          >
           {t('login')} 
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 font-semibold border-b-2 bg-transparent transition-colors ${
              activeTab === 'signup'
                ? `${themeClasses.activeTabText} border-green-400`
                : `${themeClasses.inactiveTabText} ${themeClasses.border} ${themeClasses.inactiveTabHover}`
            }`}
          >
            {t('signup')}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${themeClasses.messageBg} border ${themeClasses.text} text-center transition-colors`}>
            {message}
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-6">
          {/* Facebook Login Button */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <Facebook size={20} />
            {t('loginWithFacebook')}
          </button>

          {/* Email Input */}
          <div>
            <label className={`block ${themeClasses.text} font-semibold mb-2`}>{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full ${themeClasses.inputBg} border-2 ${themeClasses.borderActive} rounded-full px-4 py-3 ${themeClasses.text} ${themeClasses.textMuted} focus:outline-none focus:border-green-300 transition-colors`}
              placeholder={t("Enteryouremail")}
              style={{ 
                backgroundColor: isDark ? 'transparent' : 'white',
                color: isDark ? 'white' : '#111827'
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block ${themeClasses.text} font-semibold mb-2`}>{t('password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full ${themeClasses.inputBg} border-2 ${themeClasses.border} rounded-full px-4 py-3 ${themeClasses.text} ${themeClasses.textMuted} focus:outline-none focus:border-gray-500 pr-12 transition-colors`}
                placeholder={t("Enteryourpassword")}
                style={{ 
                  backgroundColor: isDark ? 'transparent' : 'white',
                  color: isDark ? 'white' : '#111827'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} hover:text-gray-300 transition-colors`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full ${themeClasses.buttonPrimary} disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-full transition-colors`}
          >
            {isLoading ? t('saving') : activeTab === 'login' ? t('login') : t('signup')}
          </button>

          <div className="text-center">
            <button
              type="button"
              className={`${themeClasses.buttonSecondary} transition-colors`}
            >
              {t('forgotPassword')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayHopLogin;