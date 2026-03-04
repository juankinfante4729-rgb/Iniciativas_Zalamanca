import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing simple insert...');
    const { error } = await supabase.from('initiatives').insert([
        { id: 999, title: 'Test persistence' }
    ]);
    if (error) {
        console.error('Insert error:', error);
    } else {
        console.log('Insert success!');
    }
}

test();
