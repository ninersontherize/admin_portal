

;DROP TABLE IF EXISTS app.vendor 

--from client.ad_view
;CREATE TABLE IF NOT EXISTS app.vendor (
     id serial NOT NULL
     ,product_id integer not null references app.product(id)
    ,"name" varchar not null 
    ,updated_dt TIMESTAMP DEFAULT NOW()
    ,updated_by VARCHAR DEFAULT user
    ,constraint vendor_pkey primary key (id)
)   
 