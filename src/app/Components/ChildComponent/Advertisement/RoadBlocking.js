import React, { useEffect, useState } from "react";
import { useAds } from "../../Context/AdsContext";
import Image from "next/image"; // Import Image from next/image
import Link from "next/link";

const RoadBlocking = ({ name }) => {
  const { ads, loading: adsLoading } = useAds();
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    }
    return "unknown";
  };

  const filteredAd = ads.find((ad) => ad.ads_name === name);

  // Set visibility with a delay if an ad is found
  useEffect(() => {
    let timer;
    if (filteredAd) {
      // Show the ad after a 3-second delay
      timer = setTimeout(() => {
        setIsVisible(true);

        // Hide the ad after 5 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(hideTimer);
      }, 1000);
    } else {
      setIsVisible(false); // Ensure visibility is false if no ad is found
    }

    return () => clearTimeout(timer);
  }, [filteredAd]);

  // Disable scrollbar only when an ad is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!filteredAd || !isVisible) {
    return null; // Return nothing if no ad is found or if not visible
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center w-full justify-center gap-[20px] bg-green-100 z-50 transition-all duration-500 transform ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      style={{ overflow: "hidden" }}
    >
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          height={50}
          width={200}
          loading="lazy"
        />
      </Link>
      <div className="flex w-full justify-center">
        <div
          className="relative md:p-[3px] max-w-[85%] l:max-w-[95%] flex items-center justify-center"
          style={{ border: "1px solid #84878c", borderRadius: "5px" }}
        >
          <a
            href={filteredAd.ads_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Image */}
            {getMediaType(filteredAd.ads_image) === "image" && (
              <Image
                src={filteredAd.ads_image}
                alt="Ad"
                width={700} // Set width and height for optimization
                height={500} // Set height as per your design
                loading="lazy"
                className="max-h-[500px] max-w-full md:max-w-[700px] md:max-h-[700px]"
                unoptimized
              />
            )}

            {/* Video */}
            {getMediaType(filteredAd.ads_image) === "video" && (
              <video
                src={filteredAd.ads_image}
                controls
                loading="lazy"
                className="max-h-[500px] max-w-full md:max-w-[700px] md:max-h-[700px]"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </a>
          {/* Cross image positioned in the top-right corner */}
          <Image
            src="/cross.png"
            onClick={handleClose}
            className="absolute top-[-10px] right-[-10px] cursor-pointer bg-white"
            width={30}
            height={30}
            alt="Close"
            loading="lazy"
            style={{ borderRadius: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoadBlocking;
