CREATE TABLE "table" (
  "id" SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE "order" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "table_id" int NOT NULL,
  "assistance" boolean NOT NULL DEFAULT false,
  "bill_request" boolean NOT NULL DEFAULT false
);

CREATE TABLE "item" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "price" float NOT NULL,
  "visible" boolean NOT NULL
);

CREATE TABLE "status" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "status_name" varchar NOT NULL
);

CREATE TABLE "item_order" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "item_id" int NOT NULL,
  "order_id" int NOT NULL,
  "quantity" int NOT NULL,
  "status_id" int NOT NULL
);

CREATE TABLE "ingredient" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL
);

CREATE TABLE "item_ingredient" (
  "item_id" int NOT NULL,
  "ingredient_id" int NOT NULL
);

CREATE TABLE "category" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "position" int UNIQUE NOT NULL
);

CREATE TABLE "category_item" (
  "category_id" int NOT NULL,
  "item_id" int NOT NULL,
  "position" int UNIQUE NOT NULL
);

CREATE TABLE "staff" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "name" varchar NOT NULL,
  "staff_type_id" int NOT NULL
);

CREATE TABLE "staff_type" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL
);

CREATE TABLE "staff_registration" (
  "registration_key" varchar NOT NULL,
  "staff_type" int NOT NULL,
  "used" boolean NOT NULL,
  PRIMARY KEY ("registration_key"),
  FOREIGN KEY ("staff_type") REFERENCES staff_type("id")
);

ALTER TABLE "order" ADD FOREIGN KEY ("table_id") REFERENCES "table" ("id");

ALTER TABLE "item_order" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

ALTER TABLE "item_order" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "item_order" ADD FOREIGN KEY ("status_id") REFERENCES "status" ("id");

ALTER TABLE "item_ingredient" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

ALTER TABLE "item_ingredient" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredient" ("id");

ALTER TABLE "category_item" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");

ALTER TABLE "category_item" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

ALTER TABLE "staff" ADD FOREIGN KEY ("staff_type_id") REFERENCES "staff_type" ("id");

ALTER TABLE "staff_registration" ADD FOREIGN KEY ("staff_type_id") REFERENCES "staff_type" ("id");
