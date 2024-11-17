"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthors } from "../../Context/AuthorContext";
import Image from "next/image"; // Import Image from next/image
import { usePathname } from "next/navigation";
const AuthorBredCrumb = ({
  textBlack = true,
  id,
  category,
  nepaliDate,
  englishDate,
  language,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { authors, loading } = useAuthors();
  const myAuthor = authors.find((author) => author.id === Number(id));
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  const handleAuthorClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    router.push(lge === "en" ? `/en/author/${id}` : `/author/${id}`);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  };

  return (
    <div className="flex justify-center items-center gap-3">
      <div
        className="flex justify-center items-center gap-2"
        onClick={handleAuthorClick}
      >
        <div className="flex items-center justify-center">
          {/* Replacing <img> with <Image> */}
          <Image
            src={
              myAuthor
                ? myAuthor.image
                : "https://media.istockphoto.com/id/827247322/vector/danger-sign-vector-icon-attention-caution-illustration-business-concept-simple-flat-pictogram.jpg?s=612x612&w=0&k=20&c=BvyScQEVAM94DrdKVybDKc_s0FBxgYbu-Iv6u7yddbs="
            }
            width={32} // Set width (same as w-8 in Tailwind)
            height={32} // Set height (same as h-8 in Tailwind)
            className="rounded-full border border-gray-300 cursor-pointer transition-transform transform hover:scale-105"
            alt="Author"
          />
        </div>

        <div
          className={`font-mukta cursor-pointer text-[19px] font-bold hover:text-[#0c8a30] ${
            textBlack ? "text-black/80" : "text-white/80"
          }`}
        >
          {loading
            ? "Loading..."
            : myAuthor
              ? myAuthor.name
              : "Author Not Found"}
        </div>
      </div>
      <div
        className={`font-mukta h-[20px] w-[1px] ${
          textBlack ? "bg-black/80" : "bg-white/80"
        }`}
      ></div>
      <div
        className={`font-mukta ${
          textBlack ? "text-black/80" : "text-white/80"
        }`}
      >
        {language === "en" ? englishDate : nepaliDate}
      </div>
      <div
        className={`font-mukta h-[20px] w-[1px] ${
          textBlack ? "bg-black/80" : "bg-white/80"
        }`}
      ></div>
      <div
        className={`font-mukta ${
          textBlack ? "text-black/80" : "text-white/80"
        }`}
      >
        {category}
      </div>
    </div>
  );
};

export default AuthorBredCrumb;
