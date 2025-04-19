const db = require("../models");
const Evento = db.eventos;

// Create and Save a new Event
exports.create = async (req, res) => {
  try {
    console.log("Create event request body:", req.body);
    
    // Validate request
    if (!req.body.title || !req.body.start || !req.body.end) {
      console.log("Validation failed: missing required fields");
      return res.status(400).send({
        message: "Title, start date and end date are required!"
      });
    }

    // Create an Event
    const evento = {
      title: req.body.title,
      description: req.body.description || "",
      start: req.body.start,
      end: req.body.end,
      color: req.body.color || "#3788d8",
      allDay: req.body.allDay || false
    };

    console.log("Creating event with data:", evento);

    // Save Event in the database
    const data = await Evento.create(evento);
    console.log("Event created successfully with id:", data.id);
    res.status(201).send(data);
  } catch (err) {
    console.error("Error in create event:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Event."
    });
  }
};

// Retrieve all Events from the database
exports.findAll = async (req, res) => {
  try {
    console.log("Find all events request");
    const data = await Evento.findAll();
    console.log(`Found ${data.length} events`);
    res.send(data);
  } catch (err) {
    console.error("Error in findAll events:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving events."
    });
  }
};

// Find a single Event with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Evento.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Event with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Event with id=${id}`
    });
  }
};

// Update an Event
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Evento.update(req.body, {
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Event was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Event with id=${id}`
    });
  }
};

// Delete an Event with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Evento.destroy({
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Event was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not delete Event with id=${id}`
    });
  }
}; 