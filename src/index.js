const express = require('express')
const app = express()
const port = 3011

app.get('/transactions', (req, res) => {
    res.json({ transactions: [   
    { tradingParty: "me", counterparty: "you", amount: -400 },   
    { tradingParty: "me", counterparty: "you", amount: 500 },   
    { tradingParty: "me", counterparty: "someone_else", amount: 100 }, 
  ]})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})