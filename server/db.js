const { Client } = require('pg');


const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/acme_reservation_planner',
});

async function createTables() {
  //droppings the tables
  //create the tables
  const SQL = `
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        DROP TABLE IF EXISTS reservation;

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            date DATE NOT NULL
            party_count INTEGER NOT NULL
            restaurant_id UUID REFERENCES restaurant (id) NOT NULL,
            customer_id UUID REFERENCES customer (id) NOT NULL,
        );

        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
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

async function createReservation (date, customer_id, party_count) {
    const SQL = `INSERT INTO reservation(id, date, party_count, restaurant_id, customer_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const dbResponse = await client.query(SQL, [
        uuid.v4(),
        date,
        customer_id,
        party_count,
    ]);
    return dbResponse.rows[0];
}

async function destroyReservation(id, customer_id) {
    const SQL = `DELETE FROM reservation WHERE -d=$1 AND customer_id=$5`;
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
  destroyReservation,
};