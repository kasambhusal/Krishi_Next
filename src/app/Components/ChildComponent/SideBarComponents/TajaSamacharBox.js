"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function TajaSamacharBox({
  title,
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
        className="my-3 py-1 cursor-pointer"
        onClick={() => {
          scrollToTop();
        }}
      >
        <p
          className="font-bold font-mukta text-xl line-clamp-3 text-[rgba(0,0,0,0.7)] hover:text-green-600 duration-150"
          style={{ lineHeight: "1.5" }}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}
