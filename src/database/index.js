require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.SSL,
});

console.log(client);

client.connect();

exports.query = async (query, values) => {
	const { rows } = await client.query(query, values);
	return rows;
};
