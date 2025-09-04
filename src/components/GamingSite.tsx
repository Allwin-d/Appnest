
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayHopLogin from './PlayHopLogin';
import { useTranslation } from "react-i18next";
import { Trash2 ,Search, Globe, Palette, Clock,Sun, Moon,X} from 'lucide-react';
type DropdownState = Record<string, boolean>;
const GamingSite = () => {
//   const [dropdowns, setDropdowns] = useState({});
const [dropdowns, setDropdowns] = useState<DropdownState>({});
  const [activeSidebarItem, setActiveSidebarItem] = useState('gameHistory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [selectedGameUrl, setSelectedGameUrl] = useState(null);
  const [currentGameName, setCurrentGameName] = useState<string|null>('');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
   const MOCKAPI_ENDPOINT = 'https://68b022a13b8db1ae9c02da6c.mockapi.io/users';
   const [userData, setUserData] = useState(null);
   const { t, i18n } = useTranslation();

  const [games] = useState([
    {
      id: 1,
      name: "Memory Game",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=256&h=256&fit=crop",
      gameUrl: "/memory" 
    },
    {
      id: 2,
      name: "Puzzle Mania", 
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=256&h=256&fit=crop",
      gameUrl: "https://2048game.com"
    },
    {
      id: 3,
      name: "Adventure Island",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=256&h=256&fit=crop",
      gameUrl: "https://classicreload.com/dosgames/adventure-island.html" 
    },
    {
      id: 4,
      name: "Racing Thunder",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=256&h=256&fit=crop",
      gameUrl: "https://poki.com/en/g/burnout-drift-hilltop" 
    }
  ]);

  console.log("selectedGameUrl",selectedGameUrl)
  const fetchGameHistory = async () => {
    if (!selectedEmail) return;
    setShowLoginMessage(false);
    setIsLoadingHistory(true);
    
  
    setTimeout(() => {
      const mockHistory:any = [
        {
          gameName: "Memory Game",
          email: selectedEmail,
          score: 1500,
          timeSpent: 120,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        },
        {
          gameName: "Puzzle Mania",
          email: selectedEmail,
          score: 2300,
          timeSpent: 180,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        },
        {
          gameName: "Racing Thunder",
          email: selectedEmail,
          score: 890,
          timeSpent: 240,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        }
      ];
      setGameHistory(mockHistory);
      setIsLoadingHistory(false);
    }, 1000);
  };

  useEffect(() => {
    if (selectedEmail) {
      fetchGameHistory();
    }
  }, [selectedEmail]);

  const toggleDropdown = (dropdownId:any, e:any) => {
    e.stopPropagation();
    setDropdowns(prev => {
      const newDropdowns: DropdownState = { ...prev };
      Object.keys(newDropdowns).forEach(key => {
        if (key !== dropdownId) {
          newDropdowns[key] = false;
        }
      });
      newDropdowns[dropdownId] = !prev[dropdownId];
      return newDropdowns;
    });
  };

  const closeDropdowns = () => {
    setDropdowns({});
  };
 


const handleIframeLoad = (iframe: any) => {
  console.log("Iframe loaded..");
  console.log("parent theme:", theme);
  console.log("parent language:", language);
  

  setTimeout(() => {
    if (iframe && iframe.contentWindow) {
      console.log("Sending initial settings:", { action: "updateSettings", theme, language });
      iframe.contentWindow.postMessage(
        { action: "updateSettings", theme, language },
        "*"
      );
    }
  }, 100);
};

  
const handleSidebarItemClick = (itemId: any) => {
  setActiveSidebarItem(itemId);
  let newTheme = theme;
  
  if (itemId === 'darkMode') {
    setTheme('dark');
    newTheme = 'dark';
  } else if (itemId === 'lightMode') {
    setTheme('light');
    newTheme = 'light';
  }
  

  console.log("Theme clicked:", newTheme);
  console.log("Current language:", language);
  
  const iframe = document.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    console.log("Sending to iframe:", { action: "updateSettings", theme: newTheme, language });
    iframe.contentWindow.postMessage(
      { action: "updateSettings", theme: newTheme, language },
      "*"
    );
  } else {
    console.log("Iframe not found ");
  }
};

  
const handleLanguageChange = (langCode: any) => {
  console.log("Language chang to:", langCode);
  
  (i18n as any).changeLanguage(langCode);
  setLanguage(langCode);
  
  const iframe = document.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    console.log("Sending language update to iframe:", { action: "updateSettings", theme, language: langCode });
    iframe.contentWindow.postMessage(
      { action: "updateSettings", theme, language: langCode },
      "*"
    );
  } else {
    console.log("Iframe not found for language");
  }
  
  closeDropdowns();
};


useEffect(() => {
  console.log("Theme state changed to:", theme);
  

  const iframe = document.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    console.log(" theme update to iframe");
    iframe.contentWindow.postMessage(
      { action: "updateSettings", theme, language },
      "*"
    );
  }
}, [theme]);

useEffect(() => {
  console.log("Language state:", language);
  

  const iframe = document.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    console.log("Auto-sending language update to iframe");
    iframe.contentWindow.postMessage(
      { action: "updateSettings", theme, language },
      "*"
    );
  }
}, [language]);

useEffect(() => {
  const handleMessage = async (event:any) => {
    if (event.data?.type === "RESULT") {
      console.log("Got result from child:", event.data);

      const { email, gameName, score, time } = event.data;

      try {
       
        const res = await fetch(`${MOCKAPI_ENDPOINT}?email=${selectedEmail}`);
        const users = await res.json();

        if (users.length > 0) {
          const user = users[0]; 

          console.log("user",user)
          const updatedUserData = {
            ...user,
            results: [
              ...(user.results|| []),
              {
                gameName,
                score,
                timeSpent: time,
                date: new Date().toLocaleDateString(),
                timestamp: new Date().toISOString(),
              },
            ],
          };
      
          console.log("updatedUserData",updatedUserData)
      
          setUserData(updatedUserData);
          setGameHistory(updatedUserData.results); 

    
          await fetch(`${MOCKAPI_ENDPOINT}/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUserData),
          });

          console.log("Game result saved to MockAPI ");
          //  fetchGameHistorys(selectedEmail)
        } else {
          console.warn("No user found for email:", email);
        }
      } catch (err) {
        console.error("Error saving game result:", err);
      }

     
      setSelectedGameUrl(null);
      setCurrentGameName(null);
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);


const fetchGameHistorys = useCallback(async (email:any) => {
  try {
    const res = await fetch(`${MOCKAPI_ENDPOINT}?email=${email}`);
    const users = await res.json();
    if (users.length > 0) {
      setGameHistory(users[0].result || []);
    }
  } catch (err) {
    console.error("Error fetching history:", err);
  }
}, []);


console.log("gameHistory",gameHistory)


  useEffect(() => {
    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleGameClick = (game:any) => {
    if (!selectedEmail) {
      setShowLoginMessage(true);
      return;
    }

    setShowLoginMessage(false);
    setSelectedGameUrl(game.gameUrl);
    setCurrentGameName(game.name);

    const newHistoryEntry = {
      gameName: game.name,
      email: selectedEmail,
      score: 0, 
      timeSpent: 0,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    setGameHistory(prev => [newHistoryEntry, ...prev]);
  };

  const deleteGameHistoryByEmail = (indexToDelete:any) => {
    const updatedHistory = gameHistory.filter((game, index) => index !== indexToDelete);
    setGameHistory(updatedHistory);
  };

  const clearGameHistory = () => {
    setGameHistory([]);
  };

  const formatTime = (seconds:any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    setSelectedEmail("");
    setGameHistory([]);
    setSelectedGameUrl(null);
    setShowLoginMessage(false);
    setCurrentGameName('');
  };

 

  const handleBackFromGame = () => {
  const iframe = document.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ action: "triggerBack" }, "*");
  }
};

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-green-300' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {!showLogin ? (
        <>
          {/* Header */}
          <header className={`backdrop-blur-lg border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50 ${
            theme === 'dark' 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-xl">
                🎮
              </div>
              <span className="text-2xl font-bold">PlayHop</span>
            </div>

            {/* Search Bar - Hide when game is playing */}
            {!selectedGameUrl && (
              <div className="flex-1 max-w-lg mx-8 relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-400'
                }`}>
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  className={`w-full py-3 pl-12 pr-5 border rounded-xl text-base outline-none transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-green-400'
                  }`}
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              {selectedEmail && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {selectedEmail}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
              <button 
                onClick={handleLoginClick} 
                className="bg-gradient-to-r from-green-400 to-green-600 border-none text-white px-5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-300 hover:from-green-500 hover:to-green-700"
              >
                {selectedEmail ? 'Switch User' : t("login")}
              </button>
            </div>
          </header>

          {/* Main Container */}
          <div className="flex h-[calc(100vh-76px)]">
            {/* Sidebar - Hide when game is playing */}
            {!selectedGameUrl && (
              <aside className={`w-70 backdrop-blur-lg border-r py-6 overflow-y-auto ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/90 border-gray-200'
              }`}>
                <div className="mb-8">
                  {/* Game History */}
                  <div
                    className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all duration-300 text-sm ${
                      activeSidebarItem === 'gameHistory' 
                        ? `${theme === 'dark' ? 'text-green-400 bg-green-400/20' : 'text-green-600 bg-green-100'} border-r-3 border-green-400` 
                        : `${theme === 'dark' ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }`}
                    onClick={() => handleSidebarItemClick('gameHistory')}
                  >
                    <span className="text-base w-5 flex items-center justify-center">
                      <Clock size={16} />
                    </span>
                    {t("gameHistory")}
                  </div>

                  {/* Language Dropdown */}
                  <div className="relative">
                    <div
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all duration-300 text-sm justify-between ${
                        dropdowns.sidebarLang
                          ? `${theme === 'dark' ? 'text-green-400 bg-green-400/20' : 'text-green-600 bg-green-100'}` 
                          : `${theme === 'dark' ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                      onClick={(e) => toggleDropdown('sidebarLang', e)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base w-5 flex items-center justify-center">
                          <Globe size={16} />
                        </span>
                        {t("Language")}
                      </div>
                      <span className="text-xs">{dropdowns.sidebarLang ? '▲' : '▼'}</span>
                    </div>
                    
                    <div className={`ml-6 transition-all duration-300 overflow-hidden ${
                      dropdowns.sidebarLang ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {[
                        { code: 'en', name: 'English', flag: 'from-blue-900 via-white to-red-600' },
                        { code: 'de', name: 'German', flag: 'from-gray-800 via-red-600 to-yellow-400' },
                        { code: 'es', name: 'Spanish', flag: 'from-red-600 to-yellow-400' },
                        { code: 'fr', name: 'French', flag: 'from-blue-800 via-white to-red-600' }
                      ].map(lang => (
                        <div
                          key={lang.code}
                          className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-all duration-300 text-sm ${
                            theme === 'dark' 
                              ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100'
                          } ${language === lang.code ? 'font-semibold' : ''}`}
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            handleSidebarItemClick(lang.code);
                          }}
                        >
                          <span className={`w-4 h-3 rounded-sm bg-gradient-to-r ${lang.flag} inline-block`}></span>
                          {lang.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theme Dropdown */}
                  <div className="relative">
                    <div
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all duration-300 text-sm justify-between ${
                        dropdowns.sidebarTheme
                          ? `${theme === 'dark' ? 'text-green-400 bg-green-400/20' : 'text-green-600 bg-green-100'}` 
                          : `${theme === 'dark' ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                      onClick={(e) => toggleDropdown('sidebarTheme', e)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base w-5 flex items-center justify-center">
                          <Palette size={16} />
                        </span>
                        {t("theme")}
                      </div>
                      <span className="text-xs">{dropdowns.sidebarTheme ? '▲' : '▼'}</span>
                    </div>
                    
                    <div className={`ml-6 transition-all duration-300 overflow-hidden ${
                      dropdowns.sidebarTheme ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div
                        className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-all duration-300 text-sm ${
                          theme === 'dark' 
                            ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        } ${theme === 'dark' ? 'font-semibold' : ''}`}
                        onClick={() => handleSidebarItemClick('darkMode')}
                      >
                        <span className="text-base w-5 flex items-center justify-center">
                          <Moon className="w-4 h-4" />
                        </span>
                       {t("darkMode")}
                      </div>
                      <div
                        className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-all duration-300 text-sm ${
                          theme === 'dark' 
                            ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        } ${theme === 'light' ? 'font-semibold' : ''}`}
                        onClick={() => handleSidebarItemClick('lightMode')}
                      >
                        <span className="text-base w-5 flex items-center justify-center">
                          <Sun className="w-4 h-4" />
                        </span>
                        {t("lightMode")}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 overflow-y-auto ${
              theme === 'dark' ? 'bg-white/2' : 'bg-gray-50'
            } ${selectedGameUrl ? 'p-0' : 'p-8'}`}>
              
              {/* Game iframe view - Full screen when playing */}
              {selectedGameUrl ? (
                <div className="relative h-full">
                  {/* Game Controls Bar */}
                  <div className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 ${
                    theme === 'dark' ? 'bg-black/80' : 'bg-white/90'
                  } backdrop-blur-sm`}>
                    <button
                      onClick={handleBackFromGame}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      ⬅ {t("Back")}
                    </button>
                    
                    <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {currentGameName}
                    </div>
                    
                    <button
                      onClick={handleBackFromGame}
                      className={`p-2 rounded-full transition-colors ${
                        theme === 'dark' 
                          ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Game iframe */}
                  <iframe
                    src={selectedGameUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                    onLoad={(e) => handleIframeLoad(e.target)}
                    title={`Playing ${currentGameName}`}
                  />
                </div>
              ) : (
                <>
                  {/* Game History Section */}
                  {gameHistory.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl"><Clock size={24} /></span>
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {t("Mygames")}
                        </h2>
                        <span className="text-green-400 text-lg">›</span>
                        <button
                          onClick={clearGameHistory}
                          className="ml-auto text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-400/10 transition-all duration-300"
                          title="Clear game history"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {isLoadingHistory ? (
                        <div className={`text-center py-8 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                          <div className="text-4xl mb-2">⏳</div>
                          <p>{t("Loading history")}...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                          {gameHistory.map((game, index) => (
                            <div
                              key={index}
                              className={`rounded-xl p-4 border transition-all duration-300 relative group ${
                                theme === 'dark' 
                                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <button
                                onClick={() => deleteGameHistoryByEmail(index)}
                                className="absolute top-3 right-3 text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-400/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                title="Delete this history entry"
                              >
                                <Trash2 size={16} />
                              </button>

                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-lg">🎮</span>
                                </div>
                                <div className="flex-1 min-w-0 pr-8">
                                  <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                    {game.gameName}
                                  </h3>
                                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`} title={game.email}>
                                    {game.email}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>
                                    {game.date}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                    {t("Score")}:
                                  </span>
                                  <span className="text-green-400 font-bold">{game.score ?? game.count}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                    {t("Time")}:
                                  </span>
                                  <span className="text-blue-400 font-bold">  {formatTime(game.timeSpent??game.seconds ?? 0)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommended Games Section */}
                  <div className="mb-6">
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {t("Recommended")} 
                    </h2>
                    {showLoginMessage && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                        <p className="text-red-400 font-semibold">{t("loginFirst")}</p>
                      </div>
                    )}
                  </div>

                  {/* Games Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredGames.length > 0 ? (
                      filteredGames.map((game) => (
                        <div
                          key={game.id}
                          onClick={() => handleGameClick(game)} 
                          className={`rounded-xl overflow-hidden text-center p-4 transition-all duration-300 cursor-pointer border hover:transform hover:scale-105 ${
                            theme === 'dark' 
                              ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="relative group">
                            <img 
                              src={game.image} 
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/256x256/4ade80/ffffff?text=" + encodeURIComponent(game.name);
                              }}
                              alt={game.name}
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-green-500 rounded-full p-3">
                                <span className="text-white text-xl">▶</span>
                              </div>
                            </div>
                          </div>
                          <div className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {game.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`col-span-full text-center py-16 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-xl font-semibold mb-2">{t("noGames")}</h3>
                        <p className={theme === 'dark' ? 'text-white/50' : 'text-gray-400'}>
                          {t("adjustSearch")}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </>
      ) : (
        <PlayHopLogin onEmailSelect={setSelectedEmail} setShowLogin={setShowLogin} theme={theme} />
      )}
    </div>
  );
};

export default GamingSite;


