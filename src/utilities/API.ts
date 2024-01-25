import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://random-data-api.com/api/v2/',
  headers: {
    'Content-Type': 'application/json',
  },
});
