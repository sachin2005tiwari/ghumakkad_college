import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { LocationDetails } from "../types/locations";
import locationService from "../services/locationServices";
import AttractionCard from "../components/AttractionCard";
import { useAppSelector } from "../store/hook";
import { Heart, MapPinned } from "lucide-react";
// Import your service and the new types
import commentService from "../services/commentService";
import { AppComment, DbComment } from "../types/comments";
import MapDisplay from "../components/MapDisplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/Carousel";
import { Card, CardContent } from "@/components/ui/card";
import WeatherWidget from "@/components/WeatherWidget";

const STATIC_BACKGROUND = "/photo/background.jpg";

/**
 * Helper function to map raw DbComment to AppComment
 * (Matches your service structure)
 */
const mapDbToAppComment = (
    comment: DbComment,
    likesMap: Record<number, number>
): AppComment => ({
    id: comment.id,
    created_at: comment.created_at,
    location_id: comment.location_id,
    user_id: comment.user_id,
    text: comment.content, // Use 'content'
    username: comment.profiles?.username || "Anonymous",
    heartCount: likesMap[comment.id] || 0,
});

const PlaceDetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState<LocationDetails | null>(null);
    const [carasolImages, setCarasolImages] = useState<string[]>([]);
    const { username, user } = useAppSelector((state) => state.auth);

    // ✅ New state for place loading
    const [loadingPlace, setLoadingPlace] = useState<boolean>(true);

    const [comments, setComments] = useState<AppComment[]>([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [loadingComments, setLoadingComments] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalComments, setTotalComments] = useState<number>(0);

    const [userHeartedComments, setUserHeartedComments] = useState<
        Record<number, boolean>
    >({});

    // 1. Fetches main location details (Updated to handle loading)
    useEffect(() => {
        const fetchLocationDetails = async (placeId: number) => {
            setLoadingPlace(true); // START loading indicator
            try {
                const data = await locationService.getLocationById(placeId);
                setPlace(data);
            } catch (error) {
                console.error("Error fetching location details:", error);
                setPlace(null); // Set to null if fetch fails
            } finally {
                setLoadingPlace(false); // STOP loading indicator
            }
        };

        if (id) {
            const placeId = parseInt(id, 10);
            fetchLocationDetails(placeId);
        }
    }, [id]);

    // 2. Fetches paginated comments and their likes
    useEffect(() => {
        if (!id || loadingPlace || !place) return;

        const placeId = parseInt(id, 10);

        const fetchCommentsAndLikes = async () => {
            setLoadingComments(true);
            setComments([]);
            setCurrentPage(1);
            setUserHeartedComments({});

            try {
                // 1. Fetch comments (Page 1)
                const { data: commentsData, count: totalCount } =
                    await commentService.getComments(placeId, 1);

                setTotalComments(totalCount || 0);

                if (!commentsData || commentsData.length === 0) {
                    setComments([]);
                    setLoadingComments(false);
                    return;
                }

                const commentIds = commentsData.map((c) => c.id);

                // 2. Fetch like counts
                const countsData = await commentService.getLikeCounts(
                    commentIds
                );

                // 3. Fetch user's specific likes
                const currentUserId = user?.id;
                const userLikesData = await commentService.getUserLikes(
                    commentIds,
                    currentUserId || ""
                );

                // 4. Map the data
                const likesMap: Record<number, number> = {};
                const userLikesRecord: Record<number, boolean> = {};

                if (countsData) {
                    for (const countItem of countsData as {
                        comment_id: number;
                        like_count: number;
                    }[]) {
                        likesMap[countItem.comment_id] = countItem.like_count;
                    }
                }
                if (userLikesData) {
                    for (const userLike of userLikesData as {
                        comment_id: number;
                    }[]) {
                        userLikesRecord[userLike.comment_id] = true;
                    }
                }

                // 5. Combine comments and like data
                const processedComments: AppComment[] = commentsData.map(
                    (comment) =>
                        mapDbToAppComment(comment as DbComment, likesMap)
                );

                setComments(processedComments);
                setUserHeartedComments(userLikesRecord);
            } catch (error) {
                console.error("Error fetching comments/likes:", error);
            } finally {
                setLoadingComments(false);
            }
        };

        fetchCommentsAndLikes();
    }, [id, user, loadingPlace, place]); // Added loadingPlace and place dependencies

    // Toggles a like on a comment (No change)
    const handleToggleHeart = async (commentId: number) => {
        if (!user) {
            alert("You must be logged in to react to a comment.");
            return;
        }

        const isCurrentlyHearted = userHeartedComments[commentId];
        const currentUserId = user.id;

        // Optimistic UI update
        setUserHeartedComments((prev) => ({
            ...prev,
            [commentId]: !isCurrentlyHearted,
        }));
        setComments((prevComments) =>
            prevComments.map((comment) => {
                if (comment.id === commentId) {
                    const newCount = isCurrentlyHearted
                        ? comment.heartCount - 1
                        : comment.heartCount + 1;
                    return {
                        ...comment,
                        heartCount: newCount < 0 ? 0 : newCount,
                    };
                }
                return comment;
            })
        );

        // Call service
        try {
            if (isCurrentlyHearted) {
                await commentService.removeLike(commentId, currentUserId);
            } else {
                await commentService.addLike(commentId, currentUserId);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert optimistic update on error
            setUserHeartedComments((prev) => ({
                ...prev,
                [commentId]: isCurrentlyHearted,
            }));
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === commentId) {
                        const newCount = isCurrentlyHearted
                            ? comment.heartCount + 1
                            : comment.heartCount - 1;
                        return {
                            ...comment,
                            heartCount: newCount < 0 ? 0 : newCount,
                        };
                    }
                    return comment;
                })
            );
        }
    };

    // Adds a new comment (No change)
    const handleAddComment = async () => {
        if (!newCommentText.trim() || !user || !place) {
            if (!user) alert("You must be logged in to post a comment.");
            else alert("Comment cannot be empty.");
            return;
        }

        try {
            // Call service with (locationId, userId, content)
            const newCommentData = await commentService.addComment(
                place.id,
                user.id as any, // Pass user.id (string)
                newCommentText.trim()
            );

            if (!newCommentData) {
                throw new Error("No data returned from addComment");
            }

            // Manually create the AppComment
            const newAppComment: AppComment = {
                id: newCommentData.id,
                created_at: newCommentData.created_at,
                location_id: newCommentData.location_id,
                user_id: newCommentData.user_id,
                text: newCommentData.content,
                username: username || "User", // Use username from Redux
                heartCount: 0,
            };

            setComments((prevComments) => [newAppComment, ...prevComments]);
            setTotalComments((prev) => prev + 1);
            setNewCommentText("");
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment.");
        }
    };

    // Fetches the next page of comments (No change)
    const handleFetchMoreComments = async () => {
        if (!id) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        const placeId = parseInt(id, 10);

        try {
            // 1. Fetch next page of comments
            const { data: commentsData } = await commentService.getComments(
                placeId,
                nextPage
            );

            if (!commentsData || commentsData.length === 0) {
                setLoadingMore(false);
                return;
            }

            // 2. Fetch likes for *new* comments
            const commentIds = commentsData.map((c) => c.id);
            const countsData = await commentService.getLikeCounts(commentIds);

            const currentUserId = user?.id;
            const userLikesData = await commentService.getUserLikes(
                commentIds,
                currentUserId || ""
            );

            // 3. Map the new data
            const likesMap: Record<number, number> = {};
            const newUserLikesRecord: Record<number, boolean> = {};

            if (countsData) {
                for (const countItem of countsData as {
                    comment_id: number;
                    like_count: number;
                }[]) {
                    likesMap[countItem.comment_id] = countItem.like_count;
                }
            }
            if (userLikesData) {
                for (const userLike of userLikesData as {
                    comment_id: number;
                }[]) {
                    newUserLikesRecord[userLike.comment_id] = true;
                }
            }

            // 4. Combine and append
            const processedNewComments: AppComment[] = commentsData.map(
                (comment) => mapDbToAppComment(comment as DbComment, likesMap)
            );

            setComments((prev) => [...prev, ...processedNewComments]);
            setUserHeartedComments((prev) => ({
                ...prev,
                ...newUserLikesRecord,
            }));
            setCurrentPage(nextPage);
        } catch (error) {
            console.error("Error fetching more comments:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Populates the carousel (No change)
    useEffect(() => {
        if (place) {
            const allImages: string[] = [];
            place.attractions_list.forEach((attraction) => {
                attraction.screenshots.forEach((imageUrl) => {
                    allImages.push(imageUrl);
                });
            });
            setCarasolImages(allImages);
        }
    }, [place, id]);

    // ** Conditional Rendering for Loading State (Gol-Gol Ghumne Wala) **
    if (loadingPlace) {
        return (
            <div className="bg-brand-light min-h-screen">
                <Navbar />
                <div className="text-center p-10 flex flex-col justify-center items-center h-[calc(100vh-80px)]">
                    {/* Gol-Gol Ghumne Wala Spinner */}
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
                    <p className="mt-4 text-2xl text-brand-primary font-medium">
                        Loading place details...
                    </p>
                </div>
            </div>
        );
    }

    // Conditional Rendering for Not Found State (Only if loading is false AND place is null)
    if (!place) {
        return (
            <div className="bg-brand-light min-h-screen">
                <Navbar />
                <div className="text-center p-10 text-2xl text-red-500">
                    Place not found!
                </div>
            </div>
        );
    }

    // Normal rendering once place data is loaded and available
    return (
		<div
			className="min-h-screen flex flex-col relative bg-cover bg-center"
			style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
		>
			<div className="absolute inset-0 bg-black opacity-70 z-0"></div>
			<div className="relative z-10 flex-grow flex flex-col">
				<Navbar />

				<div className="relative max-h-[500px]">
					<Carousel className="w-full">
						<CarouselContent>
							{carasolImages.map((imageUrl, index) => (
								<CarouselItem key={index}>
									<div className="relative w-full h-[500px] overflow-hidden bg-gray-100">
										{/* 1. Background Image (Blurred Fill) */}
										<img
											src={imageUrl}
											alt=""
											aria-hidden="true"
											className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-90"
										/>

										{/* 2. Foreground Image (Sharp & Uncropped) */}
										<img
											src={imageUrl}
											alt={`Slide ${index + 1}`}
											className="relative rounded-2xl z-10 w-full h-full object-contain"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="absolute left-4" />
						<CarouselNext className="absolute right-4" />
					</Carousel>
					<h1 className="top-5 left-5 text-4xl z-10 text-white bg-gray-600/50 p-3 rounded-lg transition-opacity duration-500 absolute">
						{place.name}
					</h1>
				</div>

				<div className="p-5 max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg my-8">
					<p className="text-xl text-gray-700 my-5">
						{place.about_description}
					</p>
				</div>

				<div className="p-5 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg my-8">
					<div className="grid grid-cols-3 w-full">
						{place.attractions_list.map((attraction, index) => {
							return (
								<AttractionCard
									key={index}
									imageUrl={attraction.screenshots[0]}
									name={attraction.name}
									description={attraction.desc}
								/>
							);
						})}
					</div>
				</div>

				<div className="max-w-4xl mx-auto w-full">
					{/* Location Tab */}
					<div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
						<h2 className="text-2xl font-semibold mb-3 text-gray-800">
							Location
						</h2>
						{place.latitude && place.longitude ? (
							<MapDisplay
								lat={place.latitude}
								lon={place.longitude}
								placeName={place.name}
							/>
						) : (
							<div className="w-full h-64 bg-gray-200 flex justify-center items-center text-gray-500 text-xl rounded-lg">
								<MapPinned size={30} className="mr-2" />
								<p>
									Map data is not available for this location.
								</p>
							</div>
						)}
					</div>

					{/* Comments Section */}
					<div className="my-8 p-5 bg-white/80 backdrop-blur-sm rounded-lg shadow-md shadow-brand-secondary/30">
						<h2 className="text-2xl font-semibold mb-3 text-gray-800">
							Comments
						</h2>

						{/* Comment Input Section */}
						{user ? (
							<div className="mt-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm">
								<h3 className="text-lg font-medium text-gray-700 mb-2">
									Post a Comment
								</h3>
								<textarea
									value={newCommentText}
									onChange={(e) =>
										setNewCommentText(e.target.value)
									}
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
								<Link
									to="/login"
									className="font-medium text-brand-secondary hover:text-brand-primary transition duration-150"
								>
									Log in
								</Link>{" "}
								to post a comment.
							</p>
						)}

						{/* Display Existing Comments */}
						<div className="mt-6">
							{loadingComments ? (
								<p className="text-center text-gray-500 p-4">
									Loading comments...
								</p>
							) : comments.length === 0 ? (
								<p className="text-center text-gray-500 p-4">
									No comments yet. Be the first to share your
									story!
								</p>
							) : (
								comments.map((comment) => {
									const isHearted =
										userHeartedComments[comment.id];

									return (
										<div
											key={comment.id}
											className="mb-4 p-3 bg-gray-50/80 border border-gray-200 rounded-lg shadow-sm"
										>
											<h3 className="text-lg font-medium text-gray-700">
												{comment.username}
											</h3>
											<span className="text-xs text-gray-500">
												{new Date(
													comment.created_at
												).toLocaleString()}
											</span>
											{/* Use comment.content */}
											<p className="mt-1 text-gray-600">
												{comment.text}
											</p>
											<div className="flex items-center space-x-4 mt-2">
												<button
													onClick={() =>
														handleToggleHeart(
															comment.id
														)
													}
													className={`flex items-center transition duration-150 ${
														isHearted
															? "text-red-500"
															: "text-gray-500 hover:text-red-400"
													}`}
													aria-label="Heart comment"
												>
													{isHearted ? (
														<Heart
															fill="#ef4444"
															className="h-5 w-5 mr-1"
														/>
													) : (
														<Heart className="h-5 w-5 mr-1" />
													)}
													<span className="text-sm font-medium text-gray-700">
														{comment.heartCount}
													</span>
												</button>
											</div>
										</div>
									);
								})
							)}

							{/* "Show More" Button */}
							{!loadingComments &&
								!loadingMore &&
								comments.length < totalComments && (
									<div className="text-center mt-6">
										<button
											onClick={handleFetchMoreComments}
											className="py-2 px-5 text-brand-secondary font-medium bg-gray-200 border-none rounded-md cursor-pointer transition duration-300 hover:bg-gray-300"
										>
											Show More Comments (
											{comments.length} / {totalComments})
										</button>
									</div>
								)}

							{loadingMore && (
								<p className="text-center text-gray-500 p-4">
									Loading more...
								</p>
							)}
						</div>
					</div>
				</div>

				<Footer />
				<Chatbot />

				{place.latitude && place.longitude && (
					<WeatherWidget
						lat={place.latitude}
						lon={place.longitude}
						placeName={place.name}
					/>
				)}
			</div>
		</div>
	);
};

export default PlaceDetailsPage;