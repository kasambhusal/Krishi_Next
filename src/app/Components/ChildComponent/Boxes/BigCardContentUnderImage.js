"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from Next.js
import { usePathname } from "next/navigation";
const BigCardContentUnderImage = ({
  isRounded = false,
  isShadow = false,
  id,
  title,
  sub_title,
  image,
  created_date_ad,
  created_date_bs,
}) => {
  const pathname = usePathname();
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  return (
    <div
      className="h-full w-full cursor-pointer overflow-hidden bg-white"
      onClick={() => {
        scrollToTop();
      }}
    >
      <Link
        href={
          lge === "en"
            ? `/en/story/${created_date_ad
                .split("T")[0]
                .split("-")
                .join("/")}/${id}/${title}`
            : `/story/${created_date_bs.replace(/-/g, "/")}/${id}`
        }
      >
        <div className="relative w-full h-full overflow-hidden hover:scale-110 duration-150">
          {/* Use the Image component from next/image */}
          <Image
            src={
              image || "https://cms.krishisanjal.com/media/author/logo_2.jpg"
            }
            alt={title}
            width={600} // Set width for optimization
            height={400} // Set height for optimization
            className="w-full h-full transition-transform duration-150"
            objectFit="cover" // Ensure the image fills the container without distortion
            loading="lazy" // Lazy load the image to improve performance
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.04)] h-full bg-gradient-to-t to-[#9c9c9c02] from-[#000] flex flex-col items-center justify-end gap-[25px]">
            <p
              className="text-center text-3xl sm:text-4xl max-w-[90%] mx-auto text-[#FCFBF4] font-mukta h-auto"
              style={{ lineHeight: "1.5" }}
            >
              {title}
            </p>
            <p className="w-[90%] sm:w-[80%] text-center text-[16px] sm:text-[18px] text-[#bfbdbd]">
              {sub_title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigCardContentUnderImage;
