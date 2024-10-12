const express = require('express');
const pool = require('./db');
var cors = require('cors');

const app = express ();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));

app.get("/status", (request, response) => {
  const status = {
     "Status": "Running"
  };
  
  response.send(status);
});

// Create endpoints for creating and listing messages here

app.get("/messages", async (request, response) => {
  try {
    const getQueryString = 'SELECT * FROM public."Message"';
    const {rows} = await pool.query(getQueryString);
    response.status(200).json(rows);
  }
  catch(e) {
    console.log(e, 'e')
    response.status(500).send('Error occurred while sending the message');
  }
});

app.post("/send-message", async (request, response) => {
  try {
    const {
      message,
      phoneNumber
    } = request.body;

    let timestamp = new Date();
  
    const postQueryString = 'INSERT INTO public."Message"(recipient_phone, message_body, timestamp) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(postQueryString, [phoneNumber, message, timestamp]);
    response.status(200).json(rows[0]);
  }
  catch(e) {
    console.log(e, 'e')
    response.status(500).send('Error occurred while sending the message');
  }

});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
