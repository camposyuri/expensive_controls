// const { Pool } = require("pg");
require("dotenv").config();

const { Client } = require("pg");

// const pool = new Pool({
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_DATABASE,
// 	ssl: process.env.SSL,
// });

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: process.env.SSL,
// });

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

console.log(client);

client.connect();

exports.query = async (query, values) => {
	const { rows } = await client.query(query, values);
	return rows;
};
