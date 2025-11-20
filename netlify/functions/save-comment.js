const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Only POST' };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*',  // forCORS
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const body = JSON.parse(event.body || '{}');
        const { author = 'Anonymous', comment } = body;

        if (!comment || comment.trim() === '') {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Empty comment' }) };
        }

        // Load exisiting comments from json
        const filePath = path.join(__dirname, 'comments.json');
        const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

        // Create new comment.object
        const newComment = {
            id: data.length + 1,
            author,
            comment,
            created_at: new Date().toISOString(),
        };

        // Save new comment in file
        data.push(newComment);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ omment: newComment }),
        };
    } catch (error) {
        console.error(err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
}