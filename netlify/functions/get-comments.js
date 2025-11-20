const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Only GET' };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*',  // for CORS
    };

    try { // load comments from json
        const filePath = path.join(__dirname, 'comments.json');
        const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

        const result = await pool.query('SELECT id, author, comment, created_at FROM comments ORDER BY created_at DESC LIMIT 100');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error(err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
}