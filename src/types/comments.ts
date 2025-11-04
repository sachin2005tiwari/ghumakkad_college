export interface DbComment {
    id: number;
    created_at: string;
    content: string;
    location_id: number;
    user_id: string;
    profiles: {
		username: string;
	} | null;
}

export interface DbLike {
    id: number;
    created_at: string;
    location_id: number;
    user_id: string;
    comment_id: number;
}

export interface AppComment {
    id: number;
	created_at: string;
	location_id: number;
	user_id: string;
	text: string;
	username: string; // Flattened from 'profiles.username'
	heartCount: number; // Added from the RPC
}