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