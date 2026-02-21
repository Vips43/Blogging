// import fs from "fs";
// import path from "path";

// export default function handler(req, res) {
//   try {
//     const filePath = path.join( process.cwd(),"data", "data.json");
//     const data = fs.readFileSync(filePath, "utf8");
//     res.status(200).json(JSON.parse(data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to read data" });
//   }
// }

import jsonData from '../data/data.json';

export default function handler(req, res) {
  try {
    res.status(200).json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read data" });
  }
}
