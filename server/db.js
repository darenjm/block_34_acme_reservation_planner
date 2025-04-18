const pg = require("pg");
const uuid = require("uuid");
require("dotenv");

const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost/acme_reservation_db",
});

async function createTables() {
  //droppings the tables
  //create the tables
  const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;

        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurant (id) NOT NULL,
            customer_id UUID REFERENCES customer (id) NOT NULL
        );
    `;

  await client.query(SQL);
}

async function createCustomer(name) {
  const SQL = `INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchCustomer() {
  const SQL = `SELECT * FROM customer;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createRestaurant(name) {
  const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchRestaurant() {
  const SQL = `SELECT * FROM restaurant;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createReservation({date, customer_id, party_count, restaurant_id}) {
  const SQL = `INSERT INTO reservation(id, date, party_count, restaurant_id, customer_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return dbResponse.rows[0];
}

async function fetchReservation() {
  const SQL = `SELECT * FROM reservation;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function destroyReservation(id, customer_id) {
  const SQL = `DELETE FROM reservation WHERE id=$1 AND customer_id=$2`;
  await client.query(SQL, [id, customer_id]);
}

module.exports = {
  client,
  createTables,
  createCustomer,
  fetchCustomer,
  createRestaurant,
  fetchRestaurant,
  createReservation,
  fetchReservation,
  destroyReservation,
};
