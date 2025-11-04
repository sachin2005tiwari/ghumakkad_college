import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link for the login link
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { placesData } from '../Data/PlacesData';
import type { Place } from '../types/Place';
import Chatbot from '../components/Chatbot';
import { useAppSelector } from '../store/hook'; // New import for user state
import { Heart } from 'lucide-react';

const STATIC_BACKGROUND = "/photo/background.jpg";

// UPDATED: New Comment interface with only heartCount
interface Comment {
  id: number;
  username: string;
  text: string;
  heartCount: number; // Renamed from likes, dislikes removed
}

const PlaceDetailsPage: React.FC = () => {
  const { name: encodedPlaceName } = useParams<{ name: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [nameOpacity, setNameOpacity] = useState(1);

  // Get user state for commenting feature
  const { username, user } = useAppSelector((state) => state.auth);

  // UPDATED: Initial comments with heartCount only
  const [comments, setComments] = useState<Comment[]>([
    // Initial comments (from the old 'Blogs' section)
    { id: 1, username: 'John Doe', text: 'This place is amazing! The scenery is breathtaking, and the atmosphere is peaceful.', heartCount: 5 },
    { id: 2, username: 'Jane Smith', text: 'A wonderful destination for a weekend getaway. Highly recommended!', heartCount: 12 },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  // NEW STATE: To track which comments the current user/session has hearted (for icon color change)
  const [userHeartedComments, setUserHeartedComments] = useState<Record<number, boolean>>({});

  // MODIFIED FUNCTION: Handle heart click
  const handleToggleHeart = (id: number) => {
    if (!user) {
      alert("You must be logged in to react to a comment.");
      return;
    }

    const isCurrentlyHearted = userHeartedComments[id];

    // 1. Update the local state for icon color (toggle liked status)
    setUserHeartedComments(prev => ({
      ...prev,
      [id]: !isCurrentlyHearted
    }));

    // 2. Update the comments state (heart count)
    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === id) {
          // Increment if liking, decrement if unliking
          const newCount = isCurrentlyHearted ? comment.heartCount - 1 : comment.heartCount + 1;
          return { ...comment, heartCount: newCount };
        }
        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !user) {
      if (!user) {
        alert("You must be logged in to post a comment.");
      } else {
        alert("Comment cannot be empty.");
      }
      return;
    }

    const newComment: Comment = {
      id: Date.now(), // Use timestamp as a unique ID
      username: username || (user.user_metadata.display_name as string) || 'User', // Fallback for safety
      text: newCommentText.trim(),
      heartCount: 0, // Initialize new comment heart count
    };

    setComments((prevComments) => [...prevComments, newComment]);
    setNewCommentText('');
  };

  useEffect(() => {
    const placeName = encodedPlaceName ? decodeURIComponent(encodedPlaceName) : '';
    const foundPlace = placesData.find(p => p.name === placeName) || null;
    setPlace(foundPlace);

    const handleScroll = () => {
      const opacity = Math.max(1 - window.scrollY / 200, 0);
      setNameOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [encodedPlaceName]);

  if (!place) {
    return (
      <div className="bg-brand-light min-h-screen">

        <Navbar />
        <div className="text-center p-10 text-2xl">Place not found!</div>
      </div>
    );
  }

  // FIX: Using a standard Material Design OUTLINED heart path for better symmetry
  

  return (
    // ⬅️ Updated the main container with background styles
    <div
      className="min-h-screen flex flex-col relative bg-cover bg-center"
      style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
    >
      {/* Static Overlay for Readability */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Main Content Wrapper (z-10 ensures content is above the overlay) */}
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />

        {/* Page content starts here */}
        <div className="relative max-h-[500px]">
          <Carousel images={place.details.images} />

          <h1
            className="absolute top-5 left-5 text-4xl z-10 text-white bg-brand-secondary/50 p-3 rounded-lg transition-opacity duration-500"
            style={{ opacity: nameOpacity }}
          >
            {place.name}
          </h1>
        </div>

        {/* Description Section and Tabs (Set background white for readability) */}
        <div className="p-5 max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg my-8">
          <p className="text-xl text-gray-700 my-5">
            {place.details.fullDescription}
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Location Tab */}
          <div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Location</h2>
            <p className="text-gray-600 mb-4">Address: 123 Main St, Sample City, Country</p>
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center text-gray-500 text-xl rounded-lg">
              <p>Map Placeholder</p>
            </div>
          </div>

          {/* Comments Section (Replaces old Blogs/Reviews Tab) */}
          <div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Comments</h2>

            {/* Comment Input Section */}
            {user ? (
              <div className="mt-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Post a Comment as {username}</h3>
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary mb-3 resize-none"
                ></textarea>
                <button
                  onClick={handleAddComment}
                  className="py-2 px-5 text-white text-base bg-brand-primary border-none rounded-md cursor-pointer transition duration-300 hover:bg-brand-secondary"
                >
                  Comment
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600 p-4 border border-dashed rounded-lg bg-gray-50/80">
                <Link to="/login" className="font-medium text-brand-secondary hover:text-brand-primary transition duration-150">
                  Log in
                </Link> to post a comment.
              </p>
            )}


            {/* Display Existing Comments (Newest first) */}
            <div className="mt-6">
              {comments.slice().reverse().map((comment) => {
                const isHearted = userHeartedComments[comment.id];

                return (
                  <div key={comment.id} className="mb-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700">{comment.username}</h3>
                    <p className="mt-1 text-gray-600">{comment.text}</p>

                    {/* UPDATED: Single Heart Button Section with fixed SVG paths */}
                    <div className="flex items-center space-x-4 mt-2">
                      <button
                        onClick={() => handleToggleHeart(comment.id)}
                        // Icon color is now conditionally set: red if hearted, gray otherwise
                        className={`flex items-center transition duration-150 ${isHearted ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                        aria-label="Heart comment"
                      >
                        {/* Conditionally render Filled or Outlined SVG */}
                        {isHearted ? <Heart fill='#ef4444' /> : <Heart />}
                        <span className="text-sm font-medium text-gray-700">{comment.heartCount}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
              {comments.length === 0 && (
                <p className="text-center text-gray-500 p-4">No comments yet. Be the first to share your story!</p>
              )}
            </div>
            {/* End Comments Section */}
          </div>
          {/* End Comments Section */}
        </div>

      </div>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default PlaceDetailsPage;