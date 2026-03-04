import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.get('/api/initiatives', async (req, res) => {
    try {
        // Obtener iniciativas (mapeamos de minúsculas de DB a camelCase de Frontend)
        const { data, error: initError } = await supabase
            .from('initiatives')
            .select('id, title, shortDescription:shortdescription, fullDescription:fulldescription, budget, timeline, priority, category, icon, imageUrl:imageurl')
            .order('id', { ascending: true });

        if (initError) throw initError;

        // Limpieza extra por si el alias falla en algún driver
        const initiatives = data.map(i => ({
            id: i.id,
            title: i.title,
            shortDescription: i.shortdescription || i.shortDescription,
            fullDescription: i.fulldescription || i.fullDescription,
            budget: i.budget,
            timeline: i.timeline,
            priority: i.priority,
            category: i.category,
            icon: i.icon,
            imageUrl: i.imageurl || i.imageUrl
        }));

        // Obtener lastUpdated
        const { data: setts, error: settsError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'lastUpdated')
            .single();

        res.json({
            initiatives: initiatives || [],
            lastUpdated: setts?.value || 'Enero 2026'
        });
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/initiatives', async (req, res) => {
    const { initiatives, lastUpdated } = req.body;
    if (!initiatives) {
        return res.status(400).json({ error: 'Missing initiatives data' });
    }

    try {
        // Mapeamos de camelCase de Frontend a minúsculas de DB para guardar
        const dbInitiatives = initiatives.map(i => ({
            id: i.id,
            title: i.title,
            shortdescription: i.shortDescription,
            fulldescription: i.fullDescription,
            budget: i.budget,
            timeline: i.timeline,
            priority: i.priority,
            category: i.category,
            icon: i.icon,
            imageurl: i.imageUrl
        }));

        const { error: deleteError } = await supabase
            .from('initiatives')
            .delete()
            .neq('id', 0); // Borra todo

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('initiatives')
            .insert(dbInitiatives);

        if (insertError) throw insertError;

        // Actualizar lastUpdated
        await supabase
            .from('settings')
            .upsert({ key: 'lastUpdated', value: lastUpdated });

        res.json({ success: true });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}

export default app;
