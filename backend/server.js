import express from "express";
import cors from "cors";
import { LocalStorage } from "node-localstorage";


const app = express();
const port = 3000;

app.use(cors());

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


let newsCache = null;
let newsTimestamp = 0;
const newsExpiry = 10 * 60 * 1000;
const localStorage = new LocalStorage('./scratch');
async function fetchNewsBackend(cat) {
    // if (newsCache && (Date.now() - newsTimestamp < newsExpiry)) {
    //     console.log("Loaded news from cache");
    //     return newsCache;
    // }
    const local = JSON.parse(localStorage.getItem(`${cat}`))
    if (local && (Date.now() - newsTimestamp < newsExpiry)) {
        console.log("Loaded news from cache");
        return local;
    }

    try {
        const query = encodeURIComponent("all latest news from india");
        const url = `https://newsdata.io/api/1/latest?apikey=${news_Api_key}&q=${query}&category=${cat}`;
        // const url = `https://newsdata.io/api/1/latest?apikey=${news_Api_key}&q=${query}`;
        const res = await fetch(url);
        const data = await res.json();

        newsCache = data[cat];
        newsTimestamp = Date.now();

        console.log("Fetched news from API");
        localStorage.setItem(`${cat}`, JSON.stringify(data,newsTimestamp))
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return { error: "Failed to fetch news" };
    }
}

app.get(`/news/:cat`, async (req, res) => {
    const {cat} = req.params
    const data = await fetchNewsBackend(cat);
    res.json(data)
})


app.listen(port, () => {
    console.log("server started on: ", port)
})