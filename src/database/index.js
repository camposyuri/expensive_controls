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
	connectionString:
		"postgres://expensive_control_user:cjatqHaqgNwqEbnbdvplD51A2SYDVYPX@dpg-cgom3r0u9tun42pniu5g-a/expensive_control",
});

// host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_DATABASE,
// 	ssl: process.env.SSL,
// "dev": {
// 	"driver": "pg",
// 	"user": { "ENV": "DB_USER" },
// 	"password": { "ENV": "DB_PASSWORD" },
// 	"host": { "ENV": "DB_HOST" },
// 	"database": { "ENV": "DB_DATABASE" },
// 	"port": { "ENV": "DB_PORT" },
// 	"schema": { "ENV": "DB_SCHEMA" },
// 	"ssl": { "ENV": "SSL" }
// }

client.connect();

exports.query = async (query, values) => {
	const { rows } = await client.query(query, values);
	return rows;
};
