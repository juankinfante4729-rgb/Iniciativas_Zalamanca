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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Body keys:', Object.keys(req.body));
        if (req.body.initiative) console.log('Initiative ID in body:', req.body.initiative.id);
    }
    next();
});

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.get('/api/initiatives', async (req, res) => {
    try {
        // Obtener iniciativas (mapeamos de minúsculas de DB a camelCase de Frontend)
        const { data, error: initError } = await supabase
            .from('initiatives')
            .select('id, title, shortDescription:shortdescription, fullDescription:fulldescription, budget, timeline, priority, category, icon, imageUrl:imageurl, subInitiatives:sub_initiatives, responsable')
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
            imageUrl: i.imageurl || i.imageUrl,
            subInitiatives: i.subInitiatives || i.sub_initiatives || [],
            responsable: i.responsable || 'Administración'
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

app.post('/api/initiatives/:id', async (req, res) => {
    const { initiative, lastUpdated } = req.body;
    if (!initiative) {
        return res.status(400).json({ error: 'Missing initiative data' });
    }

    try {
        const dbInitiative = {
            id: initiative.id,
            title: initiative.title,
            shortdescription: initiative.shortDescription,
            fulldescription: initiative.fullDescription,
            budget: initiative.budget,
            timeline: initiative.timeline,
            priority: initiative.priority,
            category: initiative.category,
            icon: initiative.icon,
            imageurl: initiative.imageUrl,
            sub_initiatives: initiative.subInitiatives || [],
            responsable: initiative.responsable || 'Administración'
        };

        const { error: upsertError } = await supabase
            .from('initiatives')
            .upsert(dbInitiative);

        if (upsertError) throw upsertError;

        if (lastUpdated) {
            await supabase
                .from('settings')
                .upsert({ key: 'lastUpdated', value: lastUpdated });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/initiatives/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { lastUpdated } = req.body;
        
        const { error } = await supabase.from('initiatives').delete().eq('id', id);
        if (error) throw error;

        if (lastUpdated) {
            await supabase.from('settings').upsert({ key: 'lastUpdated', value: lastUpdated });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}

export default app;
