import React from 'react';

const VideoCard = ({ title, videoUrl }) => {
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);
  
  const handleClick = () => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semi mb-2">{title}</h3>
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={`${title} thumbnail`}
          className="w-full rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[18px] border-t-[10px] border-b-[10px] border-l-black border-t-transparent border-b-transparent ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;