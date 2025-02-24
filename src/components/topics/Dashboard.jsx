import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import VideoPlayer from '../VideoPlayer';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [currentView, setCurrentView] = useState('selection'); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'video_categories')));
        const catList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(catList);
        console.log("categories fetched");
        return catList
      } catch (error) {
        console.error("Error fetching categories: %s", error);
      }
    };

    fetchCategories();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handles submitting feedback to the database
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'feedback'), {
        videoId: selectedVideoId,
        feedback: feedback,
        createdAt: new Date(),
      });
      setFeedback('');
      setShowModal(false);
      alert('Feedback submitted!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Opens the feedback modal
  const openModal = (videoId, videoTitle) => {
    setSelectedVideoId(videoId);
    setSelectedVideoTitle(videoTitle);
    setShowModal(true);
  };

  // Fetch videos by category
  const fetchVideos = async (category, title) => {
    try {
      const videoQuery = query(collection(db, 'videos'), where('ethnicity', '==', category));
      const querySnapshot = await getDocs(videoQuery);
      const videoList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videoList);
      setCurrentView('videos'); // Switch to videos view
      setSelectedCategory(title)
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const colorPattern = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500', 'bg-teal-500'];

  // Render video selection buttons
  const renderSelectionView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Category:</h1>

      <div className="flex-col grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {categories.map((cat, index) => {
        const colorClass = colorPattern[index % colorPattern.length];
        return (
          <button
          className={`${colorClass} text-white px-4 py-2 rounded`}
          onClick={() => fetchVideos(cat.tag, cat.language + " Language - " + cat.speaker + " Speaker" )}
        >
          {cat.language} Language <br/>
          {cat.speaker} Speaker
        </button>
        )})}
      </div>
    </div>
  );

  // Render video list
  const renderVideosView = () => (
    <div className="p-6">
      <button
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
        onClick={() => setCurrentView('selection')}
      >
        Back to Categories
      </button>
      <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            className="flex flex-col bg-white rounded-lg p-6 justify-between shadow-sm"
            key={video.id}
          >
            <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
            <div className="px-1 py-1 mt-auto bg-blue-100 w-fit rounded flex justify-center">
              <VideoPlayer videoId={video.tag} />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => openModal(video.id, video.title)}
            >
              Submit Feedback
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {currentView === 'selection' ? renderSelectionView() : renderVideosView()}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl h-96 overflow-y-auto">
            <h2 className="text-xl mb-4">Submit Feedback on:</h2>
            <h2 className="text-lg mb-4 font-semibold text-blue-600">{selectedVideoTitle}</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                className="w-full p-2 border rounded mb-4 h-32"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here..."
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                type="button"
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;