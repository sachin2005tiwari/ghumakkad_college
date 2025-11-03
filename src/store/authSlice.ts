import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Session } from "@supabase/supabase-js";

// Define a type for your user profile if you have one (optional)
// For now, we just use the Supabase User object
interface AuthState {
	session: Session | null;
	user: User | null;
	username: string | null;
	loading: boolean;
}

const initialState: AuthState = {
	session: null,
	user: null,
	username: null,
	loading: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Action to set the user and session (on login/app load)
		setUser: (
			state,
			action: PayloadAction<{
				session: Session | null;
				user: User | null;
                username?: string | null;
			}>
		) => {
			state.session = action.payload.session;
			state.user = action.payload.user;
            state.username = action.payload.username ?? null;
		},
		setProfileUsername: (state, action: PayloadAction<string | null>) => {
			state.username = action.payload;
		},
		// Action to clear the user and session (on logout)
		clearUser: (state) => {
			state.session = null;
			state.user = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
	},
});

export const { setUser, clearUser, setLoading, setProfileUsername } = authSlice.actions;
export default authSlice.reducer;
