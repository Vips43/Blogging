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
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), }))
        return data;
    } catch (error) {
        console.error(error)
    }
}

export async function fetchJyotirlingaa() {
    const res = await fetch("/api/temple");
    const data = await res.json();
    const jyotirlings = data?.jyotirlings;
    const meta = data?.meta;
    const pilgrim_checklist = data?.pilgrim_checklist;
    console.log(data)
    return { pilgrim_checklist, meta, jyotirlings, data };
}
