import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabaseClient";
const STATIC_BACKGROUND = "photo/background.jpg";

const RegisterPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [fullName, setFullName] = useState("");
	const [success, setSuccess] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				// You can store additional metadata like the full name
				data: {
					display_name: fullName,
				},
			},
		});

		if (error) {
			setError(error.message);
		} else if (data.user) {
			// Check if user needs email confirmation
			if (data.user.identities?.length === 0) {
				setError("This user already exists.");
			} else {
				setSuccess(
					"Success! Please check your email to confirm your registration."
				);
        navigate('/login')
			}
		}
		setLoading(false);
	};

	return (
		<div
			className="min-h-screen flex flex-col bg-cover bg-center relative"
			style={{ backgroundImage: `url(${STATIC_BACKGROUND})` }}
		>
			{/* Background Overlay */}
			<div className="absolute inset-0 bg-black opacity-70 z-0"></div>

			<div className="relative z-10">
				<Navbar />
			</div>

			{/* Content Wrapper */}
			<div className="flex items-center justify-center p-8 flex-grow relative z-10">
				<div className="w-full max-w-md p-8 space-y-6 bg-[rgba(255,255,255,0.8)] shadow-xl rounded-lg border-t-4 ">
					<h2 className="text-3xl font-bold text-center text-gray-800">
						Join Ghumakkad!
					</h2>
					<p className="text-center text-gray-500">
						Register now to start your travel blog.
					</p>

					<form className="space-y-4" onSubmit={handleRegister}>
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
								placeholder="Your Full Name"
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
              disabled={loading}
						>
							{loading ? 'Registering...' : 'Register'}
						</button>
            {error && <p className="text-center text-red-500 text-sm">{error}</p>}
						<Link
							to="/"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						>
							Back to Home
						</Link>
					</form>

					<div className="text-center text-sm">
						<p className="text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-brand-secondary hover:text-brand-primary transition duration-150"
							>
								Log in here.
							</Link>
						</p>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default RegisterPage;
