const express = require('express');
const app = express();
app.use(express.json());

let participants = [123];

const allowedOrigins = [
  'https://meet.google.com',
  'https://hz65v3.csb.app',
  'https://gmeet-fe.vercel.app/'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post("/participants", (req, res) => {
  participants = req.body.participants;
  console.log("Received participants:", participants); // Debugging log
  res.sendStatus(200);
});

app.get("/participants", (req, res) => {
  console.log("GET /participants called");
  res.json(participants);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
