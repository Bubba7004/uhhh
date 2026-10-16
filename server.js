const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: Missing "url" query parameter.');
    }

    try {
        // Native global fetch built into Node.js
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        const body = await response.text();
        res.send(body);
    } catch (err) {
        res.status(500).send(`Proxy error: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
