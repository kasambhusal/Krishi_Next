"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdvisorModify from "./AdvisorModify";
import { useNavigation } from "../../Context/NavigationContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image"; // Importing Image from next/image

// Define columns with image rendering and action buttons
const columns = (showModal, handleDelete) => [
  {
    title: "S.N",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Mobile Number",
    dataIndex: "phone_no",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Social_media url",
    dataIndex: "social_media",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (text) => (
      <Image
        src={text}
        alt="Author"
        width={50} // Specify width
        height={50} // Specify height
        style={{ objectFit: "cover" }} // Ensure the image fits properly
      />
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          type="primary"
          onClick={() => showModal(record)} // Pass record to showModal
          className="bg-white text-black"
        >
          <EditOutlined />
        </Button>
        <Button type="danger" onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];

const MemberTable = ({ reload, setReload }) => {
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null); // State to hold the selected author

  // Use useCallback to memoize fetchData and avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await Get({ url: "/member/member", headers });
      const filteredResponse = response.filter(
        (author) => author.language === lge
      );
      const formattedData = filteredResponse.map((item) => ({
        key: item.id,
        name: item.name,
        phone_no: item.phone_no,
        address: item.address,
        email: item.author_email,
        image: item.image,
        social_media: item.social_media_url,
      }));
      setDataSource(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load authors!");
    } finally {
      setLoading(false);
    }
  }, [lge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, lge, fetchData, setReload]);

  const showModal = (record) => {
    setCurrentAuthor(record); // Set the selected author
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    fetchData(); // Refresh the data after adding or editing
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this author?",
      content: `Name: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const token = localStorage.getItem("Token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
          await Delete({ url: `/contact/contact/${record.key}`, headers });
          setDataSource((prev) =>
            prev.filter((item) => item.key !== record.key)
          );
          message.success("Author deleted successfully");
        } catch (error) {
          console.error("Error deleting author:", error);
          message.error("Failed to delete author!");
        } finally {
          fetchData(); // Refresh the data after deletion
        }
      },
    });
  };

  return (
    <>
      <Table
        columns={columns(showModal, handleDelete)}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        loading={loading}
      />
      <Modal
        title="Modify Author"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="min-w-[55vw]"
        okText="Change"
        okButtonProps={{
          style: { color: "black", border: "1px solid #bdbbbb" },
        }}
      >
        <AdvisorModify
          modifyObj={currentAuthor} // Pass the selected author object
          fetchData={fetchData}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default MemberTable;
