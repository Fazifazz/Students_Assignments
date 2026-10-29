
import axios from 'axios'

const api = axios.create({
                baseURL: 'https://dummyjson.com', // prepended to all requests
                timeout: 10000,                      
                // 10 second timeout
                headers: {
                'Content-Type': 'application/json',
             },
        });


export default api