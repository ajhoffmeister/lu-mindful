import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, addDoc, query, where, runTransaction } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';

function Admin() {
    const [videoLink, setVideoLink] = useState();
    const [ethnicity, setEthnicity] = useState();
    const [videoTag, setVideoTag] = useState();
    const [videoTitle, setVideoTitle] = useState();

    const [catTag, setCatTag] = useState();
    const [catLang, setCatLang] = useState();
    const [catSpeaker, setCatSpeaker] = useState();

    const API_KEY = '';
    
    const fetchVideoTitle = async (id) => {
        if (!id) return;
    
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${API_KEY}&part=snippet`
          );
          const data = await response.json();
          
          if (data.items.length > 0) {
            const title = data.items[0].snippet.title;
            setVideoTitle(title);
            return title;
          } else {
            setVideoTitle("Video not found");
          }
        } catch (error) {
          console.error("Error fetching video title:", error);
          setVideoTitle("Error fetching title");
        }
      };

    const getYouTubeVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.*|.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };
      

    const handleSubmitVideo = async (e) => {
        e.preventDefault();

        const videoID = getYouTubeVideoId(videoLink);
        setVideoTag(videoID);
        const video_title = await fetchVideoTitle(videoID);
        setVideoTitle(video_title);
    
        await addDoc(collection(db, 'videos'), {
          ethnicity: ethnicity,
          tag: videoID,
          title: video_title,
          url: videoLink,
        });
        
       console.log(videoLink);
       console.log(videoID);
       console.log(ethnicity);
       console.log(video_title);
    
        setVideoLink('');
        setVideoTag('');
        setEthnicity('');
        setVideoTitle('');
        alert('Video submitted!');
    };

    const handleSubmitCategory = async (e) => {
        e.preventDefault();

        const q = query(collection(db, 'video_categories'), where("tag", "==", catTag));

        await runTransaction(db, async (transaction) => {
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                throw new Error("Document with this unique field already exists.");
            }

            console.log(catTag, catSpeaker, catLang);

            await addDoc(collection(db, 'video_categories'), {
                tag: catTag,
                language: catLang,
                speaker: catSpeaker,
            });
        });

        setCatLang('');
        setCatTag('');
        setCatSpeaker('');
        alert('Category Submitted!');
    }

    return (
        <div className="flex justify-center items-center flex-col grid-cols-1 pb-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto max-w-2xl overflow-y-auto flex flex-col mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Video:</h2>
        
        <div className="flex-1">
          <form onSubmit={handleSubmitVideo} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Ethnicity:</label>
              <textarea 
                value={ethnicity} 
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:outline-none resize-none"
                rows="1"
                placeholder="Enter ethnicity..."
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-medium mb-1">Video URL:</label>
              <textarea 
                value={videoLink} 
                onChange={(e) => setVideoLink(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:outline-none resize-none"
                rows="1"
                placeholder="Paste video URL..."
              />
            </div>
      
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Submit Video
            </button>
          </form>
          
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto max-w-2xl overflow-y-auto flex flex-col mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Category:</h2>
        
        <div className="flex-1">
          <form onSubmit={handleSubmitCategory} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tag:</label>
              <textarea 
                value={catTag} 
                onChange={(e) => setCatTag(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:outline-none resize-none"
                rows="1"
                placeholder="Enter tag..."
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-medium mb-1">Language:</label>
              <textarea 
                value={catLang} 
                onChange={(e) => setCatLang(e.target.value)}
                className="w-3/4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:outline-none resize-none"
                rows="1"
                placeholder="Speaker language..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Speaker Ethnicity:</label>
              <textarea 
                value={catSpeaker} 
                onChange={(e) => setCatSpeaker(e.target.value)}
                className="w-3/4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:outline-none resize-none"
                rows="1"
                placeholder="Speaker ethnicity..."
              />
            </div>
      
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Submit Category
            </button>
          </form>
          
        </div>
      </div>
    </div>
      
      
        )
}

export default Admin;
