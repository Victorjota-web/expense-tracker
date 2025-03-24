import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

const API_URL = 'https://expense-tracker-6g8z.onrender.com/api/v1/transactions';

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
      const res = await axios.get(API_URL);

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data?.data || []
      });
    } catch (err) {
      console.error('Error fetching transactions:', err);

      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || 'Failed to fetch transactions'
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || 'Failed to delete transaction'
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(API_URL, transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data?.data || {}
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || 'Failed to add transaction'
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
