import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the build directory (for IIS deployment)
app.use(express.static(path.join(__dirname, 'dist')));

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
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing DB:', error);
        return false;
    }
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), port: PORT, env: process.env.NODE_ENV });
});

app.get('/api/debug', (req, res) => {
    const dbExists = fs.existsSync(DB_PATH);
    const dbSize = dbExists ? fs.statSync(DB_PATH).size : 0;
    res.json({
        dbPath: DB_PATH,
        dbExists,
        dbSize,
        cwd: process.cwd(),
        dirname: __dirname,
        user: process.env.USERNAME || 'unknown'
    });
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
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
