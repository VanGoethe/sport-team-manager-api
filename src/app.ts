import express from "express";
const connectDB = require("../config/db");

const app = express();

// connect to mongo atlas database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => res.send("app running..."));

// Define routes
app.use("/api/users", require("./controllers/user"));
app.use("/api/players", require("./controllers/player"));
app.use("/api/profile", require("./controllers/profile"));
app.use("/api/auth", require("./controllers/auth"));

export const PORT = process.env.PORT || 5000;

// export default app;
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
