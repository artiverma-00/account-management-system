const express = require("express");
const cors = require("cors");

const systemRoutes = require("./routes/systemRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Express API is running.",
  });
});

app.use("/api/system", systemRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

module.exports = app;
