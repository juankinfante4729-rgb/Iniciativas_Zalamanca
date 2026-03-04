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

async function migrate() {
    console.log('--- Iniciando Migración a Supabase (UPSERT) ---');

    try {
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        const { initiatives, lastUpdated } = JSON.parse(rawData);

        console.log(`Leídas ${initiatives.length} iniciativas de db.json`);

        // 1. Limpiar el registro de prueba si existe
        await supabase.from('initiatives').delete().eq('id', 999);

        // 2. Usar upsert para insertar o actualizar todos
        console.log('Subiendo iniciativas...');
        const { error: insError } = await supabase
            .from('initiatives')
            .upsert(initiatives);

        if (insError) {
            console.error('Error detallado al subir iniciativas:', JSON.stringify(insError, null, 2));
            return;
        }
        console.log('✅ Iniciativas subidas con éxito');

        // 3. Actualizar fecha en settings
        const { error: settsError } = await supabase
            .from('settings')
            .upsert({ key: 'lastUpdated', value: lastUpdated });

        if (settsError) {
            console.error('Error al actualizar settings:', settsError);
            return;
        }
        console.log('✅ Fecha de actualización migrada');

        console.log('--- Migración Completada con Éxito ---');
    } catch (err) {
        console.error('Error fatal en la migración:', err);
    }
}

migrate();
