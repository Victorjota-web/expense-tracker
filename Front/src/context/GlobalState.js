import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

const API_URL = process.env.REACT_APP_API_URL + '/api/transactions';

const initialState = {
  transactions: [],
  error: null,
  loading: true
};


export const GlobalContext = createContext(initialState);


export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);


  async function getTransactions() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: data || []
      });
    } catch (err) {
      console.error('Erro ao buscar transações:', err);

      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: 'Falha ao buscar transações'
      });
    }
  }


  async function deleteTransaction(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: 'Falha ao deletar transação'
      });
    }
  }

  
  async function addTransaction(transaction) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      });

      const data = await res.json();

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: data || {}
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: 'Falha ao adicionar transação'
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
