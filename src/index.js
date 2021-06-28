const express = require('express');
const app = express();
const port = 3001;
const { v4: uuid } = require('uuid');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});


let initialArray = [   
  { id: uuid(), tradingParty: "me", counterParty: "you", amount: -400 },   
  { id: uuid(), tradingParty: "me", counterParty: "you", amount: 500 },   
  { id: uuid(), tradingParty: "me", counterParty: "someone_else", amount: 100 }, 
];

const handleGet = (req, res) => {
    res.status(200).json({ transactions: initialArray});
};

app.get('/transactions', handleGet);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });