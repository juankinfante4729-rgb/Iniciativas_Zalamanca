import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect18() {
    const res = await supabase.from('initiatives').select('imageurl, sub_initiatives').eq('id', 18).single();
    if (res.data) {
        const iSize = res.data.imageurl ? res.data.imageurl.length : 0;
        const sSize = res.data.sub_initiatives ? JSON.stringify(res.data.sub_initiatives).length : 0;
        console.log(`ID 18 - Image: ${iSize} chars, Sub_init: ${sSize} chars`);
    } else {
        console.log("Not found.");
    }
}

inspect18();
