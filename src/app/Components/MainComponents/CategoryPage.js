"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Get } from "../Redux/API";
import { Skeleton } from "@mui/material";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import BigCardContentRight from "../ChildComponent/Boxes/BigCardContentRight";
import SmallCardContentBottom from "../ChildComponent/Boxes/SmallCardContentBottom";
import { Button } from "antd";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import NotFound from "../ErrorPage/NotFound";
import { useNews } from "../Context/NewsContext";
import { useTheme } from "../Context/ThemeContext";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const params = useParams();
  const { categoryName } = params;
  const decodedCategoryName = decodeURIComponent(categoryName);

  const { wholeNews, loading } = useNews();
  const [filteredNews, setFilteredNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const { bgColor } = useTheme();
  const [isValidCategory, setIsValidCategory] = useState(null);

  // Memoizing the checkCategoryValidity function using useCallback
  const checkCategoryValidity = useCallback(async () => {
    try {
      const categoryData = await Get({ url: "/public/category/get-category" });
      const subCategoryData = await Get({
        url: "/public/category-key/get-categoryKey",
      });

      const isCategoryValid = categoryData.find(
        (item) => item.category_name === decodedCategoryName
      );
      const isSubCategoryValid = subCategoryData.find(
        (item) => item.category_key_name === decodedCategoryName
      );

      setIsValidCategory(!!(isCategoryValid || isSubCategoryValid));
    } catch (error) {
      console.error("Error fetching category data:", error);
      setIsValidCategory(false);
    }
  }, [decodedCategoryName]); // Only re-create the function when decodedCategoryName changes

  useEffect(() => {
    checkCategoryValidity();
  }, [decodedCategoryName, checkCategoryValidity]); // Now it's safe to call checkCategoryValidity here

  useEffect(() => {
    if (wholeNews.length) {
      const categoryNews = wholeNews.filter(
        (item) =>
          item.category_name === decodedCategoryName ||
          item.sub_category === decodedCategoryName
      );
      setFilteredNews(categoryNews);
    }
  }, [wholeNews, decodedCategoryName]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (loading) {
    return (
      <div
        className="w-full flex justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-[97%] sm:w-[90%]">
          <div className="w-full grid grid-cols-6 mt-10">
            <div className="col-span-6 md:col-span-4 px-3">
              <Breadcrumb
                showLinks={false}
                myWord={decodedCategoryName}
                addNews={false}
              />
              <Skeleton variant="rectangular" width="80%" height="60vh" />
              <div className="w-full flex flex-wrap gap-[25px]">
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
              </div>
            </div>
            <div className="col-span-6 md:col-span-2 mt-10">
              <div className="sticky top-[60px]">
                <TajaSamachar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isValidCategory === null) {
    return (
      <div
        className="w-full flex justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-[97%] sm:w-[90%]">
          <div className="w-full grid grid-cols-6 mt-10">
            <div className="col-span-6 md:col-span-4 px-3">
              <Breadcrumb
                showLinks={false}
                myWord={decodedCategoryName}
                addNews={false}
              />
              <Skeleton variant="rectangular" width="80%" height="80vh" />
              <div className="w-full flex flex-wrap gap-[25px]">
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="rectangular" width="80%" height={150} />
              </div>
            </div>
            <div className="col-span-6 md:col-span-2 mt-10">
              <div className="sticky top-[60px]">
                <TajaSamachar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isValidCategory === false) {
    return <NotFound />;
  }

  if (filteredNews.length === 0) {
    return (
      <div className="text-center text-lg font-semibold">No News Found</div>
    );
  }

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]">
        <div className="w-full grid grid-cols-6 mt-10">
          <div className="col-span-6 md:col-span-4 px-3">
            <Breadcrumb
              showLinks={false}
              myWord={decodedCategoryName}
              addNews={false}
            />
            <div className="mt-4">
              <BigCardContentRight
                showParagraph={true}
                id={filteredNews[0].id}
                title={filteredNews[0].news_title}
                sub_title={filteredNews[0].news_sub_title}
                image={filteredNews[0].image}
                created_date_ad={filteredNews[0].created_date_ad}
                created_date_bs={filteredNews[0].created_date_bs}
              />
              <div className="flex flex-wrap justify-evenly gap-[15px] sm:gap-[30px] mt-4">
                {filteredNews.slice(1, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="w-[95%] sm:w-[80%] xl:w-[40%] pb-4 pt-2 px-3 bg-green-100 rounded-md"
                  >
                    <SmallCardContentBottom
                      lineClampTitle={1}
                      lineClampDes={2}
                      textBlack={true}
                      showParagraph={true}
                      showDate={false}
                      title={item.news_title}
                      sub_title={item.news_sub_title}
                      image={item.image}
                      id={item.id}
                      created_date_ad={item.created_date_ad}
                      created_date_bs={item.created_date_bs}
                    />
                  </div>
                ))}
              </div>
              {visibleCount < filteredNews.length && (
                <Button
                  onClick={handleLoadMore}
                  type="primary"
                  block
                  className="bg-green-500 text-white"
                >
                  Load More
                </Button>
              )}
            </div>
          </div>
          <div className="col-span-6 md:col-span-2 mt-10">
            <div className="sticky top-[60px]">
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
