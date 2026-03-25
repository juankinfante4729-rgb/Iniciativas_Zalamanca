import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLock() {
    console.log("Upserting record 18...");
    // Let's just fetch it first to be safe
    const res = await supabase.from('initiatives').select('*').eq('id', 18).single();
    if (!res.data) {
        console.log("No record 18 found");
        return;
    }

    let start = Date.now();
    const upsertRes = await supabase.from('initiatives').upsert(res.data);
    console.log(`Upsert 18 took ${Date.now() - start}ms`, upsertRes.error || 'success');
}

testLock();
