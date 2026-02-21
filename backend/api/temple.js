import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join( "data", "data.json");
    const data = fs.readFileSync(filePath, "utf8");
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read data" });
  }
}