import api from '../api/axiosInstance'
import { useState, useEffect } from 'react';

function useRecipes(url) 
{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        if (!url) {
            setLoading(false);
            return;
        }      
        let cancelled = false;  
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                    const response = await api.get(url);
                    if(!cancelled) 
                        setData(response.data);
                } 
            catch (err) {
                    if (!cancelled) 
                        setError(err.response?.data?.message || err.message || 'Fetch failed.');
                } 
            finally {
                    if (!cancelled) 
                        setLoading(false);
                }
        }
        fetchData();
        return () => { cancelled = true; }; // cleanup on unmount
    }, [url]); 

    // console.log(data)
    // console.log(loading)
    // console.log(error)
    return { data, loading, error };
}

export default useRecipes