const { Pool } = require('pg');  // PostgreSQL

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

        const pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT || 5432,
        });

        const result = await pool.query(
            'INSERT INTO comments (author, comment) VALUES ($1, $2) RETURNING id, author, comment, created_at',
            [author, comment]
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ omment: result.rows[0] }),
        };
    } catch (error) {
        console.error(err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
}