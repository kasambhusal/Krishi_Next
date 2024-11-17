"use client";
import React, { useState } from "react";
import AdvertisementTable from "./AdvertisementTable";
import { Button } from "antd";
import { Modal } from "antd";
import AdvertisementAdd from "./AdvertisementAdd";

export default function Advertisement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reload, setReload] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "85%" }}>
        <h2 className="width-100" style={{ textAlign: "right" }}>
          <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            className="my-3"
            onClick={showModal}
          >
            Add Advertisement{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Add Advertisement"
            open={isModalOpen}
            footer=""
            onCancel={handleCancel}
            okText="Create" // Set the text directly here
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
          >
            <AdvertisementAdd
              handleCancel={handleCancel}
              setReload={setReload}
            />
          </Modal>
        </h2>
        <AdvertisementTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
