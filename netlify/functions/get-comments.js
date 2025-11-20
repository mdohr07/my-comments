const { Pool } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Only GET' };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*',  // for CORS
    };

    try {
        const pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT || 5432,
        });

        const result = await pool.query('SELECT id, author, comment, created_at FROM comments ORDER BY created_at DESC LIMIT 100');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.rows),
        };

    } catch (error) {
        console.error(err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
}