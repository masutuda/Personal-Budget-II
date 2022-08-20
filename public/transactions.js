const submitUpdateAmountButton = document.getElementById('submit-updateAmount');
const submitUpdateRecipientButton = document.getElementById('submit-updateRecipient');
const submitDeleteTransactionButton = document.getElementById('submit-deleteTransaction');
const transactionContainer = document.getElementById('transactions');

const selectTransaction = document.getElementById("selectTransaction");

// Populate drop down menu
const populateMenu = () => {
  fetch('/transactions')
      .then(response => response.json())
      .then(transactions => {
          for(let i = 0; i < transactions.length; i++) {
              let opt = transactions[i].id;
              let el = document.createElement("option");
              el.textContent = opt;
              el.value = opt;
              selectTransaction.appendChild(el);

              const newEnvelope = document.createElement('div');
                newEnvelope.innerHTML = 
                    `<p>Transaction ID: ${transactions[i].id} ... Date: ${transactions[i].date.substring(0,10)} ... Amount: $${transactions[i].amount} ... Recipient: ${transactions[i].recipient.toUpperCase()}</p>`
                    transactionContainer.appendChild(newEnvelope);
          };
      });
};

populateMenu();

submitDeleteTransactionButton.addEventListener('click', () => {
  const transactionId = document.getElementById('selectTransaction').value;
  fetch(`/transactions/${transactionId}`, {
    method: 'DELETE',
  })
  .then(response => {
    const newEnvelope = document.createElement('div');
      newEnvelope.innerHTML = 
        `<p>Deleted Transaction ID: ${transactionId} </p>`
        transactionContainer.appendChild(newEnvelope);
  });
});

submitUpdateAmountButton.addEventListener('click', () => {
    const transactionId = document.getElementById('selectTransaction').value;
    const newAmount = document.getElementById('updateAmount').value;
    fetch(`/transactions/${transactionId}?newAmount=${newAmount}`, {
      method: 'PUT',
    })
    .then(response => {
      const newEnvelope = document.createElement('div');
        newEnvelope.innerHTML = 
          `<p>Updated Transaction ID: ${transactionId} with new Amount: $${newAmount} </p>`
          transactionContainer.appendChild(newEnvelope);
    });
});

submitUpdateRecipientButton.addEventListener('click', () => {
    const transactionId = document.getElementById('selectTransaction').value;
    const newRecipient = document.getElementById('updateRecipient').value;
    fetch(`/transactions/${transactionId}?newRecipient=${newRecipient}`, {
      method: 'PUT',
    })
    .then(response => {
      const newEnvelope = document.createElement('div');
        newEnvelope.innerHTML = 
          `<p>Updated Transaction ID: ${transactionId} with new Recipient: ${newRecipient} </p>`
          transactionContainer.appendChild(newEnvelope);
    });
});