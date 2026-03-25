import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
    console.log('Upserting settings...');
    const { data, error } = await supabase.from('settings').upsert({ key: 'test', value: 'testing' });
    console.log('Settings result:', error);
}

checkSettings();
