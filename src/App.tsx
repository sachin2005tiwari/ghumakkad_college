import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PlaceDetailsPage from "./pages/placeDetailsPage";
import LoginPage from "./pages/Loginpage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { supabase } from "./services/supabaseClient";
import { setUser } from "./store/authSlice";
import { useAppDispatch } from "./store/hook";

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		// Check for an existing session on app load
		supabase.auth.getSession().then(({ data: { session } }) => {
			dispatch(setUser({ session, user: session?.user ?? null }));
		});

		// Listen for auth state changes (login, logout)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			dispatch(
				setUser({
					session,
					user: session?.user ?? null,
					username: session?.user.user_metadata.display_name ?? null,
				})
			);
		});

		return () => subscription.unsubscribe();
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				{/* Landing Page is now the Home page */}
				<Route path="/" element={<LandingPage />} />
				<Route path="/place/:name" element={<PlaceDetailsPage />} />

				{/* New Pages */}

				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />

				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		</Router>
	);
};

export default App;
