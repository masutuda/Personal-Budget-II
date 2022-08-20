const fetchAllButton = document.getElementById('fetch-envelopes');
const fetchByEnvelopeButton = document.getElementById('fetch-by-envelope');
const distributeButton = document.getElementById('distribute-funds');
const addToWalletButton = document.getElementById('add-wallet-funds');

const envelopeContainer = document.getElementById('envelope-container');
const walletContainer = document.getElementById('walletContainer');
const distributeContainer = document.getElementById('distributeContainer');

const setDistributionAmount = () => {
  let totalBudgetRequired = 0;
  fetch('/envelopes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    for(let i = 0; i < response.length; i++){
      totalBudgetRequired += Number(response[i].budget);
    }
    fetch(`/wallets/1?distribution=${totalBudgetRequired}`, {
      method: 'PUT',
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
  })
}

const renderWallet = () => {
  setDistributionAmount();
  walletContainer.innerHTML = '';
  
  fetch('/wallets/1')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
  .then(response => {
    const newEnvelope = document.createElement('div');
    newEnvelope.className = 'single-envelope';
    newEnvelope.innerHTML = 
      `<div id="envelopeHolder">
        <div id="envelopeTop">
          <h3>Wallet</h3>
        </div>
          <p>Balance: $${response[0].balance}</p>
          <p>Distribution Amount: $${response[0].distribution}</p>
        <div id="envelopeBottom"></div>
      </div>`
    walletContainer.appendChild(newEnvelope);
  })
}

const renderError = response => {
  envelopeContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderEnvelopes = (envelopes = []) => {
  envelopeContainer.innerHTML = '';
  if (envelopes.length > 0) {
    envelopes.forEach(envelope => {
      const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelope.name.toUpperCase()}</h3>
          </div>
            <p>Max Budget: $${envelope.budget}</p>
            <p>Balance: $${envelope.balance}</p>
          <div id="envelopeBottom"></div>
        </div>`
      envelopeContainer.appendChild(newEnvelope);
    });
  } else if (typeof envelopes === 'object'){
      const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelopes.envelopeName}</h3>
          </div>
            <p>Max Budget: $${envelopes.maxBudgetByAmount}</p>
            <p>Balance: $${envelopes.amountLeft}</p>
          <div id="envelopeBottom"></div>
        </div>`
      envelopeContainer.appendChild(newEnvelope);
  } else {
    envelopeContainer.innerHTML = '<p>You have no envelopes!</p>';
  } 
}

fetchAllButton.addEventListener('click', () => {
  fetch('/envelopes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderEnvelopes(response);
  });
});

fetchByEnvelopeButton.addEventListener('click', () => {
  const envelopeName = document.getElementById('envelopeName').value;
  fetch(`/envelopes/${envelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderEnvelopes(response);
  });
});

addToWalletButton.addEventListener('click', () => {
  const amountToAdd = document.getElementById('amountToAdd').value;
  fetch(`/wallets/deposit/1?amount=${amountToAdd}`, {
    method: 'PUT',
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderWallet();
  });
});

// Distribute maximum budget to each envelope from wallet
distributeButton.addEventListener('click', () => {
  let balance = 0;
  let distribution = 0;
  
  fetch('/wallets/1')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
  .then(response => {
    balance = Number(response[0].balance);
    distribution = Number(response[0].distribution);
    if (balance >= distribution){
        fetch('/envelopes')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            renderError(response);
          }
        })
        .then(response => {
          for(let i = 0; i < response.length; i++){
            fetch(`/envelopes/add/${response[i].name}?`, {
              method: 'PUT',
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                renderError(response);
              }
            })
          }
          fetch(`/wallets/deposit/1?amount=-${distribution}`, {
            method: 'PUT',
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              renderError(response);
            }
          })
          .then(response => {
            renderWallet();
            walletContainer.innerHTML = `You deposited ${distribution} into your envelopes`;
          });
          
        })
        
    } else {
        walletContainer.innerHTML = 'Not Enough Funds';
    }
  });
 });

