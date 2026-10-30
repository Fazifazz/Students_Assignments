
import axios from 'axios'

const api = axios.create({
                baseURL: 'https://fakestoreapi.com', 
                timeout: 10000,                      
                // 10 second timeout
                headers: {
                'Content-Type': 'application/json',
             },
        });


export default api