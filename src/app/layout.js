// app/layout.js or app/layout.tsx

"use client";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Navigation from "./Components/MainComponents/Navigation";
import Footer from "./Components/MainComponents/Footer";
import { usePathname } from "next/navigation";
import { AdsProvider } from "./Components/Context/AdsContext";
import { NavigationProvider } from "./Components/Context/NavigationContext";
import { NewsProvider } from "./Components/Context/NewsContext";
import { AuthorProvider } from "./Components/Context/AuthorContext";
import { CountProvider } from "./Components/Context/CountContext";
import { ThemeProvider } from "./Components/Context/ThemeContext";
import { NewsSearchProvider } from "./Components/Context/searchNewsContext";
import Head from "next/head";

export default function RootLayout({ children }) {
  const [isNav, setIsNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Correct the condition
    setIsNav(!pathname.includes("/dashboard"));
  }, [pathname]); // Add `pathname` as a dependency to re-run the effect when it changes.

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#12801e" />
        <meta
          name="description"
          content="KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <React.StrictMode>
          <NavigationProvider>
            <NewsProvider>
              <AdsProvider>
                <AuthorProvider>
                  <CountProvider>
                    <ThemeProvider>
                      <NewsSearchProvider>
                        <div className="sticky top-[-101px] z-50">
                          {isNav && <Navigation />}
                        </div>
                        <div>{children}</div>
                        {isNav && <Footer />}
                      </NewsSearchProvider>
                    </ThemeProvider>
                  </CountProvider>
                </AuthorProvider>
              </AdsProvider>
            </NewsProvider>
          </NavigationProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
