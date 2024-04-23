import { SupabaseClient } from "@supabase/supabase-js";

class ConversationLog {
  constructor(
    public supabase: SupabaseClient,
  ) {
    this.supabase = supabase;
  }

  public async addEntry(
    { entry, speaker, userId }: {
      entry: string;
      speaker: string;
      userId: string;
    },
  ) {
    const { data, error } = await this.supabase.from("conversations").insert({
      entry,
      speaker,
      user_id: userId,
    });

    if (error) {
      console.error(`Error adding entry for userId ${userId}:`, error.message); // Log error with userId
      throw new Error(error.message);
    }
  }

  public async getConversation(
    { limit, userId }: {
      limit: number;
      userId?: string;
    },
  ): Promise<string[] | String | void> {
    let query = this.supabase.from("conversations")
      .select("*")
      .order('created_at', { ascending: false }) // Order by 'created_at' in descending order
      .limit(limit);
  
    if (userId) {
      query = query.eq('user_id', userId); // Filter by userId if it's provided
    }
  
    const { data: history, error } = await query;
  
    if (error) {
      console.error(`Error fetching conversation for userId ${userId}:`, error.message); // Log error with userId
      throw new Error(error.message);
    } else if (history) {
      return history.map((entry) => `${entry.speaker.toUpperCase()}: ${entry.entry}`).reverse();
    } else {
      console.log("No conversation history found for userId:", userId); // Log when no history is found
    }
  }

  public async clearConversation(userId: string) {
    const { error } = await this.supabase.from("conversations").delete().eq(
      "user_id",
      userId,
    );

    if (error) {
      console.error(`Error clearing conversation for userId ${userId}:`, error.message); // Log error with userId
      throw new Error(error.message);
    }
  }
}

export { ConversationLog };
