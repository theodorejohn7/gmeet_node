// import express from "express";

const express = require('express');
const app = express();
app.use(express.json());

let participants = [123];

app.post("/participants", (req, res) => {
  participants = req.body.participants;
  console.log("Received participants:", participants); // Add this line to debug
  res.sendStatus(200);
});

app.get("/participants", (req, res) => {
  console.log("get called");
  res.json(participants);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});