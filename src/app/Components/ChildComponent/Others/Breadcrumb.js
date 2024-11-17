"use client";
import React, { useRef, useEffect, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "../../Context/ThemeContext";
import PropTypes from "prop-types"; // For runtime prop validation
import { usePathname } from "next/navigation";
const Breadcrumb = ({
  myWord,
  addNews = true,
  changeWord,
  showLink = false,
}) => {
  const pathname = usePathname();
  const { themeColor } = useTheme();
  const router = useRouter();

  // Check if window exists to avoid SSR issues
  const [lge, setLge] = useState(() => {
    if (typeof window !== "undefined") {
      return pathname.includes("/en") ? "en" : "np";
    }
    return "np"; // Default to 'np' if window is not available
  });

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Handle scrollability checks and event listeners
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } =
          scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const debouncedCheckScrollable = () => {
      clearTimeout(window.debounceTimer);
      window.debounceTimer = setTimeout(checkScrollable, 200); // Debounce the event handlers
    };

    // Initial check
    checkScrollable();
    window.addEventListener("resize", debouncedCheckScrollable);
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener("scroll", checkScrollable);

    // Cleanup event listeners on component unmount
    return () => {
      if (window) {
        window.removeEventListener("resize", debouncedCheckScrollable);
      }
      scrollContainer?.removeEventListener("scroll", checkScrollable);
    };
  }, []);

  // Scroll logic for left and right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  // Navigation logic
  const navigateToMyWord = () => {
    router.push(`/${myWord}`);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="my-5">
      <div className="w-full h-full flex items-center gap-3 font-mukta font-semibold">
        <p
          style={{ color: themeColor }} // Inline styling for dynamic color
          className="text-nowrap text-2xl sm:text-4xl"
        >
          {myWord}
        </p>
        <div className="w-full bg-[#509933] h-[0.05rem]"></div>
        {addNews && (
          <div
            className="flex items-center text-nowrap text-l text-[#2a511b] cursor-pointer hover:tracking-wide duration-200 hover:text-[#509933] group"
            onClick={navigateToMyWord}
          >
            {lge === "en" ? <p>All</p> : <p>थप समाचार</p>}{" "}
            <GoArrowUpRight className="group-hover:ml-0.5 duration-200" />
          </div>
        )}
      </div>

      {/* Scrollable breadcrumb links */}
      {showLink && (
        <div className="mt-2 rounded relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-hidden"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
          >
            <ul className="flex justify-start gap-3 items-center mt-2">
              {Array.from({ length: 20 }).map((_, index) => (
                <li
                  key={index}
                  className="py-1 px-3 select-none cursor-pointer hover:bg-[#509933] hover:text-white duration-200 font-mukta text-sm font-medium pt-1.5 rounded border border-[#509933]"
                >
                  <span>पर्यावरण</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Left Scroll Arrow */}
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 h-full flex items-center justify-center bg-gradient-to-r from-[#def9de] cursor-pointer group hover:to-[#f5ebeb5e] to-[#ffffff34]"
              onClick={scrollLeft}
            >
              <FaChevronLeft className="text-[#509933] group-hover:text-[#000000] text-lg" />
            </div>
          )}
          {/* Right Scroll Arrow */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 h-full flex items-center justify-center bg-gradient-to-l from-[#def9de] cursor-pointer group hover:to-[#f5ebeb5e] to-[#ffffff34]"
              onClick={scrollRight}
            >
              <FaChevronRight className="text-[#509933] group-hover:text-[#000000] text-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Prop types validation
Breadcrumb.propTypes = {
  myWord: PropTypes.string.isRequired,
  addNews: PropTypes.bool,
  changeWord: PropTypes.func,
  showLink: PropTypes.bool,
};

export default Breadcrumb;
