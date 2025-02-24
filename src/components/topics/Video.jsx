import React from 'react';
import YouTube from "react-youtube";
import VideoCard from '../common/Videocard';

class EmbedVideo extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };

    return <YouTube videoId="srIPukopH3E" opts={opts} onReady={this._onReady} />;
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

const Video = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Video</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <VideoCard 
          title="The Tangent and Velocity Problems!"
          videoUrl="https://www.youtube.com/watch?v=srIPukopH3E&t=1s"
        />

        <VideoCard 
          title="Calculating Limits Using the Limit Laws"
          videoUrl="https://www.youtube.com/watch?v=UpEejH7Gkoo"
        />

        <VideoCard 
          title="The Precise Definition of a Limit"
          videoUrl="https://www.youtube.com/watch?v=_o7QRHwqqTE"
        />

        <EmbedVideo />

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">The Precise Definition of a Limit</h3>
          <p></p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Continuity</h3>
          <p></p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Limits at Infinity</h3>
          <p></p>
        </div>


      </div>
    </div>
  );
};

export default Video;