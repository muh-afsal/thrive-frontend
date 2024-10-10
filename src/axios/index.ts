import axios from 'axios'

const BASE_URL = 'http://localhost:4000/api';

export const CLIENT_API = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true,
})


CLIENT_API.interceptors.request.use(
    function (config) {
    //   console.log(config,'interseptor confid)))))))))))))))))))))))');
      
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

