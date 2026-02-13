const api_key = '91d80201-d045-4495-b89a-24f6d834710e';

function baseUrl() {
    const base = `https://api.cricapi.com`
    return base;
}

export async function fetchGlobal(params, key, expiry = 600000000) {

    const score = JSON.parse(localStorage.getItem(key))
    if (score && Date.now() - score.timestamp < expiry) {
        console.log("loaded", score)
        return score.data
    }
    try {
        const base = baseUrl()
        const url = base + params + `?apikey=${api_key}&offset=0`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("fetched", data)
        localStorage.setItem(key, JSON.stringify({data, timestamp: Date.now(),}))
        return data;
    } catch (error) {
        console.error(error)
    }
}

export async function fetchNews() {
    const local = JSON.parse(localStorage.getItem("news Latest"))
    if (local) {
        return local
    }
    const url = `https://newsdata.io/api/1/latest?apikey=${news_Api_key}&q=${encodeURIComponent('all latest new from india')}&country=in&language=hi
  &category=breaking,education,food,sports&prioritydomain=top`;
    const res = await fetch(url, { method: "GET" })
    const data = await res.json();
    console.log("news fetched", data)
    localStorage.setItem("news Latest", JSON.stringify(data))
    return data
}


document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
localStorage.theme = "light";
localStorage.theme = "dark";
localStorage.removeItem("theme");