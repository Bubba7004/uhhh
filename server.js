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
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const contentType = response.headers.get('content-type') || '';
        res.setHeader('Content-Type', contentType);

        let body = await response.text();

        if (contentType.includes('text/html')) {
            const parsedUrl = new URL(targetUrl);
            const baseTag = `<base href="${parsedUrl.origin}/">`;
            
            if (body.includes('<head>')) {
                body = body.replace('<head>', `<head>\n${baseTag}`);
            } else if (body.includes('<HEAD>')) {
                body = body.replace('<HEAD>', `<HEAD>\n${baseTag}`);
            } else {
                body = baseTag + body;
            }
        }

        res.send(body);
    } catch (err) {
        res.status(500).send(`Proxy error: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
