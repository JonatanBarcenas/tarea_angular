module.exports = app => {
  const eventos = require("../controllers/evento.controller.js");
  const router = require("express").Router();

  // Create a new Event
  router.post("/", eventos.create);

  // Retrieve all Events
  router.get("/", eventos.findAll);

  // Retrieve a single Event with id
  router.get("/:id", eventos.findOne);

  // Update an Event with id
  router.put("/:id", eventos.update);

  // Delete an Event with id
  router.delete("/:id", eventos.delete);

  app.use("/api/eventos", router);
}; 