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

const express = require("express");
const morgan = require("morgan");

const server = express();
client.connect();

const port = process.env.PORT || 3300;
server.listen(port, () => console.log(`listening on port ${port}`));

server.use(express.json());

server.get("/api/customer", async (req, res, next) => {
  try {
    const customer = await fetchCustomer();
    res.send(customer);
  } catch (error) {
    next(error);
  }
});
server.get("/api/restaurant", async (req, res, next) => {
  try {
    const restaurant = await fetchRestaurant();
    res.send(restaurant);
  } catch (error) {
    next(error);
  }
});
server.get("/api/reservations", async (req, res, next) => {
  try {
    const reservations = await fetchReservation();
    res.send(reservations);
  } catch (error) {
    next(error);
  }
});
server.post("/api/customer/:id/reservation", async (req, res, next) => {
  try {
    console.log(req.body);
    const reservations = await createReservation({
      restaurant_id: req.body.restaurant_id,
      date: req.body.date,
      party_count: req.body.party_count,
      customer_id: req.params.id
    });
    res.send(reservations);
  } catch (error) {
    next(error);
  }
});

server.delete(
  "/api/customer/:customer_id/reservation/:id",
  async (req, res, next) => {
    try {
      const SQL = `DELETE FROM reservation WHERE id=$1`;
      const response = await client.query(SQL, [req.params.id]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

//error handling route which returns an object with an error property
server.use((err, req, res) => {
  res.status(err.status || 500).send({ error: err.message || err });
});
