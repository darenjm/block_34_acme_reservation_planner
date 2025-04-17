const {
  client,
  createTables,
  createCustomer,
  fetchCustomer,
  createRestaurant,
  fetchRestaurant,
  createReservation,
  destroyReservation,
} = require("./db");

const init = async () => {
  await client.connect();
};
console.log("connected to database");

createTables();
console.log("tables created");

const [sally, andy, bethany, nobu, tratorria, pepe] = await Promise.all([
  createCustomer("Sally"),
  createCustomer("Andy"),
  createCustomer("Bethany"),
  createRestaurant("Nobu"),
  createRestaurant("Trattoria Pesce Pasta"),
  createRestaurant("Don Pepe"),
]);
console.log("customer and restaurants created");

console.log(await fetchCustomer());
console.log(await fetchRestaurant());

const [res1] = await Promise.all([
  createReservation({
    date: "04/20/2025",
    party_count: 2,
    restaurant_id: tratorria.id,
    customer_id: bethany,
  }),
  createReservation({
    date: "06/17/2025",
    party_count: 2,
    restaurant_id: pepe.id,
    customer_id: andy,
  }),
]);

init();
