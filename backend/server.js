const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./src/middleware/errorMiddleware");
const colors = require("colors");
const cors = require("cors");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const dns = require("dns");

const app = express();
const PORT = process.env.PORT;

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Enable CORS
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "controllers", "uploads"))
);
//app.use("/uploads", express.static(uploadsDir));

app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/payment", require("./src/routes/paymentRoutes"));
app.use("/api/features", require("./src/routes/featureRoutes"));
app.use("/api/events", require("./src/routes/eventRoutes"));
app.use("/api/auditoriums", require("./src/routes/auditoriumRoutes"));
app.use("/api/bookings", require("./src/routes/bookingRoutes"));

app.use(errorHandler);

const ipAddress = "203.161.52.208";

app.listen(PORT, () => {
  dns.reverse(ipAddress, (err, hostnames) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(
        `Domain names associated with ${ipAddress}: ${hostnames.join(", ")}`
      );
    }
  });
  console.log(`Server running on port ${PORT}`);
});
