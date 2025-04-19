const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  allowedHeaders: "*"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
// Increase limit for JSON payloads
app.use(bodyParser.json({ limit: '50mb' }));

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

// Database connection and sync
const db = require("./models");
console.log("Attempting to sync database...");
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch(err => {
    console.log("Failed to sync database: " + err.message);
    console.error("Database connection error details:", err);
  });

// Check if routes directory exists
const routesPath = path.join(__dirname, 'routes');
console.log("Checking routes directory:", routesPath);
if (fs.existsSync(routesPath)) {
  console.log("Routes directory exists");
  
  // Check if eventos route file exists
  const routeFile = path.join(routesPath, 'evento.routes.js');
  console.log("Checking route file:", routeFile);
  if (fs.existsSync(routeFile)) {
    console.log("Route file exists, loading routes...");
    
    // Routes
    try {
      console.log("Loading routes from:", routeFile);
      require("./routes/evento.routes")(app);
      console.log("Routes loaded successfully");

      // Log all registered routes
      console.log("Registered routes:");
      app._router.stack.forEach(middleware => {
        if (middleware.route) { // routes registered directly on the app
          console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
        } else if (middleware.name === 'router') { // router middleware
          middleware.handle.stack.forEach(handler => {
            if (handler.route) {
              const path = handler.route.path;
              const method = Object.keys(handler.route.methods)[0].toUpperCase();
              console.log(`${method} /api/eventos${path}`);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error loading routes:", error);
    }
  } else {
    console.error("Route file does not exist!");
  }
} else {
  console.error("Routes directory does not exist!");
}

// Simple test routes
app.get("/test", (req, res) => {
  res.json({ message: "Test route is working" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API test route is working" });
});

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Calendar Events API." });
});

// Testing route for api/eventos
app.get("/api/eventos/test", (req, res) => {
  res.json({ message: "Eventos API is working" });
});

// Set port and listen for requests
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`API available at http://localhost:${PORT}/api/eventos`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    // Try another port
    const alternativePort = PORT + 1;
    app.listen(alternativePort, () => {
      console.log(`Server is running on alternative port ${alternativePort}.`);
      console.log(`API available at http://localhost:${alternativePort}/api/eventos`);
      console.log(`IMPORTANT: Update frontend API_URL to http://localhost:${alternativePort}/api/eventos`);
    });
  } else {
    console.error('Server error:', err);
  }
}); 