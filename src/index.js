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

const handleAdd = (req, res) => {
  initialArray.push({ ...req.body, id: uuid() });

  res.status(200).json({ transactions: initialArray});
};

const handleCompress = (req, res) => {
  const compressedArray = initialArray.reduce((acc, item) => {
    const existTransaction = acc.find(trans => {
      return trans.tradingParty === item.tradingParty
        && trans.counterParty === item.counterParty;
     });

     const existReversedTransaction = acc.find(trans => {
      return trans.tradingParty === item.counterParty
        && trans.counterParty === item.tradingParty;
     });

     if(existReversedTransaction) {
       const filteredArray = acc.filter(item => item.id !== existReversedTransaction.id);
       const uniteTrans = {         
        id: uuid(),
      };
       
      if(existReversedTransaction.amount !== item.amount) {
        if(existReversedTransaction.amount > item.amount) {
          uniteTrans.tradingParty = existReversedTransaction.tradingParty;
          uniteTrans.counterParty = existReversedTransaction.counterParty;
          uniteTrans.amount = existReversedTransaction.amount - item.amount;
        } else {
          uniteTrans.tradingParty = item.tradingParty;
          uniteTrans.counterParty = item.counterParty;
          uniteTrans.amount = item.amount - existReversedTransaction.amount;
        }

         filteredArray.push(uniteTrans);
      }

      return filteredArray;
     }

     if(existTransaction) {
       const filteredArray = acc.filter(item => item.id !== existTransaction.id);
       const uniteTrans = {
        tradingParty: existTransaction.tradingParty,
        counterParty: existTransaction.counterParty, 
        amount: existTransaction.amount + item.amount,
        id: uuid(),
       }

       filteredArray.push(uniteTrans);

       return filteredArray;
     }
     
     acc.push(item);

     return acc;

  }, []);

  initialArray = compressedArray;
  res.status(200).json({ transactions: compressedArray || initialArray});
};



app.get('/transactions', handleGet);
app.post('/transactions', handleAdd);
app.post('/transactions/compress', handleCompress);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });