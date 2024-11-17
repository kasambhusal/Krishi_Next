"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image

export default function BicharBlogBox({
  title,
  image,
  id,
  created_date_ad,
  created_date_bs,
}) {
  const [lge, setLge] = useState(
    window.location.pathname.includes("/en") ? "en" : "np"
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
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
        style={{
          padding: "10px 0px",
        }}
        className="flex items-center h-[100px] w-full cursor-pointer"
        onClick={() => {
          scrollToTop();
        }}
      >
        <Image
          src={image}
          alt="image"
          style={{ borderRadius: "5px" }}
          className="mx-3 w-[100px] h-full"
          width={100} // Set the width for optimization
          height={100} // Set the height for optimization
        />
        <span>
          <p
            className=" text-xl text-base my-1 line-clamp-3 text-[rgba(0,0,0,0.7)] hover:text-green-700"
            style={{ fontWeight: "600", lineHeight: "1.5" }}
          >
            {title}
          </p>
        </span>
      </div>
    </Link>
  );
}
