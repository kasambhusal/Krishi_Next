"use client";
import { Button, Checkbox, Form, Input, Select, message } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "../../Context/NavigationContext";
import { Get, Post } from "../../Redux/API";

export default function SubCategoryAdd({ handleCancel, setReload }) {
  const { lge } = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({
    category: undefined,
    category_key_name: "",
    language: lge,
    active: true,
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Memoize fetchData to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await Get({ url: "/category/category", headers });
      const filteredResponse = response.filter((item) => item.language === lge);
      setCategoryList(filteredResponse);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [lge]);

  // Run fetchData when the component mounts or when `lge` changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options = categoryList.map((category) => ({
    value: category.id,
    label: category.category_name,
  }));

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const { category, category_key_name } = formData;

    if (!category || !category_key_name) {
      message.error("Please fill all required fields.");
      return;
    }

    setLoading(true); // Set loading to true

    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };

    Post({ url: "/category/sub-category", data: formData, headers })
      .then(() => {
        message.success("Subcategory added successfully!");
        setFormData({
          category: undefined,
          category_key_name: "",
          language: lge,
          active: true,
        });
        handleCancel();
        setReload(true);
      })
      .catch((error) => {
        console.error("Submission failed:", error);
        message.error("Something went wrong!");
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request
      });
  };

  return (
    <div className="flex justify-center my-5">
      <Form layout="vertical" style={{ width: "100%", maxWidth: "500px" }}>
        <Form.Item label="Select Category" required>
          <Select
            placeholder="-- Select Category --"
            options={options}
            onChange={(value) => handleChange("category", value)}
            allowClear
            required
          />
        </Form.Item>

        <Form.Item label="Sub Category Name*" required>
          <Input
            value={formData.category_key_name}
            onChange={(e) => handleChange("category_key_name", e.target.value)}
            required
          />
        </Form.Item>

        <Form.Item label="Language">
          <Input
            value={formData.language}
            disabled
            className="text-[#878684] cursor-not-allowed"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={formData.active}
            onChange={(e) => handleChange("active", e.target.checked)}
          >
            Active
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            block
            loading={loading}
            className="bg-blue-500"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
