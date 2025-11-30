import express from "express";
import cors from "cors";

const expressApp = express();
const PORT = process.env.PORT || 5000;

expressApp.use(cors());

expressApp.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

expressApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
