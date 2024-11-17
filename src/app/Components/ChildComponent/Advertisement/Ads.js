import React from "react";
import { useAds } from "../../Context/AdsContext";
import { Skeleton } from "@mui/material";
import Image from "next/image"; // Import Image component

const Ads = ({ name }) => {
  const { ads, loading } = useAds();

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    }
    return "unknown";
  };

  const filteredAd = ads.find((ad) => ad.ads_name === `${name}`);

  return (
    <div className="max-w-full flex justify-center my-5">
      {loading ? (
        <span>
          <Skeleton variant="rectangular" width="80vw" height={120} />
        </span>
      ) : (
        filteredAd && (
          <div className="flex items-center justify-center">
            <a href={filteredAd.ads_url} target="_blank" rel="noreferrer">
              {/* Image */}
              {getMediaType(filteredAd.ads_image) === "image" && (
                <Image
                  src={filteredAd.ads_image}
                  alt="Ad"
                  layout="responsive" // Ensures responsive resizing
                  width={800} // Set a base width (you can adjust based on your design)
                  height={400} // Set a base height (adjust as needed)
                  style={{ maxWidth: "100%" }} // Ensure it's responsive
                />
              )}

              {/* Video */}
              {getMediaType(filteredAd.ads_image) === "video" && (
                <video
                  src={filteredAd.ads_image}
                  controls
                  style={{ maxWidth: "100%", maxHeight: "70px" }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </a>
          </div>
        )
      )}
    </div>
  );
};

export default Ads;
