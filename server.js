const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "User/Role API is running" });
});

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});