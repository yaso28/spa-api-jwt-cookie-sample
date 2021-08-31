import { useState, useEffect } from 'react';
import apiCall from '../services/apiCall';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await apiCall.getIndex();
        setMessage(response.data.message);
      } catch (e) {
        alert(e.message);
      }
    };
    getMessage();
  }, []);

  return (
    <>
      <h1>Home</h1>
      
      <p>{message}</p>
    </>
  );
};

export default Home;
