const {
  client,
  createTables,
  createCustomer,
  fetchCustomer,
  createRestaurant,
  fetchRestaurant,
  createReservation,
  fetchReservation,
  destroyReservation,
} = require("./db");

const init = async () => {
  await client.connect();

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
      customer_id: bethany.id,
    }),
    createReservation({
      date: "06/17/2025",
      party_count: 2,
      restaurant_id: pepe.id,
      customer_id: andy.id,
    }),
  ]);
  console.log("reservations created");

  console.log(await fetchReservation());
console.log(res1)
console.log(bethany)
  await destroyReservation(res1.id, bethany.id);
  console.log("deleted reservation");

  console.log(await fetchReservation());

  await client.end();
};

init();
