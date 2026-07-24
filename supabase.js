import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://szguttgzmyoklmwgwtuy.supabase.co";

const supabaseKey = "sb_publishable_6qoQaFQTb7qdLg0MH8jo1w_81KVsw-E";

export const supabase = createClient(supabaseUrl, supabaseKey);