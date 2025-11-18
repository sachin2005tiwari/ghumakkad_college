import { supabase } from "./supabaseClient";

export const COMMENT_PAGE_LIMIT = 10;

class CommentService {
	async getComments(locationId: number, page: number = 1) {
		const from = (page - 1) * COMMENT_PAGE_LIMIT;
		const to = page * COMMENT_PAGE_LIMIT - 1;
		try {
			const { data, error, count } = await supabase
				.from("comments")
				.select("*, profiles(username)", {count: "exact"})
				.eq("location_id", locationId)
				.order("created_at", { ascending: false })
				.range(from, to);
			if (error) throw error;
			return {data, count};
		} catch (error) {
			console.error("Error fetching comments:", error);
			throw error;
		}
	}
	async getCommentsByUserId(userId: string) {
		try {
			// 'comments' से सभी कॉलम, साथ ही स्थान का नाम और ID लाएँ।
			const { data, error } = await supabase
				.from("comments")
				.select("*, profiles(username), locations(name, id)") 
				.eq("user_id", userId)
				.order("created_at", { ascending: false });
			
			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error fetching user comments:", error);
			throw error;
		}
	}

	async getLikeCounts(commentIds: number[]) {
		try {
			if (commentIds.length === 0) {
				return { data: [], error: null };
			}
			const { data, error } = await supabase.rpc(
				"get_like_counts_for_comments",
				{
					comment_ids: commentIds,
				}
			);
			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error fetching comments:", error);
			throw error;
		}
	}

	async getUserLikes(commentIds: number[], userId: string) {
		if (commentIds.length === 0 || !userId) {
			return { data: [], error: null };
		}
		try {
			const { data, error } = await supabase
				.from("likes")
				.select("comment_id") // We only need to know *which* comment
				.in("comment_id", commentIds)
				.eq("user_id", userId);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error fetching user likes:", error);
			throw error;
		}
	}

	async addComment(locationId: number, userId: number, text: string) {
		try {
			const { data, error } = await supabase
				.from("comments")
				.insert([
					{ location_id: locationId, user_id: userId, content: text },
				])
				.select()
				.single();
			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error adding comment:", error);
			throw error;
		}
	}

    async addLike(commentId: number, userId: string){
        try{
            const { data, error } = await supabase
                .from("likes")
                .insert([
                    { comment_id: commentId, user_id: userId },
                ])
                .select()
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error adding like:", error);
            throw error;
        }
    }

    async removeLike(commentId: number, userId: string){
        try{
            const { data, error } = await supabase
                .from("likes")
                .delete()
                .eq("comment_id", commentId)
                .eq("user_id", userId);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error removing like:", error);
            throw error;
        }
    }
}

const commentService = new CommentService();
export default commentService;
