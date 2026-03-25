import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xywgappruoeqrrqbolhb.supabase.co';
const supabaseKey = 'sb_publishable_jY7JSl09ou5doer3x7C-9Q_dBM_XzQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

async function fixHuge() {
    console.log("Fetching all initiatives...");
    const { data, error } = await supabase.from('initiatives').select('id, imageurl, sub_initiatives');
    if (error) { console.error(error); return; }

    let fixedCount = 0;
    for (const d of data) {
        let needsUpdate = false;
        let updateData = {};

        // Fix main image > 500KB
        if (d.imageurl && d.imageurl.length > 500000) {
            console.log(`ID ${d.id}: Main image is huge (${Math.round(d.imageurl.length/1024)}KB). Resetting to default.`);
            updateData.imageurl = DEFAULT_IMG;
            needsUpdate = true;
        }

        // Fix sub initiatives > 500KB
        if (d.sub_initiatives && Array.isArray(d.sub_initiatives)) {
            let subChanged = false;
            d.sub_initiatives.forEach(sub => {
                if (sub.imageUrl && sub.imageUrl.length > 500000) {
                    console.log(`ID ${d.id}: Sub initiative image is huge (${Math.round(sub.imageUrl.length/1024)}KB). Resetting to default.`);
                    sub.imageUrl = DEFAULT_IMG;
                    subChanged = true;
                }
            });
            if (subChanged) {
                updateData.sub_initiatives = d.sub_initiatives;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            await supabase.from('initiatives').update(updateData).eq('id', d.id);
            fixedCount++;
        }
    }
    console.log(`Done. Fixed ${fixedCount} records.`);
}

fixHuge();
