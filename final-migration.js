import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const DB_PATH = path.join(__dirname, 'db.json');

async function run() {
    console.log('Migrating data...');
    try {
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        const { initiatives, lastUpdated } = JSON.parse(rawData);

        const normalizedInitiatives = initiatives.map(init => ({
            id: init.id,
            title: init.title,
            shortDescription: init.shortDescription,
            fullDescription: init.fullDescription,
            budget: init.budget,
            timeline: init.timeline,
            priority: init.priority,
            category: init.category,
            icon: init.icon,
            imageUrl: init.imageUrl
        }));

        // TEST: check connectivity first
        const { error: checkError } = await supabase.from('initiatives').select('count');
        if (checkError) {
            console.error('Check error:', checkError);
            return;
        }
        console.log('Connectivity check passed.');

        console.log(`Inserting ${normalizedInitiatives.length} initiatives...`);
        const { error: insError } = await supabase.from('initiatives').insert(normalizedInitiatives);
        if (insError) {
            console.error('Migration error (initiatives):', insError);
            return;
        }

        console.log('Updating settings...');
        const { error: settError } = await supabase.from('settings').upsert({ key: 'lastUpdated', value: lastUpdated });
        if (settError) {
            console.error('Migration error (settings):', settError);
            return;
        }

        console.log('✅ Migration COMPLETED successfully.');
    } catch (err) {
        console.error('Migration crashed:', err);
    }
}

run();
