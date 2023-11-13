import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Form from 'react-bootstrap/Form';
// import Badge from 'react-bootstrap/Badge';
// import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
// import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import { getError } from '../utils';
import { Store } from '../Store';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import './ProductScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`http://localhost:4000/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`http://localhost:4000/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <div class="alert alert-danger shopping-cart" role="alert">
      {error}
    </div>
  ) : (
    <div className='shopping-cart'>
      <div className='row w-100'>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className='image-here d-flex justify-content-center'>
            <img
              className="img-fluid shadow product-img"
              // width="75%"
              src={selectedImage || product.image}
              alt={product.name}
            ></img>
          </div>
        </div>
        <div className="col-12 col-md-6" md={3}>
          <ul className='list-unstyled '>
            <li className='my-3'>
              <h3 className='fw-bold'>{product.name}</h3>
            </li>
            <li className='my-3'>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </li>
            <li className='my-3'><span>Price :</span> <span className='text-muted'>${product.price}</span></li>
            {/* <li className='my-3'>
              <div className='row g-2 row-cols-md-4 row-cols-xs-1'>
                {[product.image, ...product.images].map((x) => (
                  <div className="col" key={x}>
                    <div className='card'>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </li> */}
            <li className='my-3'>
              <p><h6 className='shopping-cart'>Product details: </h6><span className='text-muted price'>{product.description}</span></p>
            </li>
          </ul>


          <div>
            <div>
              {/* <div className="d-flex justify-content-between">
                <span>
                  Price:
                </span>
                <span>
                  ${product.price}
                </span>
              </div> */}
              <div className="d-flex">
                <span className='me-3'>
                  Status:
                </span>
                <span>
                  {product.countInStock > 0 ? (
                    <span class="badge text-bg-success">In Stock</span>
                  ) : (
                    <span class="badge text-bg-danger">Out of Stock</span>
                  )}
                </span>
              </div>
            </div>
            <div className='mt-4'>
              {product.countInStock > 0 && (
                <div>
                  <button onClick={addToCartHandler} className='text-decoration-none text-light py-2 px-3 border-0 add-to-cart' style={{ background: "rgb(98 84 243)" }}>
                    ADD TO CART
                  </button>
                </div>
              )}
            </div>
          </div>







        </div>
        {/* <div className="col-12 col-md-" md={3}> */}
        {/* <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className='row'>
                    <div className="col-12 col-md-">Price:</div>
                    <div className="col-12 col-md-">${product.price}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='row'>
                    <div className="col-12 col-md-">Status:</div>
                    <div className="col-12 col-md-">
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card> */}
        {/* </div> */}
      </div>
      <div className="my-3">
        <h4 ref={reviewsRef}>Reviews</h4>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <div className="alert alert-primary" role="alert">
              There is no review
            </div>
          )}
        </div>
        <ul class="list-group">
          {product.reviews.map((review) => (
            <li class="list-group-item" key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h4>Write a customer review</h4>
              <form className="mb-3" controlId="rating">
                <label>Rating</label>
                {/* <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select> */}
                <select class="form-select" aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </select>
              </form>
              {/* <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel> */}

              <div class="form-floating">
                <textarea class="form-control mb-3" placeholder="Leave a comment here" id="floatingTextarea" value={comment}
                  onChange={(e) => setComment(e.target.value)}></textarea>
                <label for="floatingTextarea">Comments</label>
              </div>

              <div className="mb-3">
                <button disabled={loadingCreateReview} type="submit" className='btn btn-success'>
                  Submit
                </button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <div className="alert alert-info" role="alert">
              Please
              <Link to={`/signin?redirect=/product/${product.slug}`} className='mx-2'>
                Sign In
              </Link>
              to write a review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
