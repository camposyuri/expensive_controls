const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
	host: process.env.DB_HOSTNAME,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	ssl: true,
});

// const client = new Client({
// 	connectionString:
// 		"postgres://expensive_control_user:cjatqHaqgNwqEbnbdvplD51A2SYDVYPX@dpg-cgom3r0u9tun42pniu5g-a.ohio-postgres.render.com/expensive_control",
// });

client.connect();

exports.query = async (query, values) => {
	const { rows } = await client.query(query, values);
	return rows;
};
