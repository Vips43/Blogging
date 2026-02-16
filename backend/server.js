import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);


//serve frontend
app.use(express.static(path.join(_dirname, "..", "frontend")));
app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "..", "frontend", "index.html"))
})

app.use(cors());
app.use(express.json());

const data_path = './data/data.json';
app.use("/images", express.static(path.join(_dirname, "/images")))
app.get("/api/temple", (req, res) => {
    fs.readFile(data_path, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "could not redad data" });
        }
        try {
            res.json(JSON.parse(data));
        } catch {
            res.status(500).json({ error: "invalid json file" });
        }
    })
})

app.post("/api/temple", (req, res) => {
    const newData = req.body;

    fs.writeFile(data_path, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).send("Error saving data");
        res.send("Data saved successfully");
    })
})


const cache = {};

const api_key = '91d80201-d045-4495-b89a-24f6d834710e';
const news_Api_key = 'pub_e8ae66892e2d493086df2d385316465d';

function baseUrl() {
    return 'https://appi.cricapi.com';
}

async function fetchGlobal(params, key, expiry = 6000000) {
    const cached = cache[key];

    if (cached && Date.now() - cached.timestamp < expiry) {
        console.log("loaded from cache", key);
        return cached.data
    }
    try {
        const url = `${baseUrl()}${params}?apikey=${api_key}&offset=0`;
        const res = await fetch(url);
        const data = await res.json();

        cache[key] = { data, timestamp: Date.now() };
        console.log("Fetched from API:", key);
        return data;
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch data" };
    }
}

app.get("/scores", async (req, res) => {
    const data = await fetchGlobal("/matches", "matches")
    res.json(data);
})


let newsCache = {};
let newsTimestamp = 0;
const newsExpiry = 10 * 60 * 10000;


async function fetchNewsBackend(cat) {
    if (newsCache[cat] && (Date.now() - newsCache[cat].timestamp < newsExpiry)) {
        console.log("Loaded news from cache", cat);
        return newsCache[cat].data;
    }


    try {
        const query = encodeURIComponent("all latest news from india");
        const url = `https://newsdata.io/api/1/latest?apikey=${news_Api_key}&q=${query}&category=${cat}`;
        const res = await fetch(url);
        const data = await res.json();

        newsTimestamp = Date.now();

        newsCache[cat] = { data: data, timestamp: newsTimestamp }

        console.log("Fetched news from API", cat);
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return { error: "Failed to fetch news", cat };
    }
}

app.get(`/news/:cat`, async (req, res) => {
    const { cat } = req.params
    const data = await fetchNewsBackend(cat);
    res.json(data)
})

app.get((req, res) => {
  res.sendFile(path.join(_dirname, "..", "frontend", "index.html"));
});

app.listen(port, () => {
    console.log("server started on: ", port)
})