class ConversationLog {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
        this.supabase = supabase;
    }
    async addEntry({ entry, speaker }) {
        const { error } = await this.supabase.from("conversations").insert({
            entry,
            speaker
        });
        if (error) {
            throw new Error(error.message);
        }
    }
    async getConversation({ limit }) {
        const { data: history, error } = await this.supabase.from("conversations")
            .select("*")
            .limit(limit);
        if (error) {
            throw new Error(error.message);
        }
        if (history) {
            return history.map((entry) => {
                return `${entry.speaker.toUpperCase()}: ${entry.entry}`;
            }).reverse();
        }
        console.log("No conversation history");
    }
    async clearConversation(userId) {
        await this.supabase.from("conversations").delete().eq("user_id", userId);
    }
}
export { ConversationLog };
