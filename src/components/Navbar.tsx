import { Link } from "react-router-dom";
import React from "react";
import { supabase } from "../services/supabaseClient";
import { useAppSelector } from "../store/hook";

// Using your specified logo path
const logoPath = "/photo/logo.png";

const Navbar: React.FC = () => {
	const { user, username } = useAppSelector((state) => state.auth);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Error logging out:", error);
		// The onAuthStateChange listener in App.tsx will handle dispatching clearUser
	};

	return (
		// Default to flex-col (stacked) on mobile, switch to flex-row (horizontal) on large screens (lg)
		<header className="flex flex-col lg:flex-row justify-between items-center px-4 py-3 lg:px-8 bg-brand-light shadow-md">
			{/* 1. Logo, Title, and Mobile Login Button Group */}
			<div className="flex justify-between items-center w-full lg:w-auto mb-2 lg:mb-0">
				{/* Logo and Ghumakkad Title Sub-Group */}
				<div className="flex items-center">
					<Link to="/" className="flex items-center">
						{/* Logo size is slightly reduced for mobile responsiveness */}
						<img
							src={logoPath}
							alt="Travel Blog Logo"
							className="h-[50px] lg:h-[70px] w-auto mr-2 rounded-[40px]"
						/>
					</Link>
					<p className="text-brand-secondary text-2xl lg:text-3xl font-bold">
						Ghumakkad
					</p>
				</div>

				{/* User Signup/Login Section - Visible ONLY on small screens */}
				<div className="user-signup lg:hidden">
					{user ? (
						// ⬇️ 2. ADD WELCOME MESSAGE ⬇️
						<div className="flex items-center gap-2">
							<span className="text-sm text-brand-secondary font-medium">
								Hi, {username}
							</span>
							<button
								onClick={handleLogout}
								className="text-white bg-brand-primary py-1.5 px-3 text-sm rounded-[40px] transition duration-300 hover:bg-brand-secondary"
							>
								Logout
							</button>
						</div>
					) : (
						<Link
							to="/login"
							className="text-white bg-brand-primary py-1.5 px-3 text-sm rounded-[40px] transition duration-300 hover:bg-brand-secondary"
						>
							Login
						</Link>
					)}
				</div>
			</div>

			{/* ⬇️ SEARCH BAR SECTION: Now includes the icon ⬇️ */}
			<div className="w-full lg:flex-1 flex justify-center mt-2 lg:mt-0">
				{/* Relative container holds the input and the absolute icon */}
				<div className="relative w-full max-w-full lg:max-w-[500px] lg:ml-[250px]">
					<input
						type="text"
						placeholder="Search destinations..."
						// CRUCIAL FIX: Added padding-left (pl-10) to make space for the icon
						className="w-full p-2.5 pl-10 text-base rounded-[40px] border border-brand-secondary"
					/>

					{/* Search Icon (SVG) - Absolute positioning inside the relative wrapper */}
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
			</div>
			{/* ⬆️ END SEARCH BAR SECTION ⬆️ */}

			{/* User Signup/Login Section - Visible ONLY on large screens */}
			<div className="user-signup hidden lg:block">
				{user ? (
					// ⬇️ 2. ADD WELCOME MESSAGE ⬇️
					<div className="flex items-center gap-2">
						<span className="text-sm text-brand-secondary font-medium">
							Hi, {username}
						</span>
						<button
							onClick={handleLogout}
							className="text-white bg-brand-primary py-1.5 px-3 text-sm rounded-[40px] transition duration-300 hover:bg-brand-secondary"
						>
							Logout
						</button>
					</div>
				) : (
					<Link
						to="/login"
						className="text-white bg-brand-primary py-1.5 px-3 text-sm rounded-[40px] transition duration-300 hover:bg-brand-secondary"
					>
						Login
					</Link>
				)}
			</div>
		</header>
	);
};

export default Navbar;
