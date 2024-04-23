import { createClient } from "@supabase/supabase-js";
export const supabaseClient = async (supabaseAccessToken) => {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    });
    return supabase;
};
