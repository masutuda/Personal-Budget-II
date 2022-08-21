const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let port = process.env.PORT;
const db = require('./queries');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);

app.get('/wallets/:id', db.getWalletById)
app.put('/wallets/:id', db.updateWalletById)
app.put('/wallets/deposit/:id', db.depositWallet)
app.get('/envelopes', db.getEnvelopes)
app.get('/envelopes/:name', db.getEnvelopeByName)
app.post('/envelopes', db.addEnvelope)
app.put('/envelopes/:name', db.updateEnvelope)
app.put('/envelopes/add/:name', db.addToEnvelope)
app.put('/envelopes/:from/:to', db.transferEnvelope)
app.delete('/envelopes/:name', db.deleteEnvelope)
app.get('/transactions', db.getTransactions)
app.post('/transactions/:envelopeId', db.addTransaction)
app.put('/transactions/:id', db.updateTransaction)
app.delete('/transactions/:id', db.deleteTransaction)


app.use(express.static('public'));

if (port == null || port == "") {
  port = 5000;
}
app.listen(port, () => console.log(`Listening on port: ${port}...`));

