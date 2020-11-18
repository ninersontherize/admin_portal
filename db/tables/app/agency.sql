-- app.agency definition

-- Drop table

DROP TABLE IF EXISTS app.agency;

CREATE TABLE IF NOT EXISTS app.agency (
	id serial NOT NULL
	,"name" varchar NOT NULL
	,updated_dt TIMESTAMP DEFAULT NOW()
	,updated_by VARCHAR DEFAULT user
	,CONSTRAINT agency_pkey PRIMARY KEY (id)
);