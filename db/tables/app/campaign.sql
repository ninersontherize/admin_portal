;DROP TABLE IF EXISTS app.campaign

--from client.ad_view
;CREATE TABLE IF NOT EXISTS app.campaign (
     id serial NOT NULL 
    ,product_id integer not null references app.product(id)
    ,vendor_id integer not null references app.vendor(id)
    ,line_item_id integer not null references app.line_item(id)
    ,start_date date 
    ,end_date date
    ,planned_cpm numeric
    ,planned_impressions bigint
    ,planned_budget numeric
    ,actual_cpm numeric
    ,actual_impressions bigint
    ,updated_dt TIMESTAMP DEFAULT NOW()
    ,updated_by VARCHAR DEFAULT user
    ,constraint campaign_pkey primary key (id)
);
