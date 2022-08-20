const submitButton = document.getElementById('submit-transfer');
const updatedEnvelopeContainer = document.getElementById('updated-envelope');

const selectEnvelopeFrom = document.getElementById("selectEnvelopeFrom");
const selectEnvelopeTo = document.getElementById("selectEnvelopeTo");

// Populate drop down menu
fetch('/envelopes')
    .then(response => response.json())
    .then(budgetEnvelopes => {
        for(let i = 0; i < budgetEnvelopes.length; i++) {
            let opt = budgetEnvelopes[i].name.toUpperCase() + ` ..... $${budgetEnvelopes[i].balance}`;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            selectEnvelopeFrom.appendChild(el);
        };
    });

fetch('/envelopes')
.then(response => response.json())
.then(budgetEnvelopes => {
    for(let i = 0; i < budgetEnvelopes.length; i++) {
        let opt = budgetEnvelopes[i].name.toUpperCase() + ` ..... $${budgetEnvelopes[i].balance}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectEnvelopeTo.appendChild(el);
    };
});


submitButton.addEventListener('click', () => {
  const fromEnvelopeName = document.getElementById('selectEnvelopeFrom').value.toLowerCase();
  const toEnvelopeName = document.getElementById('selectEnvelopeTo').value.toLowerCase();
  const transferAmount = Number(document.getElementById('transferAmount').value);
  
  fetch(`/envelopes/${fromEnvelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(fromEnvelope => {
     if(fromEnvelope[0].balance >= transferAmount && transferAmount > 0) {
        fetch(`/envelopes/${fromEnvelopeName}/${toEnvelopeName}?amount=${transferAmount}`, {
            method: 'PUT',
          })
          .then(response => response.json())
          .then(envelope => {
            console.log(envelope)
            const newEnvelope = document.createElement('div');
              newEnvelope.className = 'single-envelope';
              newEnvelope.innerHTML = 
                `<h3>Updated Envelope</h3>
                <div id="envelopeHolder">
                  <div id="envelopeTop">
                    <h3>${envelope.name.toUpperCase()}</h3>
                  </div>
                    <p>Balance: $${envelope.balance}</p>
                  <div id="envelopeBottom"></div>
                </div>
                <button onclick="window.location.href='index.html';">HOME</button>`
                updatedEnvelopeContainer.appendChild(newEnvelope);
          });
     } else if (transferAmount > 0) {
        updatedEnvelopeContainer.innerHTML = 'Not Enough Funds To Transfer'
     } else {
        updatedEnvelopeContainer.innerHTML = 'Minimum Transfer Amount is $1'
     }
  });

  
});