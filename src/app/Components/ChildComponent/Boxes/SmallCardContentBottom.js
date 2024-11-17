"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image
import { usePathname } from "next/navigation";

const SmallCardContentBottom = ({
  showParagraph = false,
  textBlack = false,
  lineClampTitle = 2,
  lineClampDes = 2,
  showDate = false,
  id,
  title,
  sub_title,
  image,
  created_date_ad,
  created_date_bs,
}) => {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="w-full group cursor-pointer h-full overflow-hidden font-mukta"
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
        className="w-full"
      >
        <div className="flex w-full h-full gap-3 flex-col">
          <div className="w-full overflow-hidden h-[220px] sm:h-[250px] relative group">
            {/* Replace img with Image component */}
            <Image
              src={
                image || "https://cms.krishisanjal.com/media/author/logo_2.jpg"
              }
              alt={title} // It's a good practice to set alt text
              width={600} // You can set width based on your design
              height={250} // Set height based on your design
              className="w-full h-full group-hover:opacity-80 group-hover:scale-110 duration-150 mb-5"
              objectFit="cover" // Ensures the image covers the container properly without distortion
              loading="lazy" // Lazy load for better performance
            />
          </div>
          <div className="w-full flex flex-col justify-start gap-[8px] mt-5">
            <h2
              className={`${
                textBlack ? "text-black" : "text-white"
              } text-2xl w-full !font-medium line-clamp-${lineClampTitle}`}
              style={{ lineHeight: "1.5" }}
            >
              {title}
            </h2>
            {showParagraph && (
              <p
                className={`${
                  textBlack ? "text-black/80" : "text-white/80"
                } line-clamp-${lineClampDes} !font-normal`}
                style={{ lineHeight: "1.5" }}
              >
                {sub_title}
              </p>
            )}
            <div>
              {showDate && (
                <div className="flex justify-start items-center gap-2 !text-sm my-[5px]">
                  <div
                    className={`font-mukta  ${
                      textBlack ? "text-[#808080]" : "text-white/70"
                    }`}
                  >
                    १२ श्रावण २०८१
                  </div>
                  <div
                    className={`h-[15px] w-[1px] ${
                      textBlack ? "bg-black/70" : "bg-white/70"
                    }`}
                  ></div>
                  <div
                    className={`font-mukta  ${
                      textBlack ? "text-[#808080]" : "text-white/70"
                    }`}
                  >
                    कृषि पर्यावरण
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallCardContentBottom;
