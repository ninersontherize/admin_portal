-- app.user definition

DROP TABLE IF EXISTS app.user;

CREATE TABLE IF NOT EXISTS app.user (
	id serial NOT NULL
	,"name" varchar NOT NULL
	,email varchar NOT NULL
	,"password" varchar NOT NULL
	,"role" varchar NOT NULL
	,agency_id INTEGER references app.agency(id)
	,reset_password_token varchar
	,reset_password_expires varchar
	,updated_dt TIMESTAMP DEFAULT NOW()
	,updated_by VARCHAR DEFAULT user
	,CONSTRAINT users_pkey PRIMARY KEY (id)
);