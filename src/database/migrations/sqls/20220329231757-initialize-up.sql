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
  CONSTRAINT pk_id_user PRIMARY KEY(id)
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
	status BOOLEAN NOT NULL DEFAULT TRUE,
	CONSTRAINT pk_id_person PRIMARY KEY(id)
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
	phone VARCHAR(20) NOT NULL,
	CONSTRAINT pk_id_provider PRIMARY KEY(id)
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
	phone VARCHAR(20) NOT NULL,
	CONSTRAINT pk_id_customer PRIMARY KEY(id)
);


DROP SEQUENCE IF EXISTS address_idaddress_seq;
CREATE SEQUENCE address_idaddress_seq
								INCREMENT 1
								MINVALUE 1
								MAXVALUE 9223372036854775807
								START 1
								CACHE 1;

CREATE TABLE IF NOT EXISTS address (
	id INTEGER NOT NULL DEFAULT nextval('address_idaddress_seq'),
	publicPlace VARCHAR(250) NOT NULL,
	number INTEGER NOT NULL,
	complement VARCHAR(150),
	district VARCHAR(100) NOT NULL,
	county VARCHAR(100) NOT NULL,
	zipCode VARCHAR(9) NOT NULL,
	uf CHAR(2) NOT NULL,
	id_customer INTEGER NULL,
	id_person INTEGER NULL,
	id_provider INTEGER NULL,
	CONSTRAINT pk_id_address PRIMARY KEY(id),
	CONSTRAINT fk_id_customer FOREIGN KEY (id_customer) REFERENCES customer(id),
	CONSTRAINT fk_id_person FOREIGN KEY (id_person) REFERENCES person(id),
	CONSTRAINT fk_id_provider FOREIGN KEY (id_provider) REFERENCES provider(id)
);


CREATE OR REPLACE FUNCTION public.CreatePerson(json_parametro json)
RETURNS SETOF integer as $$
DECLARE
  codperson int;

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';

  -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_person;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_person(person_json json);
  INSERT INTO tmp_person VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (person_json::json -> 'endereco')::json AS Endereco
  FROM tmp_person;

  EXECUTE format('INSERT INTO person("name", cpfcnpj, rg, typeperson, birthdate, telephone, phone, datecreated, status)
                      SELECT
                        (person_json ->> %s)::varchar(250) as name,
                        (person_json ->> %s)::varchar(14) as cpfCnpj,
                        (person_json ->> %s)::varchar(9) as rg,
                        (person_json ->> %s)::char(1) as typePerson,
                        (person_json ->> %s)::timestamp as birthdate,
                        (person_json ->> %s)::varchar(20) as telephone,
                        (person_json ->> %s)::varchar(20) as phone,
                        now(),
                        (person_json ->> %s)::boolean as status
                      FROM tmp_person
                  RETURNING id;
                ', '''name''', '''cpfcnpj''', '''rg''', '''typeperson''', '''birthdate''', '''telephone''', '''phone''', '''status''') INTO codperson;

  IF codperson = 0 THEN
    RAISE EXCEPTION 'Código pessoa não informado: %', codperson;
  END IF;

  EXECUTE format('INSERT INTO address(publicplace, "number", complement, district, county, zipcode, uf, id_customer, id_person, id_provider)
                      SELECT
                        (address_json ->> %s)::varchar(250) as publicPlace,
                        (address_json ->> %s)::int as number,
                        (address_json ->> %s)::varchar(150) as complement,
                        (address_json ->> %s)::varchar(100) as district,
                        (address_json ->> %s)::varchar(100) as county,
                        (address_json ->> %s)::varchar(9) as zipCode,
                        (address_json ->> %s)::char(2) as uf,
                        (address_json ->> %s)::int as id_customer,
                        (%s)::int as idPerson,
                        (address_json ->> %s)::int as id_provider
                      FROM tmp_address;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_customer''', codperson, '''id_provider''');
  -- Removendo tabelas temporarias
  DROP TABLE tmp_person;
  DROP TABLE tmp_address;
  RETURN NEXT codperson;

END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.UpdatePerson(codperson int, json_parametro json)
RETURNS SETOF integer as $$
DECLARE

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';

 -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_person;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_person(person_json json);
  INSERT INTO tmp_person VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (person_json::json -> 'endereco')::json AS Endereco
  FROM tmp_person;

  EXECUTE format('UPDATE person SET "name"      = tempperson."name",
                                    cpfcnpj     = tempperson.cpfcnpj,
                                    rg          = tempperson.rg,
                                    typeperson  = tempperson.typeperson,
                                    birthdate   = tempperson.birthdate,
                                    telephone   = tempperson.telephone,
                                    phone       = tempperson.phone,
                                    status      = tempperson.status
                    FROM (SELECT
                            (person_json ->> %s)::varchar(250) as name,
                            (person_json ->> %s)::varchar(14) as cpfCnpj,
                            (person_json ->> %s)::varchar(9) as rg,
                            (person_json ->> %s)::char(1) as typePerson,
                            (person_json ->> %s)::timestamp as birthdate,
                            (person_json ->> %s)::varchar(20) as telephone,
                            (person_json ->> %s)::varchar(20) as phone,
                            now(),
                            (person_json ->> %s)::boolean as status
                          FROM tmp_person) AS tempperson
                    WHERE id = (%s)::int
                    RETURNING id;
                ', '''name''', '''cpfcnpj''', '''rg''', '''typeperson''', '''birthdate''', '''telephone''', '''phone''', '''status''', codperson);

  IF codperson = 0 THEN
    RAISE EXCEPTION 'Código pessoa não informado: %', codperson;
  END IF;

  EXECUTE format('UPDATE address SET publicplace  = tempaddress.publicplace,
                                    "number"      = tempaddress."number",
                                    complement    = tempaddress.complement,
                                    district      = tempaddress.district,
                                    county        = tempaddress.county,
                                    zipcode       = tempaddress.zipcode,
                                    uf            = tempaddress.uf,
                                    id_customer   = tempaddress.id_customer,
                                    id_provider   = tempaddress.id_provider
                  FROM (SELECT
                          (address_json ->> %s)::varchar(250) as publicPlace,
                          (address_json ->> %s)::int as number,
                          (address_json ->> %s)::varchar(150) as complement,
                          (address_json ->> %s)::varchar(100) as district,
                          (address_json ->> %s)::varchar(100) as county,
                          (address_json ->> %s)::varchar(9) as zipCode,
                          (address_json ->> %s)::char(2) as uf,
                          (address_json ->> %s)::int as id_customer,
                          (address_json ->> %s)::int as id_provider
                        FROM tmp_address) AS tempaddress
                  WHERE id_person = (%s)::int;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_customer''', '''id_provider''', codperson);
  -- Removendo tabelas temporarias
  DROP TABLE tmp_person;
  DROP TABLE tmp_address;
  RETURN NEXT codperson;

END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.CreateProvider(json_parametro json)
RETURNS SETOF integer as $$
DECLARE
  codprovider int;

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';

  -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_provider;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_provider(provider_json json);
  INSERT INTO tmp_provider VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (provider_json::json -> 'endereco')::json AS Endereco
  FROM tmp_provider;

  EXECUTE format('INSERT INTO provider(corporatename, fantasyname, cpfcnpj, typeperson, datecreated, status, telephone, phone)
                      SELECT
                        (provider_json ->> %s)::varchar(250) as corporateName,
                        (provider_json ->> %s)::varchar(250) as fantasyName,
                        (provider_json ->> %s)::varchar(14) as cpfCnpj,
                        (provider_json ->> %s)::char(1) as typePerson,
                        now(),
                        (provider_json ->> %s)::boolean as status,
                        (provider_json ->> %s)::varchar(20) as telephone,
                        (provider_json ->> %s)::varchar(20) as phone
                      FROM tmp_provider
                  RETURNING id;
                ', '''corporatename''', '''fantasyname''', '''cpfcnpj''', '''typeperson''', '''status''', '''telephone''', '''phone''') INTO codprovider;

  IF codprovider = 0 THEN
    RAISE EXCEPTION 'Código fornecedor não informado: %', codprovider;
  END IF;

  EXECUTE format('INSERT INTO address(publicplace, "number", complement, district, county, zipcode, uf, id_customer, id_person, id_provider)
                      SELECT
                        (address_json ->> %s)::varchar(250) as publicPlace,
                        (address_json ->> %s)::int as number,
                        (address_json ->> %s)::varchar(150) as complement,
                        (address_json ->> %s)::varchar(100) as district,
                        (address_json ->> %s)::varchar(100) as county,
                        (address_json ->> %s)::varchar(9) as zipCode,
                        (address_json ->> %s)::char(2) as uf,
                        (address_json ->> %s)::int as id_customer,
                        (address_json ->> %s)::int as id_person,
                        (%s)::int as idProvider
                      FROM tmp_address;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_customer''', '''id_person''', codprovider);
  -- Removendo tabelas temporarias
  DROP TABLE tmp_provider;
  DROP TABLE tmp_address;
  RETURN NEXT codprovider;

END; $$
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION public.UpdateProvider(codprovider int, json_parametro json)
RETURNS SETOF integer as $$
DECLARE

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';

  -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_provider;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_provider(provider_json json);
  INSERT INTO tmp_provider VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (provider_json::json -> 'endereco')::json AS Endereco
  FROM tmp_provider;

  IF codprovider = 0 THEN
    RAISE EXCEPTION 'Código fornecedor não informado: %', codprovider;
  END IF;

EXECUTE format('UPDATE provider SET   corporateName       = tempprovider.corporateName,
                                      fantasyname         = tempprovider.fantasyname,
                                      cpfcnpj             = tempprovider.cpfcnpj,
                                      typeperson          = tempprovider.typeperson,
                                      status              = tempprovider.status,
                                      telephone           = tempprovider.telephone,
                                      phone               = tempprovider.phone
                    FROM (SELECT
                        (provider_json ->> %s)::varchar(250) as corporateName,
                        (provider_json ->> %s)::varchar(250) as fantasyName,
                        (provider_json ->> %s)::varchar(14) as cpfCnpj,
                        (provider_json ->> %s)::char(1) as typePerson,
                        now(),
                        (provider_json ->> %s)::boolean as status,
                        (provider_json ->> %s)::varchar(20) as telephone,
                        (provider_json ->> %s)::varchar(20) as phone
                      FROM tmp_provider) AS tempprovider
                    WHERE id = (%s)::int
                    RETURNING id;
                ', '''corporatename''', '''fantasyname''', '''cpfcnpj''', '''typeperson''', '''status''', '''telephone''', '''phone''', codprovider);

   EXECUTE format('UPDATE address SET publicplace  = tempaddress.publicplace,
                                    "number"      = tempaddress."number",
                                    complement    = tempaddress.complement,
                                    district      = tempaddress.district,
                                    county        = tempaddress.county,
                                    zipcode       = tempaddress.zipcode,
                                    uf            = tempaddress.uf,
                                    id_customer   = tempaddress.id_customer,
                                    id_person   = tempaddress.id_person
                  FROM (SELECT
                          (address_json ->> %s)::varchar(250) as publicPlace,
                          (address_json ->> %s)::int as number,
                          (address_json ->> %s)::varchar(150) as complement,
                          (address_json ->> %s)::varchar(100) as district,
                          (address_json ->> %s)::varchar(100) as county,
                          (address_json ->> %s)::varchar(9) as zipCode,
                          (address_json ->> %s)::char(2) as uf,
                          (address_json ->> %s)::int as id_customer,
                          (address_json ->> %s)::int as id_person
                        FROM tmp_address) AS tempaddress
                  WHERE id_provider = (%s)::int;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_customer''', '''id_person''', codprovider);

  -- Removendo tabelas temporarias
  DROP TABLE tmp_provider;
  DROP TABLE tmp_address;
  RETURN NEXT codprovider;

END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.CreateCustomer(json_parametro json)
RETURNS SETOF integer as $$
DECLARE
  codcustomer int;

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';

  -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_customer;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_customer(customer_json json);
  INSERT INTO tmp_customer VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (customer_json::json -> 'endereco')::json AS Endereco
  FROM tmp_customer;

  EXECUTE format('INSERT INTO customer (corporatename, fantasyname, cpfcnpj, typeperson, datecreated, status, telephone, phone)
                      SELECT
                        (customer_json ->> %s)::varchar(250) as corporateName,
                        (customer_json ->> %s)::varchar(250) as fantasyName,
                        (customer_json ->> %s)::varchar(14) as cpfCnpj,
                        (customer_json ->> %s)::char(1) as typePerson,
                        now(),
                        (customer_json ->> %s)::boolean as status,
                        (customer_json ->> %s)::varchar(20) as telephone,
                        (customer_json ->> %s)::varchar(20) as phone
                      FROM tmp_customer
                  RETURNING id;
                ', '''corporatename''', '''fantasyname''', '''cpfcnpj''', '''typeperson''', '''status''', '''telephone''', '''phone''') INTO codcustomer;

  IF codcustomer = 0 THEN
    RAISE EXCEPTION 'Código cliente não informado: %', codcustomer;
  END IF;

  EXECUTE format('INSERT INTO address(publicplace, "number", complement, district, county, zipcode, uf, id_provider, id_person, id_customer)
                      SELECT
                        (address_json ->> %s)::varchar(250) as publicPlace,
                        (address_json ->> %s)::int as number,
                        (address_json ->> %s)::varchar(150) as complement,
                        (address_json ->> %s)::varchar(100) as district,
                        (address_json ->> %s)::varchar(100) as county,
                        (address_json ->> %s)::varchar(9) as zipCode,
                        (address_json ->> %s)::char(2) as uf,
                        (address_json ->> %s)::int as id_provider,
                        (address_json ->> %s)::int as id_person,
                        (%s)::int as idCustomer
                      FROM tmp_address;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_provider''', '''id_person''', codcustomer);
  -- Removendo tabelas temporarias
  DROP TABLE tmp_customer;
  DROP TABLE tmp_address;
  RETURN NEXT codcustomer;

END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.UpdateCustomer(codcustomer int, json_parametro json)
RETURNS SETOF integer as $$
DECLARE

BEGIN
  SET TIMEZONE TO 'America/Sao_Paulo';
  -- Se existir a tabela dropa
  DROP TABLE IF EXISTS tmp_customer;
  DROP TABLE IF EXISTS tmp_address;

   -- Cria todas tabelas tempararias para consultar dados
  CREATE TEMPORARY TABLE tmp_customer(customer_json json);
  INSERT INTO tmp_customer VALUES (json_parametro);

  CREATE TEMPORARY TABLE tmp_address(address_json json);
  INSERT INTO tmp_address SELECT (customer_json::json -> 'endereco')::json AS Endereco
  FROM tmp_customer;

  IF codcustomer = 0 THEN
    RAISE EXCEPTION 'Código cliente não informado: %', codcustomer;
  END IF;

EXECUTE format('UPDATE customer SET   corporateName       = tempcustomer.corporateName,
                                      fantasyname         = tempcustomer.fantasyname,
                                      cpfcnpj             = tempcustomer.cpfcnpj,
                                      typeperson          = tempcustomer.typeperson,
                                      status              = tempcustomer.status,
                                      telephone           = tempcustomer.telephone,
                                      phone               = tempcustomer.phone
                    FROM (SELECT
                        (customer_json ->> %s)::varchar(250) as corporateName,
                        (customer_json ->> %s)::varchar(250) as fantasyName,
                        (customer_json ->> %s)::varchar(14) as cpfCnpj,
                        (customer_json ->> %s)::char(1) as typePerson,
                        (customer_json ->> %s)::boolean as status,
                        (customer_json ->> %s)::varchar(20) as telephone,
                        (customer_json ->> %s)::varchar(20) as phone
                      FROM tmp_customer) AS tempcustomer
                    WHERE id = (%s)::int
                    RETURNING id;
                ', '''corporatename''', '''fantasyname''', '''cpfcnpj''', '''typeperson''', '''status''', '''telephone''', '''phone''', codcustomer);

   EXECUTE format('UPDATE address SET publicplace  = tempaddress.publicplace,
                                    "number"      = tempaddress."number",
                                    complement    = tempaddress.complement,
                                    district      = tempaddress.district,
                                    county        = tempaddress.county,
                                    zipcode       = tempaddress.zipcode,
                                    uf            = tempaddress.uf,
                                    id_provider   = tempaddress.id_provider,
                                    id_person   = tempaddress.id_person
                  FROM (SELECT
                          (address_json ->> %s)::varchar(250) as publicPlace,
                          (address_json ->> %s)::int as number,
                          (address_json ->> %s)::varchar(150) as complement,
                          (address_json ->> %s)::varchar(100) as district,
                          (address_json ->> %s)::varchar(100) as county,
                          (address_json ->> %s)::varchar(9) as zipCode,
                          (address_json ->> %s)::char(2) as uf,
                          (address_json ->> %s)::int as id_provider,
                          (address_json ->> %s)::int as id_person
                        FROM tmp_address) AS tempaddress
                  WHERE id_customer = (%s)::int;
                ', '''publicplace''', '''number''', '''complement''', '''district''', '''county''', '''zipcode''', '''uf''', '''id_provider''', '''id_person''', codcustomer);

  -- Removendo tabelas temporarias
  DROP TABLE tmp_customer;
  DROP TABLE tmp_address;
  RETURN NEXT codcustomer;

END; $$
LANGUAGE 'plpgsql';
