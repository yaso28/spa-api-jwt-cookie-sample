import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiCall from '../services/apiCall';

const MyPage = () => {
  const [pointList, setPointList] = useState([]);

  useEffect(() => {
    const getPointList = async () => {
      try {
        const response = await apiCall.getPointList();
        setPointList(response.data);
      } catch (e) {
        alert(e.message);
      }
    };
    getPointList();
  }, []);

  return (
    <>
      <h1>MyPage</h1>

      <h2>Points</h2>
      <ul>
        {pointList.map((pointRow) =>
          <li key={pointRow.id}>
            <Link to={`/point/${pointRow.id}`}>{pointRow.month}</Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default MyPage;
