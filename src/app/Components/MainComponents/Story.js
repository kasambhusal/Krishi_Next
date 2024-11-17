"use client";
import React, { useEffect, useState } from "react";
import Ads from "../ChildComponent/Advertisement/Ads";
import Share from "../ChildComponent/Others/Share";
import Contact from "../ChildComponent/Others/Contact";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import { useParams } from "next/navigation";
import { useNews } from "../Context/NewsContext";
import { Skeleton } from "antd";
import AuthorBredCrumb from "../ChildComponent/Others/AuthorBredCrumb";
import SmallAds from "../ChildComponent/Advertisement/SmallAds";
import { useTheme } from "../Context/ThemeContext";
import RoadBlocking from "../ChildComponent/Advertisement/RoadBlocking";
import FormatNepaliDate from "../JS/FormatNepaliDate";
import FormatEnglishDate from "../JS/FormatEnglishDate";
import { useCount } from "../Context/CountContext";
import { Get } from "../Redux/API";
import NotFound from "../ErrorPage/NotFound";
import { Meta } from "./Meta";
import Image from "next/image"; // Import Image from Next.js

const Story = () => {
  const params = useParams();
  const { newsId } = params;
  const { wholeNews, loading: newsLoading } = useNews();
  const { themeColor, bgColor } = useTheme();
  const { count } = useCount();
  const [scrolled, setScrolled] = useState(false);
  const [news, setNews] = useState(null);
  const [nepaliDate, setNepaliDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const [viewsId, setViewsId] = useState(null);
  const [shareCount, setShareCount] = useState(0);
  const loading = newsLoading || !wholeNews;

  useEffect(() => {
    if (!wholeNews) return;

    const filteredNews = wholeNews.find((item) => item.id === Number(newsId));
    if (filteredNews) {
      setNews(filteredNews);
      setNepaliDate(FormatNepaliDate(filteredNews.self_date));
      setEnglishDate(FormatEnglishDate(filteredNews.self_date));
    } else {
      setNews(null);
    }
  }, [wholeNews, newsId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchAndPostViews = async () => {
      if (!news) return;

      try {
        const response = await count;
        const filteredResponse = response.find(
          (item) => item.title === String(newsId)
        );
        if (filteredResponse) {
          const response2 = await Get({
            url: `/count/posts/${filteredResponse.id}/`,
          });
          if (response2) {
            setShareCount(JSON.parse(response2.shares[0].share_count));
            setViewsId(response2.id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndPostViews();
  }, [count, newsId, news]);

  const renderHtmlContent = (htmlString) => (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlString || "<p>No content to display.</p>",
      }}
      className="content"
      style={{ lineHeight: "1.6", wordWrap: "break-word" }}
    />
  );

  if (loading) {
    return (
      <div className="w-[90%] mx-auto my-[50px] flex flex-col gap-[30px]">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!news && wholeNews && !loading) {
    return <NotFound />;
  }

  return (
    <div
      className="flex justify-center w-full"
      style={{ backgroundColor: bgColor }}
    >
      {/* <Meta /> */}
      <div className="flex flex-col justify-center w-[97%] sm:w-[90%]">
        <RoadBlocking name="S_roadblocking_ads" />
        <Ads name="S_landscape_before_title" />

        <span
          className={`text-${
            scrolled ? "2xl pl-3 md:text-3xl shadow-lg" : "3xl md:text-5xl"
          } 
          duration-[1s] font-bold sticky top-[59px] z-10 p-2`}
          style={{
            lineHeight: "1.5",
            transition: "font-size 0.5s ease-in-out",
            backgroundColor: bgColor,
          }}
        >
          {news && <h1>{news.news_title}</h1>}
        </span>

        <div className="flex flex-col w-full items-center gap-12 py-4 mt-8 mb-5">
          <div className="w-full flex flex-wrap justify-between sm:px-5">
            <h1 className="flex gap-5 items-center text-center ">
              {englishDate && nepaliDate && news.author_name && (
                <AuthorBredCrumb
                  id={news.author_name}
                  englishDate={englishDate}
                  nepaliDate={nepaliDate}
                  category={news.category_name}
                  language={news.language}
                />
              )}
            </h1>
            <span className="flex gap-[15px] justify-end w-full lg:w-auto ">
              <Share
                newsTitle={news.news_title}
                id={viewsId}
                shareCount={shareCount}
              />
            </span>
          </div>
        </div>

        <Ads name="S_landscape_after_title" />
        <div className="w-full grid grid-cols-11">
          <div className="col-span-11 xl:col-span-7 w-full h-full">
            <div className="flex flex-col gap-[20px] w-full">
              {news.image && (
                <Image
                  src={news.image}
                  alt="News"
                  style={{
                    border: `2px dotted ${themeColor}`,
                    borderRadius: "5px",
                  }}
                  className="w-full"
                  width={1200} // Adjust width
                  height={600} // Adjust height
                />
              )}
              <div style={{ backgroundColor: bgColor, width: "100%" }}>
                {renderHtmlContent(news.news_post)}
              </div>
              {news.table_html && renderHtmlContent(news.table_html)}
            </div>
            <div className="my-5">
              <Share
                newsTitle={news.news_title}
                id={newsId}
                shareCount={shareCount}
              />
            </div>
            <div className="sticky top-[120px]">
              <Ads name="S_landscape_after_content" />
            </div>
          </div>
          <div className="col-span-11 xl:col-span-4 h-full px-5">
            <div>
              <SmallAds name="S_sidebar_before_followus1" />
              <SmallAds name="S_sidebar_before_followus2" />
              <h2 className="text-2xl font-bold">Follow Us:</h2>
              <Contact />
              <SmallAds name="S_sidebar_after_followus1" />
              <SmallAds name="S_sidebar_after_followus2" />
            </div>
            <div style={{ position: "sticky", top: "120px", zIndex: "5" }}>
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
