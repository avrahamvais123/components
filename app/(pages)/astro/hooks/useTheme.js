import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handleChange = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const getTableColors = () => {
    if (isDark) {
      return {
        border: "#374151",
        headerBg: "#1f2937",
        headerText: "#f9fafb",
        rowEven: "#111827",
        rowOdd: "#1f2937",
        rowBorder: "#374151",
        textPrimary: "#f9fafb",
        textSecondary: "#9ca3af",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      };
    } else {
      return {
        border: "#e5e7eb",
        headerBg: "#f8fafc",
        headerText: "#374151",
        rowEven: "#ffffff",
        rowOdd: "#f9fafb",
        rowBorder: "#f3f4f6",
        textPrimary: "#1f2937",
        textSecondary: "#4b5563",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      };
    }
  };

  return { isDark, tableColors: getTableColors() };
}
