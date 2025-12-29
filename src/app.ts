import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world" });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening on http://localhost:${PORT}`);
});
