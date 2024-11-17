import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Card8() {
  const [videos, setVideos] = React.useState([
    {
      id: 1,
      gallery_video: "https://www.youtube.com/embed/XTWgCa6TTSc",
    },
    {
      id: 2,
      gallery_video: "https://www.youtube.com/embed/3kpKGnSc2V8", // Corrected embed URL
    },
    {
      id: 3,
      gallery_video: "https://www.youtube.com/embed/jSK9qmdtIR4",
    },
  ]);

  return (
    <div className="flex flex-col items-center md:flex-row gap-5 w-full h-full overflow-hidden my-10">
      {videos.length > 0 ? (
        videos.map((video) => (
          <iframe
            key={video.id}
            width="250"
            height="250"
            src={video.gallery_video}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ))
      ) : (
        <div className="h-[60vh]">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
    </div>
  );
}
