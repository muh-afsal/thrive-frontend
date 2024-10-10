import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <div className="flex items-center space-x-2 bg--600 mr-5">
      {/* <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-900'}`}>Light</span> */}
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 bg--500 rounded-full transition-colors duration-300 focus:outline-none ${
          isDark ? 'bg-slate-700' : 'bg-yellow-100'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-in-out ${
            isDark ? 'translate-x-7 bg-blue-400' : 'translate-x-1 bg-yellow-400'
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <SunIcon
            size={17}
            className={`text-yellow-500 transition-all duration-300 ${
              isDark ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'
            }`}
          />
          <MoonIcon
            size={18}
            className={`text-blue-200 transition-all duration-300 ${
              isDark ? 'opacity-100 translate-x-[-5px]' : 'opacity-0 translate-x-2'
            }`}
          />
        </div>
      </button>
      {/* <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-400'}`}>Dark</span> */}
    </div>
  );
};

export default ThemeToggle;
