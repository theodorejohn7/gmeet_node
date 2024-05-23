// import express from "express";

const express = require('express');
const app = express();
// app.use(express.json());

let participants = [123];


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://gmeet-node-ls52.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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