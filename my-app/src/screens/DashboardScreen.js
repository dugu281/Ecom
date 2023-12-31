import React, { useContext, useEffect, useReducer } from 'react';

import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://ecom-server.vercel.app/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const summaryOrders = summary && summary.orders ? summary.orders : [];

  const numOrdered = summaryOrders[0] ? summaryOrders[0].numOrders : 0;

  const totalSales = summary && summary.orders && summary.orders[0] ? summary.orders[0].totalSales.toFixed(2) : 0;



  return (
    <div>
      <h3 className='text-center fw-bold shopping-cart'>Dashboard</h3>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div class="alert alert-danger shopping-cart" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className='row shopping-cart'>
            <div className='col-12 col-md-4 mb-2'>
              {/* <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card> */}
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Users</h5>
                  <p class="card-text text-info"> {summary.users && summary.users[0]
                    ? summary.users[0].numUsers
                    : 0}</p>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4 mb-2'>
              {/* <Card>
                <Card.Body>
                  <Card.Title>
                    {numOrdered}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card> */}

              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Orders</h5>
                  <p class="card-text text-danger">{numOrdered}</p>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4 mb-2'>
              {/* <Card>
                <Card.Body>
                  <Card.Title>
                    ${totalSales}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card> */}

              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Total Sales</h5>
                  <p class="card-text text-success">${totalSales}</p>
                </div>
              </div>
            </div>
          </div>
          
        </>
      )
      }
    </div>
  );
}
