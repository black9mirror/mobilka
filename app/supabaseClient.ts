import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gyxcmonztjolowohiowa.supabase.co";
const SUPABASE_KEY = "sb_publishable_cDYOlpV0ItpmWyE6RttIEA_9Y_VSygI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
