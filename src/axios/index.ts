import axios from 'axios'

const  BASE_URL = 'http://localhost:4000';


export const CLIENT_API = axios.create({
    baseURL:  BASE_URL, 
    withCredentials: true,
  })