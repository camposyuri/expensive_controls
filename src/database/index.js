const { Pool } = require("pg");
require("dotenv").config();

// const { Client, Pool } = require("pg");

const pool = new Pool({
	host: process.env.DB_HOSTNAME,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	ssl: process.env.SSL,
});

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: process.env.SSL,
// });

// const client = new Client({
// 	host: process.env.DB_HOSTNAME,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_DATABASE,
// 	ssl: true,
// });

pool.connect();

exports.query = async (query, values) => {
	const { rows } = await pool.query(query, values);
	return rows;
};
