import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking columns...');
    // Try upserting an initiative with sub_initiatives to see what error Supabase throws
    const { data, error } = await supabase.from('initiatives').upsert({
        id: 999,
        title: 'Test',
        sub_initiatives: '[{"test": true}]',
        responsable: 'Admin'
    });
    console.log('Upsert result:', { error });
}

checkSchema();
