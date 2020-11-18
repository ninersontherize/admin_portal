

;DROP TABLE IF EXISTS app.line_item

--from client.ad_view
;CREATE TABLE IF NOT EXISTS app.line_item (
     id serial NOT NULL 
    ,"name" varchar not null 
    ,vendor_id INTEGER not null references app.vendor(id)
    ,updated_dt TIMESTAMP DEFAULT NOW()
    ,updated_by VARCHAR DEFAULT user
    ,constraint line_item_pkey primary key (id)
) ;