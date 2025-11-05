import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react"; 
import { supabase } from "../services/supabaseClient";
import { useAppDispatch, useAppSelector } from "../store/hook";
import locationService from "../services/locationServices";
import { LocationCard } from "../types/locations";
import { setLocations } from "../store/locationSlice";
import { User, LogOut, MessageSquare } from "lucide-react"; 

// Using your specified logo path
const logoPath = "/photo/logo.png";

interface NavbarProps {
	showSearchBar?: boolean;
}

const Navbar = (props: NavbarProps) => {
	const { showSearchBar = false } = props;
	const { user, username } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const [searchTerm, setSearchTerm] = React.useState("");
    
    // State to manage dropdown visibility
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

	useEffect(() => {
		// Set up a timer to delay the search execution.
		const timerId = setTimeout(() => {
			const searchedLocations = async (name: string) => {
				try {
					if (name.length > 0) {
						const data = (await locationService.searchLocationByName(
							name
						)) as LocationCard[];
						dispatch(setLocations(data));
					} else {
						const data =
							(await locationService.getLocations()) as LocationCard[];
						dispatch(setLocations(data));
					}
				} catch (error) {
					console.error("Error searching locations in useEffect:", error);
				}
			};

			searchedLocations(searchTerm);
		}, 500); // 500ms delay

		// Cleanup function: clear the timer if the user types again before it fires.
		return () => clearTimeout(timerId);
	}, [searchTerm]);

	const handleLogout = async () => {
        setIsDropdownOpen(false); // Close dropdown on logout
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Error logging out:", error);
		// The onAuthStateChange listener in App.tsx will handle dispatching clearUser
	};

	// Function to toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    }
    
    // Function to close the dropdown when a menu item is clicked
    const handleMenuItemClick = () => {
        setIsDropdownOpen(false);
    }

	return (
		// FIX: We use lg:justify-between to correctly space out items on large screens.
		<header className="flex flex-col lg:flex-row lg:justify-between items-center px-4 py-3 lg:px-8 bg-brand-light shadow-md sticky top-0 z-40">
			{/* 1. Logo and Title - Always on the left (w-auto on large screens for fixed width) */}
            {/* FIX: added lg:flex-shrink-0 to prevent the logo/title group from shrinking when the search bar expands. */}
			<div className="flex justify-between items-center w-full lg:w-auto mb-2 lg:mb-0 lg:flex-shrink-0">
				{/* Logo and Ghumakkad Title Sub-Group */}
				<div className="flex items-center">
					<Link to="/" className="flex items-center">
						{/* LOGO FIX: Increased size and changed rounded-[40px] to rounded-full for full circle visibility */}
						<img
							src={logoPath}
							alt="Travel Blog Logo"
							className="h-[60px] lg:h-[80px] w-auto mr-2 rounded-full"
						/>
					</Link>
					<p className="text-brand-secondary text-2xl lg:text-3xl font-bold whitespace-nowrap">
						Ghumakkad
					</p>
				</div>
                
                {/* ⬇️ Mobile Profile / Login Section - Visible on mobile, hidden on large screens ⬇️ */}
                {/* Mobile version uses w-full in parent div to push this to the right */}
                <div className="lg:hidden user-auth-section flex items-center">
                    {user ? (
                        // Mobile Dropdown 
                        <div className="relative">
                            <button 
                                onClick={toggleDropdown}
                                className="h-10 w-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-lg ring-2 ring-brand-secondary transition duration-150 hover:ring-brand-primary"
                                aria-label="Profile Menu"
                            >
                                {/* First letter of username */}
                                {username ? username[0].toUpperCase() : <User className="h-5 w-5" />}
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                                    
                                    {/* 1. Hi, Username (English) */}
                                    <div className="px-4 py-2 border-b border-gray-100 text-brand-secondary font-semibold text-sm">
                                        Hi, {username || 'Traveller'}
                                    </div>
                                    
                                    {/* 2. My Comments Link (English) */}
                                    {/* <Link 
                                        to="/my-comments"
                                        onClick={handleMenuItemClick}
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-100 text-sm"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        My Comments
                                    </Link> */}
                                    
                                    {/* 3. Logout Button (English) */}
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition duration-100 text-sm border-t border-gray-100"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-white bg-brand-primary pt-[10.8px] pb-[10.8px] px-3 text-sm rounded-[20px] transition duration-300 hover:bg-brand-secondary"
                        >
                            Login
                        </Link>
                    )}
                </div>
                {/* ⬆️ Mobile Profile / Login Section End ⬆️ */}
			</div>

			{/* ⬇️ Search Bar Section - Takes up the central available space ⬇️ */}
			{/* On large screens, this is given flex-grow to push logo left and profile right */}
			{showSearchBar && <div className="w-full lg:flex-grow flex justify-center mt-2 lg:mt-0 lg:mx-8">
				{/* The search bar content is restricted to a max width on large screens */}
				<div className="relative w-full max-w-full lg:max-w-[500px]">
					<input
						type="text"
						placeholder="Search destinations..."
						className="w-full p-2.5 pl-10 text-base rounded-[40px] border border-brand-secondary"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					{/* Search Icon (SVG) */}
					<svg
						className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>}
			{/* ⬆️ Search Bar Section End ⬆️ */}
            
            {/* ⬇️ Desktop Profile / Login Section - Pushed to the far right on large screens ⬇️ */}
            {/* FIX: added lg:flex-shrink-0 to prevent this group from shrinking. */}
            <div className="hidden lg:block user-auth-section flex items-center lg:flex-shrink-0"> 
                {user ? (
                    // ----------------- Logged In: Profile Dropdown -----------------
                    <div className="relative">
                        {/* Profile Circle Button */}
                        <button 
                            onClick={toggleDropdown}
                            className="h-10 w-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-lg ring-2 ring-brand-secondary transition duration-150 hover:ring-brand-primary"
                            aria-label="Profile Menu"
                        >
                            {/* First letter of username */}
                            {username ? username[0].toUpperCase() : <User className="h-5 w-5" />}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                                
                                {/* 1. Hi, Username (English) */}
                                <div className="px-4 py-2 border-b border-gray-100 text-brand-secondary font-semibold text-sm">
                                    Hi, {username || 'Traveller'}
                                </div>
                                
                                {/* 2. My Comments Link (English) */}
                                <Link 
                                    to="/my-comments"
                                    onClick={handleMenuItemClick}
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-100 text-sm"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    My Comments
                                </Link>
                                
                                {/* 3. Logout Button (English) */}
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition duration-100 text-sm border-t border-gray-100"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // ----------------- Logged Out: Login Button -----------------
                    <Link
                        to="/login"
                        className="text-white bg-brand-primary pt-[10.8px] pb-[10.8px] px-3 text-sm rounded-[20px] transition duration-300 hover:bg-brand-secondary"
                    >
                        Login
                    </Link>
                )}
            </div>
            {/* ⬆️ Desktop Profile / Login Section End ⬆️ */}
		</header>
	);
};

export default Navbar