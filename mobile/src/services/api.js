import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bbethehero.herokuapp.com'
})

export default api;
