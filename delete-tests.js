import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteTests() {
    console.log("Deleting Test initiatives...");
    const { data, error } = await supabase.from('initiatives').delete().ilike('title', 'Test%');
    console.log("Result:", error ? error : "Success!");
}

deleteTests();
