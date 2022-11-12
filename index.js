import express from "express";
import cors from "cors";
import axios from "axios";
import Redis from "redis";

const DEFAULT_EXPIRATION = 3600; // 1h
const API_KEY = "123";

const app = express();
app.use(cors());
app.listen(3000, () => console.log("listening on port 3000"));
let redisClient;

(async () => {
  redisClient = Redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.get("/photos", async (req, res) => {
  const { albumId } = req.query;
  const { api_key } = req.headers;
  let results = [];
  let isCached = false;

  if (API_KEY !== api_key) {
    res.send("unauthorized_access");
  }

  try {
    const cacheResults = await redisClient.get("photos");

    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);

      return res.json({ results, isCached });
    } else {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {
          params: { albumId },
        }
      );
      redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
      results = data;
      res.json({ results, isCached });
    }
  } catch (error) {
    console.error(error);
  }
});
