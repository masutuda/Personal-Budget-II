const submitNewBudget = document.getElementById('submit-new-budget');
const submitWithdraw = document.getElementById('submit-withdraw');
const updatedEnvelopeContainer = document.getElementById('updated-envelope');

const getEnvelopeName = name => {
  const balanceIndex = name.indexOf('.....')
  const envelopeName = name.substring(0, balanceIndex - 1);
  return envelopeName;
}


// Populate drop down menu
fetch('/envelopes')
    .then(response => response.json())
    .then(budgetEnvelopes => {
        for(let i = 0; i < budgetEnvelopes.length; i++) {
            let opt = budgetEnvelopes[i].name.toUpperCase() + ` ..... $${budgetEnvelopes[i].budget}`;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            updateBudgetEnvelope.appendChild(el);
        };
        for(let i = 0; i < budgetEnvelopes.length; i++) {
          let opt = budgetEnvelopes[i].name.toUpperCase() + ` ..... $${budgetEnvelopes[i].balance}`;
          let el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          withdrawEnvelope.appendChild(el);
        };
    });


submitNewBudget.addEventListener('click', () => {
  const name = document.getElementById('updateBudgetEnvelope').value;
  const envelopeName = getEnvelopeName(name);
  const budgetAmount = document.getElementById('budgetAmount').value;

  fetch(`/envelopes/${envelopeName.toLowerCase()}?budget=${budgetAmount}`, {
    method: 'PUT',
  })
  .then(response => response.json())
  .then(({envelope}) => {
    const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<h3>Updated Envelope</h3>
        <div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelopeName}</h3>
          </div>
            <p>Max Budget: $${envelope.budget}</p>
          <div id="envelopeBottom"></div>
        </div>
        <button onclick="window.location.href='index.html';">HOME</button>`
        updatedEnvelopeContainer.appendChild(newEnvelope);
  });
});


submitWithdraw.addEventListener('click', () => {
  const name = document.getElementById('withdrawEnvelope').value;
  const envelopeName = getEnvelopeName(name);
  const withdrawAmount = document.getElementById('withdrawAmount').value;
  const recipient = document.getElementById('recipient').value.toLowerCase();

  fetch(`/envelopes/${envelopeName.toLowerCase()}?withdrawAmount=${withdrawAmount}`, {
    method: 'PUT',
  })
  .then(response => response.json())
  .then(({envelope}) => {
    fetch(`/transactions/${envelope.id}?amount=${withdrawAmount}&recipient=${recipient}`, {
      method: 'POST',
    })
    const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<h3>WITHDREW $${withdrawAmount} FROM ${envelopeName} TO ${recipient.toUpperCase()}</h3>
        <div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelopeName}</h3>
          </div>
            <p>Balance: ${envelope.balance}</p>
          <div id="envelopeBottom"></div>
        </div>
        <button onclick="window.location.href='index.html';">HOME</button>`
        updatedEnvelopeContainer.appendChild(newEnvelope);
  });
});