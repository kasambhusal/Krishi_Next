"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from Next.js
import { usePathname } from "next/navigation";
const BigCardContentRight = ({
  showParagraph = false,
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
      className="h-[400px] sm:h-[450px]"
      style={{ background: "linear-gradient(to top, #006400, #ffffff)" }}
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
        <div
          className="w-full group cursor-pointer h-full overflow-hidden font-mukta"
          onClick={() => {
            scrollToTop();
          }}
        >
          <div className="flex flex-col sm:flex-row h-full gap-5">
            <div className="w-full sm:w-3/5 overflow-hidden h-[250px] sm:h-full relative bg-black group">
              <Image
                src={
                  image ||
                  "https://cms.krishisanjal.com/media/author/logo_2.jpg"
                }
                alt={title} // Use the title as alt text for accessibility
                width={600} // Set width for image optimization
                height={300} // Set height for image optimization
                className="w-full h-full group-hover:opacity-80 group-hover:scale-110 duration-150"
                objectFit="cover" // Ensure the image covers the container and maintains aspect ratio
                loading="lazy" // Lazy loading for improved performance
              />
            </div>
            <div className="w-full sm:w-2/5 flex flex-col h-[150px] sm:h-full justify-center gap-10 px-10">
              <h2
                className="text-green-900 text-2xl text-center sm:text-3xl line-clamp-3 !font-medium leading-6"
                style={{ lineHeight: "1.5" }}
              >
                {title}
              </h2>
              {showParagraph && (
                <p
                  className="text-[#f5f5dc] text-base text-xl line-clamp-4 !font-normal"
                  style={{ lineHeight: "1.5" }}
                >
                  {sub_title}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigCardContentRight;
