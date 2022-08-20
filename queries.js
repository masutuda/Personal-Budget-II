const { response } = require('express');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'tester',
  host: 'localhost',
  database: 'personalbudgetdb',
  password: 'tester',
  port: 5432,
});

const getWalletById = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM wallets WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    };
    response.status(200).json(results.rows);
  })
}

const updateWalletById = (request, response) => {
  const id = request.params.id
  const distribution = request.query.distribution
  pool.query('UPDATE wallets SET distribution = $1 WHERE id = $2', [distribution, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const depositWallet = (request, response) => {
  const id = request.params.id
  const amount = request.query.amount

  pool.query('UPDATE wallets SET balance = balance + $1 WHERE id = $2', [amount, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getEnvelopes = (request, response) => {
  pool.query('SELECT * FROM envelopes ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    };
    response.status(200).json(results.rows);
  });
};

const getEnvelopeByName = (request, response) => {
  const name = request.params.name

  pool.query('SELECT * FROM envelopes WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addEnvelope = (request, response) => {
  const name = request.query.name;
  const budget = request.query.budget;
  const balance = request.query.balance;

  pool.query('INSERT INTO envelopes (name, budget, balance) VALUES ($1, $2, $3)', [name, budget, balance], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send({
      envelope: request.query
    })
  })
}

const updateEnvelope = (request, response) => {
  const name = request.params.name;
  const budget = request.query.budget;
  const withdrawAmount = request.query.withdrawAmount;

  if (budget) {
    pool.query('UPDATE envelopes SET budget = $1 WHERE name = $2', [budget, name], (error, results) => {
      if (error) {
        throw error
      }
      request.query.budget = budget;
      response.status(200).send(
        {
        envelope: request.query
        })
    })
  }

  if (withdrawAmount) {
    pool.query('UPDATE envelopes SET balance = balance - $1 WHERE name = $2 RETURNING *', [withdrawAmount, name], (error, results) => {
      if (error) {
        throw error
      }
      pool.query('SELECT balance, id FROM envelopes WHERE name = $1', [name], (error, results) => {
        if (error) {
          throw error
        }
        request.query.balance = results.rows[0].balance;
        request.query.id = results.rows[0].id
        response.status(200).send({
          envelope: request.query
        });
      })
    })
  }
}

const addToEnvelope = (request, response) => {
    const name = request.params.name;
    pool.query('UPDATE envelopes SET balance = balance + budget WHERE name = $1', [name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const deleteEnvelope = (request, response) => {
  const name = request.params.name;

  pool.query('SELECT balance, wallet_id from envelopes WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
    const leftover = results.rows[0].balance;
    const walletId = results.rows[0].wallet_id;

    pool.query('DELETE FROM envelopes WHERE name = $1', [name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send();
    })
    pool.query('UPDATE wallets SET balance = balance + $1 WHERE id = $2', [leftover, walletId], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send();
    })
  })
}

const transferEnvelope = (request, response) => {
  const fromEnvelope = request.params.from;
  const toEnvelope = request.params.to;
  const amount = request.query.amount;

  pool.query('UPDATE envelopes SET balance = balance - $1 WHERE name = $2', [amount, fromEnvelope], (error, results) => {
    if (error) {
      throw error
    }
  })

  pool.query('UPDATE envelopes SET balance = balance + $1 WHERE name = $2 RETURNING *', [amount, toEnvelope], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows[0]);
  })
}
const getTransactions = (request, response) => {
  pool.query('SELECT * FROM transactions ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    };
    response.status(200).json(results.rows);
  });
}

const addTransaction = (request, response) => {
  const envelopeId = request.params.envelopeId;
  const date = new Date();
  const amount = request.query.amount;
  const recipient = request.query.recipient;

  pool.query('INSERT INTO transactions (date, amount, recipient, envelope_id) VALUES ($1, $2, $3, $4)', [date, amount, recipient, envelopeId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send();
  })
}

const updateTransaction = (request, response) => {
  const id = request.params.id;
  const newAmount = request.query.newAmount;
  const newRecipient = request.query.newRecipient;

  pool.query('SELECT amount, envelope_id FROM transactions WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    
    const envelopeId = results.rows[0].envelope_id;

    if (newAmount) {
      const difference = newAmount - results.rows[0].amount;
      pool.query('UPDATE transactions SET amount = $1 WHERE id = $2', [newAmount, id], (error, results) => {
        if (error) {
          throw error
        }
        pool.query('UPDATE envelopes SET balance = balance - $1 WHERE id = $2', [difference, envelopeId], (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).send();
        })
      })
    }
  
    if (newRecipient) {
      pool.query('UPDATE transactions SET recipient = $1 WHERE id = $2', [newRecipient, id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send();
      })
    }
  })
}

const deleteTransaction = (request, response) => {
  const id = request.params.id;

  pool.query('SELECT amount, envelope_id from transactions WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    const leftover = results.rows[0].amount;
    const envelopeId = results.rows[0].envelope_id;

    pool.query('DELETE FROM transactions WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send();
    })
    pool.query('UPDATE envelopes SET balance = balance + $1 WHERE id = $2', [leftover, envelopeId], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send();
    })
  })
}

module.exports = {
  getWalletById,
  updateWalletById,
  depositWallet,
  getEnvelopes,
  getEnvelopeByName,
  addEnvelope,
  updateEnvelope,
  addToEnvelope,
  deleteEnvelope,
  transferEnvelope,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
}