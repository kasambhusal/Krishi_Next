"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import NewsModify from "./NewsModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

const NewsTable = ({ reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const { searchValue } = useNewsSearch();
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  // Wrap fetchData in useCallback to memoize it
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue); // Check for non-space content
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/news/news";

      const response = await Get({
        url,
        headers: hasContent ? undefined : headers, // Include headers only if searchValue is not empty
      });
      const responseData = hasContent ? response.news : response;
      const requiredData = responseData
        .filter((item) => item.language === lge)
        .sort((a, b) => new Date(b.self_date) - new Date(a.self_date));

      const transformedData = requiredData.map((item) => ({
        key: item.id,
        language: item.language,
        news_title: item.news_title,
        news_sub_title: item.news_sub_title,
        author_name: item.author_name,
        news_post: item.news_post,
        self_date: item.self_date,
        image: hasContent
          ? `https://cms.krishisanjal.com${item.image}`
          : item.image,
        active: item.active,
        breaking_news: item.breaking_news,
        category: item.category,
        category_name: item.category_name,
        category_key: item.category_key,
      }));
      setDataSource(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch news data!");
    } finally {
      setLoading(false);
    }
  }, [lge, searchValue]);

  // First useEffect to fetch data when component mounts
  useEffect(() => {
    fetchData();
    setReload(false);
  }, [fetchData, setReload]);

  // Second useEffect to fetch data on search or reload change
  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, searchValue, fetchData, setReload]);

  const showModal = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleDelete = async () => {
    if (!selectedNews) return;
    const newsId = selectedNews.key;
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({ url: `/news/news/${newsId}`, headers });
      message.success("News item deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting news:", error);
      message.error("Failed to delete news item!");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedNews(null);
    }
  };

  const columns = [
    {
      title: "S.N",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "News Title",
      dataIndex: "news_title",
      width: 200,
    },
    {
      title: "News Sub Title",
      dataIndex: "news_sub_title",
      width: 150,
    },
    {
      title: "Date",
      dataIndex: "self_date",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => (
        <Image
          src={image}
          alt="News"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
      width: 80,
    },
    {
      title: "Category",
      dataIndex: "category_name",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            className="bg-white text-black"
          >
            <EditOutlined />
          </Button>
          <Button
            type="danger"
            onClick={() => {
              setSelectedNews(record);
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </div>
      <Modal
        title="Modify News"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="min-w-[60vw]"
      >
        <NewsModify
          modifyObj={selectedNews}
          onClose={handleCancel}
          fetchData={fetchData}
          handleCancel={handleCancel}
        />
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        okButtonProps={{ style: { backgroundColor: "blue" } }}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Are you sure you want to delete this news item?</p>
      </Modal>
    </>
  );
};

export default NewsTable;
