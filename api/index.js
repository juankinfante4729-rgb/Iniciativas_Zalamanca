import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// db.json should be at the root, so it is at ../db.json relative to api/index.js
const DB_PATH = path.join(__dirname, '..', 'db.json');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the build directory (for local usage)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return null;
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return null;
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        // NOTE: This will fail on Vercel production due to read-only filesystem
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing DB:', error);
        return false;
    }
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.get('/api/initiatives', (req, res) => {
    try {
        const data = readDB();
        if (!data) {
            return res.status(500).json({ error: 'Failed to read database file' });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/initiatives', (req, res) => {
    const { initiatives, lastUpdated } = req.body;
    if (!initiatives) {
        return res.status(400).json({ error: 'Missing initiatives data' });
    }

    const success = writeDB({ initiatives, lastUpdated });
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to save data. On Vercel, use a real database for persistence.' });
    }
});

// For local development fallback
app.use((req, res, next) => {
    const distPath = path.join(__dirname, '..', 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
        res.sendFile(distPath);
    } else {
        next();
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}

export default app;
