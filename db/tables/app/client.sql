DROP TABLE IF EXISTS app.client;

CREATE TABLE IF NOT EXISTS app.client (
	id serial NOT NULL
	,"name" varchar NOT NULL
	,agency_id INTEGER NOT NULL REFERENCES app.agency(id)
	,updated_dt TIMESTAMP DEFAULT NOW()
	,updated_by VARCHAR DEFAULT user
	,CONSTRAINT client_pkey PRIMARY KEY (id) 
);
