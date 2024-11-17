"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { Get } from "../Redux/API";

// Create the context with default values (these will be replaced in the provider)
const NewsContext = createContext(undefined);

// Create a Provider component
export const NewsProvider = ({ children }) => {
  const [wholeNews, setWholeNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lge, setLge] = useState("np");

  // Check if we are on the client side to access `window`
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLge(window.location.pathname.includes("/en") ? "en" : "np");
    }
  }, []); // Only runs once on component mount

  // Memoize the fetchNews function with useCallback
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      // Use the Get function with proper typing for the response
      const response = await Get({ url: "/public/news/get-news" });

      // Filter and sort the news items based on the language and active status
      const filteredResponse = response
        .filter((item) => item.language === lge && item.active === true)
        .sort(
          (a, b) =>
            new Date(b.self_date).getTime() - new Date(a.self_date).getTime()
        );

      setWholeNews(filteredResponse);
    } catch (error) {
      console.error("Error in news fetch: " + error);
      setWholeNews([]); // Reset news in case of error
    } finally {
      setLoading(false);
    }
  }, [lge]); // Dependency array only includes `lge`

  // Fetch news on language change or component mount
  useEffect(() => {
    fetchNews(); // Fetch news when the language changes or on mount
  }, [lge, fetchNews]); // `fetchNews` is stable now due to `useCallback`

  return (
    <NewsContext.Provider value={{ wholeNews, loading, setWholeNews }}>
      {children}
    </NewsContext.Provider>
  );
};

// Custom hook for using the context
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
