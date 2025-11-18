import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppSelector } from "../store/hook";
import commentService from "../services/commentService";


// --- Interface for User Comment (Updated) ---
interface UserComment {
    id: number;
    created_at: string;
    content: string;
    location_id: number;
    user_id: string;
    profiles: {
		username: string;
	} | null;
    locations: { // Location name and ID
        name: string;
        id: number;
    } | null;
    heartCount: number; // Added to hold the fetched like count
}
// ------------------------------------

const STATIC_BACKGROUND = "/photo/background.jpg";

const MyCommentsPage: React.FC = () => {
    const { user, loading: authLoading } = useAppSelector((state) => state.auth);
    // Initial state updated to include heartCount (which defaults to 0)
    const [comments, setComments] = useState<UserComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (authLoading || !user) {
            setLoading(false);
            return;
        }
        
        const fetchUserComments = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch comments by user ID
                // Note: We use 'any' temporarily here as the return type needs merging later
                const commentsDataRaw = (await commentService.getCommentsByUserId(user.id));

                if (!commentsDataRaw || commentsDataRaw.length === 0) {
                    setComments([]);
                    setLoading(false);
                    return;
                }
                
                const commentIds = commentsDataRaw.map((c: any) => c.id);

                // 2. Fetch like counts for these comments
                const likesMap: Record<number, number> = {};
                if (commentIds.length > 0) {
                    const countsData = await commentService.getLikeCounts(commentIds);
                    if (countsData) {
                        for (const item of countsData as { comment_id: number; like_count: number }[]) {
                            likesMap[item.comment_id] = item.like_count;
                        }
                    }
                }
                
                // 3. Combine data and format for state
                const processedComments: UserComment[] = commentsDataRaw.map((comment: any) => ({
                    ...comment,
                    // Ensure that the structure matches the interface
                    locations: comment.locations || null,
                    heartCount: likesMap[comment.id] || 0, // Use fetched like count
                }));

                setComments(processedComments);
                
            } catch (err) {
                console.error("Error fetching user comments/likes:", err);
                setError("Failed to fetch your comments or like counts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchUserComments();
        }

    }, [user, authLoading]);

    // Handle click on comment div
    const handleCommentClick = (locationId: number) => {
        navigate(`/place/${locationId}`);
    };
    
    // Show this if the user is not logged in
    if (!user && !authLoading) {
        return (
            <div 
                className="min-h-screen flex flex-col relative bg-cover bg-center"
                style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
            >
                <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
                <div className="relative z-10 flex-grow flex flex-col">
                    <Navbar />
                    <div className="flex-grow flex items-center justify-center p-8">
                        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl max-w-lg w-full text-center">
                            <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                            <p className="text-lg text-gray-700 mb-6">
                                Please <Link to="/login" className="text-brand-secondary hover:text-brand-primary font-medium">Log in</Link> to view your comments.
                            </p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
    
    // Main page content
    return (
        <div
            className="min-h-screen flex flex-col relative bg-cover bg-center"
            style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
        >
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
            
            <div className="relative z-10 flex-grow flex flex-col">
                <Navbar />
                
                <div className="flex-grow p-8">
                    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-bold text-brand-secondary mb-6 text-center">
                            Your Comments
                        </h1>

                        {loading || authLoading ? (
                            <p className="text-center text-gray-500 p-4">Loading your comments...</p>
                        ) : error ? (
                            <p className="text-center text-red-500 p-4">{error}</p>
                        ) : comments.length === 0 ? (
                            <p className="text-center text-gray-600 p-4 border border-dashed rounded-lg bg-gray-50">
                                You haven't posted any comments yet!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div 
                                        key={comment.id}
                                        onClick={() => handleCommentClick(comment.location_id)} // Click handler added
                                        className="p-4 bg-white border border-brand-primary/50 rounded-lg shadow-md cursor-pointer transition duration-150 hover:shadow-xl hover:scale-[1.01]"
                                    >
                                        
                                        {/* 1. Posted On */}
                                        <div className="mb-3 pb-2 border-b border-gray-200 flex justify-start items-center">
                                            <p className="text-xl font-bold text-brand-secondary">
                                                Posted on: 
                                                <span 
                                                    className="text-brand-primary ml-2 underline"
                                                >
                                                    {comment.locations?.name || "Unknown Location"}
                                                </span>
                                            </p>
                                        </div>

                                        {/* 2. Comment Content and Likes (Combined and Right-aligned) */}
                                        <div className="flex justify-between items-start"> 
                                            <p className="text-lg text-gray-700 pr-4"> 
                                                {comment.content}
                                            </p>
                                            
                                            {/* Likes Section (Displays real fetched heartCount) */}
                                            <span className="text-md font-medium text-gray-500 whitespace-nowrap">
                                                {comment.heartCount} Likes
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <Footer />
            </div>
        </div>
    );
};

export default MyCommentsPage;