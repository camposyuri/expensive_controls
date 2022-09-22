/* Replace with your SQL commands */
DROP SEQUENCE IF EXISTS users_iduser_seq;
CREATE SEQUENCE users_iduser_seq
                INCREMENT 1
                MINVALUE 1
                MAXVALUE 9223372036854775807
                START 1
                CACHE 1;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER NOT NULL DEFAULT nextval('users_iduser_seq'),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  dateCreated TIMESTAMP NOT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT pk_iduser PRIMARY KEY(id)
);

DROP SEQUENCE IF EXISTS person_idperson_seq;
CREATE SEQUENCE person_idperson_seq
								INCREMENT 1
								MINVALUE 1
								MAXVALUE 9223372036854775807
								START 1
								CACHE 1;

CREATE TABLE IF NOT EXISTS person (
	id INTEGER NOT NULL DEFAULT nextval('person_idperson_seq'),
	name VARCHAR(250) NOT NULL,
	cpfCnpj VARCHAR(14) NOT NULL UNIQUE,
	rg VARCHAR(9),
	typePerson CHAR(1) NOT NULL DEFAULT 'F',
	birthdate TIMESTAMP NOT NULL,
	telephone VARCHAR(20),
	phone VARCHAR(20) NOT NULL,
	dateCreated TIMESTAMP NOT NULL,
	status BOOLEAN NOT NULL DEFAULT TRUE
);

DROP SEQUENCE IF EXISTS provider_idprovider_seq;
CREATE SEQUENCE provider_idprovider_seq
								INCREMENT 1
								MINVALUE 1
								MAXVALUE 9223372036854775807
								START 1
								CACHE 1;

CREATE TABLE IF NOT EXISTS provider (
	id INTEGER NOT NULL DEFAULT nextval('provider_idprovider_seq'),
	corporateName VARCHAR(250) NOT NULL,
	fantasyName VARCHAR(250),
	cpfCnpj VARCHAR(14) NOT NULL UNIQUE,
	typePerson CHAR(1) NOT NULL DEFAULT 'J',
	dateCreated TIMESTAMP NOT NULL,
	status BOOLEAN NOT NULL DEFAULT TRUE,
	telephone VARCHAR(20),
	phone VARCHAR(20) NOT NULL
);

DROP SEQUENCE IF EXISTS customer_idcustomer_seq;
CREATE SEQUENCE customer_idcustomer_seq
								INCREMENT 1
								MINVALUE 1
								MAXVALUE 9223372036854775807
								START 1
								CACHE 1;

CREATE TABLE IF NOT EXISTS customer (
	id INTEGER NOT NULL DEFAULT nextval('customer_idcustomer_seq'),
	corporateName VARCHAR(250) NOT NULL,
	fantasyName VARCHAR(250),
	cpfCnpj VARCHAR(14) NOT NULL UNIQUE,
	typePerson CHAR(1) NOT NULL DEFAULT 'J',
	dateCreated TIMESTAMP NOT NULL,
	status BOOLEAN NOT NULL DEFAULT TRUE,
	telephone VARCHAR(20),
	phone VARCHAR(20) NOT NULL
);
