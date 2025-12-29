import express from "express";
import cors from "cors";
import "dotenv/config";
import { ridesRouter } from "./routes/rides.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use("/api/rides", ridesRouter)

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening on http://localhost:${PORT}`);
});
