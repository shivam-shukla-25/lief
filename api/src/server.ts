import app from "./app.js";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!!!!`);
  });
})();