import Story from "@/app/Components/MainComponents/Story";
import React from "react";
import { Mukta } from "next/font/google";
import { Height } from "@mui/icons-material";
// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"], // You can choose subsets based on your needs
  variable: "--font-mukta",
});

const fetchPost = async (postId) => {
  const response = await fetch(
    "https://cms.krishisanjal.com/krishi_cms/api/v1/public/news/get-news",
    { method: "GET" }
  );
  const data = await response.json();

  // If post not found, return null
  const filteredPost = data.find((item) => item.id === Number(postId));
  return filteredPost || null; // Return null if not found
};

export async function generateMetadata({ params }) {
  let post;
  const year = await params.year;
  const month = await params.month;
  const day = await params.day;
  const newsId = await params.newsId;
  const fullUrl = `https://krishisanjal.com/story/${year}/${month}/${day}/${newsId}`;
  try {
    post = await fetchPost(params.newsId);
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching the news article.",
    };
  }

  // Handle the case where post is not found
  if (!post) {
    return {
      title: "Krishi Sanjal",
      description:
        "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
    };
  }

  return {
    title: post.news_title,
    description: post.news_title, // You can adjust this as needed
    openGraph: {
      title: post.title,
      description: post.description,
      url: fullUrl,
      siteName: "Krishi Sanjal",
      images: [
        {
          url: post.image,
          width: 1260,
          height: 800,
        },
      ],
      type: "website",
    },
  };
}

export default function page() {
  return (
    <div className={`${mukta.className} antialiased`}>
      <Story />
    </div>
  );
}
