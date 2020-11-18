
DROP TABLE IF EXISTS app.product;

CREATE TABLE IF NOT EXISTS app.product (
	id serial NOT NULL
	,"name" varchar NOT NULL
	,client_id INTEGER NOT NULL REFERENCES app.client(id)
	,schema_name VARCHAR NOT NULL
	,updated_dt TIMESTAMP DEFAULT NOW()
	,updated_by VARCHAR DEFAULT user
	,CONSTRAINT product_pkey PRIMARY KEY (id)
);