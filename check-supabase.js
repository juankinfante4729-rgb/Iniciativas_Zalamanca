import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking tables...');
    const { data, error } = await supabase.from('initiatives').select('count');
    if (error) {
        console.error('Error querying initiatives:', error);
    } else {
        console.log('Success querying initiatives:', data);
    }
}

check();
