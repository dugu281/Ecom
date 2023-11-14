import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


  Axios.defaults.withCredentials = true;
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        'https://ecom-server.vercel.app/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div className='shopping-cart'>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      {/* <Helmet>
        <title>Preview Order</title>
      </Helmet> */}
      <h3 className="my-3 fw-bold">Preview Order</h3>
      <div className="row">
        <div className="col-12 col-md-8">
          {/* <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card> */}


          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Shipping</h5>
              <p><span className='fw-semibold'>Username:  </span>{cart.shippingAddress.fullName}</p>
              <p>
                <span className='fw-semibold'>Address: </span>
                {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </p>

              <Link to="/shipping" className='btn btn-success'>Edit</Link>
            </div>
          </div>






          {/* 


          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card> */}




          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Payment</h5>
              <p><span className='fw-semibold'>Method:  </span>{cart.paymentMethod}</p>

              <Link to="/payment" className='btn btn-success'>Edit</Link>
            </div>
          </div>










          {/* 
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <div className="row align-items-center">
                      <div className="col-12 col-md-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="col-12 col-md-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="col-12 col-md-3">${item.price}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card> */}



          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Items</h5>
              {/* <hr /> */}
              <div class="card border-0">
                <ul class="list-group list-group-flush list-unstyled">

                  {cart.cartItems.map((item) => (
                    <li key={item._id}>
                      <div className="row align-items-center">
                        <div className="col-12 col-md-6">

                          <Link to={`/product/${item.slug}`} className='text-decoration-none'><img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail border-dark p-0"
                          />
                            {' '}
                            {item.name}
                          </Link>
                        </div>
                        <div className="col-12 col-md-3">
                          <span>{item.quantity}</span>
                        </div>
                        <div className="col-12 col-md-3">${item.price}</div>
                      </div>
                      <hr />
                    </li>
                  ))}

                </ul>
              </div>
            </div>
          </div>




        </div>
        <div className="col-12 col-md-4">
          {/* <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="row">
                    <div className='col'>Items</div>
                    <div className='col'>${cart.itemsPrice.toFixed(2)}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <div className='col'>Shipping</div>
                    <div className='col'>${cart.shippingPrice.toFixed(2)}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <div className='col'>Tax</div>
                    <div className='col'>${cart.taxPrice.toFixed(2)}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <div className='col'>
                      <strong> Order Total</strong>
                    </div>
                    <div className='col'>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card> */}



          <div class="card mb-3 rounded-0 border-2 border-success">
            <div class="card-header text-center">
              <h5 className='fw-semibold'>Order Summary</h5>
            </div>
            <ul class="list-group list-group-flush list-unstyled">
              <li className="list-group-item d-flex justify-content-between">
                <span>
                  Subtotal:
                </span>
                <span>
                  ${cart.itemsPrice.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>
                  Shipping:
                </span>
                <span className='text-success'>
                  Free
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>
                  Tax:
                </span>
                <span>
                  ${cart.taxPrice.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>
                  Total:
                </span>
                <span>
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </li>
              <li className='p-2'>
                <div className="d-flex justify-content-center p-2">
                  <button
                    type="button"
                    onClick={placeOrderHandler}
                    disabled={cart.cartItems.length === 0}
                    className='btn btn-success text-light rounded-0'
                  >
                    PLACE ORDER
                  </button>
                </div>
                {loading && <LoadingBox></LoadingBox>}


              </li>
            </ul>
          </div>








        </div>
      </div>
    </div>
  );
}
