import app from "./app.js";
import { initDb } from "./db/initDb.js";

const PORT = process.env.PORT || 5000;

(async () => {
  await initDb();  
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
})();
