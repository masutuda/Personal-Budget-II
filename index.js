const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
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
app.put('/transactions/:envelopeId', db.addTransaction)


app.use(express.static('public'));


app.listen(port, () => console.log(`Listening on port: ${port}...`));

