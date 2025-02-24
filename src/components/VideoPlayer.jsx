import React from 'react';
import YouTube from 'react-youtube';

function VideoPlayer({ videoId }) {
  const opts = {
    height: '195',
    width: '320',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="flex w=fit justify-center h-full p-4">
        <YouTube videoId={videoId} opts={opts} />
    </div> );
}

export default VideoPlayer;