import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiCall from '../services/apiCall';

const Point = () => {
  const { id } = useParams();
  const [point, setPoint] = useState(null);

  useEffect(() => {
    const getPoint = async (id) => {
      try {
        const response = await apiCall.getPoint(id);
        setPoint(response.data);
      } catch (e) {
        setPoint(null);
        alert(e.message);
      }
    };
    getPoint(id);
  }, [id]);

  return (
    <>
      <h1>Point</h1>

      {point &&
        <>
          <h2>{point.month}</h2>
          <table>
            <tbody>
              <tr>
                <th>Acquired</th>
                <td>{point.acquired} points</td>
              </tr>
              <tr>
                <th>Used</th>
                <td>{point.used} points</td>
              </tr>
              <tr>
                <th>Remained</th>
                <td>{point.remained} points</td>
              </tr>
            </tbody>
          </table>
        </>
      }

      <ul>
        <li><Link to={`/point/${parseInt(id) - 1}`}>Previous</Link></li>
        <li><Link to={`/point/${parseInt(id) + 1}`}>Next</Link></li>
        <li><Link to="/my-page">Back</Link></li>
      </ul>
    </>
  );
};

export default Point;
