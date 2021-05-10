"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
const express_1 = __importDefault(require("express"));
const connectDB = require("../config/db");
const app = express_1.default();
// connect to mongo atlas database
connectDB();
// Init Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("app running..."));
// Define routes
app.use("/api/users", require("./controllers/user"));
app.use("/api/players", require("./controllers/player"));
app.use("/api/profile", require("./controllers/profile"));
app.use("/api/auth", require("./controllers/auth"));
exports.PORT = process.env.PORT || 5000;
// export default app;
app.listen(exports.PORT, () => console.log(`Server started on port ${exports.PORT}.`));
//# sourceMappingURL=app.js.map