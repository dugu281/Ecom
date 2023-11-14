import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import './Product.css';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`http://localhost:4000/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    // <Card>
    //   <Link to={`/product/${product.slug}`}>
    //     <img src={product.image} className="card-img-top" alt={product.name} />
    //   </Link>
    //   <Card.Body>
    //     <Link to={`/product/${product.slug}`}>
    //       <Card.Title>{product.name}</Card.Title>
    //     </Link>
    //     <Rating rating={product.rating} numReviews={product.numReviews} />
    //     <Card.Text>${product.price}</Card.Text>
    //     {product.countInStock === 0 ? (
    //       <Button variant="light" disabled>
    //         Out of stock
    //       </Button>
    //     ) : (
    //       <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
    //     )}
    //   </Card.Body>

    <div class="card bg-light product-card">
      <Link to={`/product/${product.slug}`}>
        <img class="top"
          src={product.image}
          className="card-img-top" alt={product.name} />
      </Link>
      <div class="card-body">
        <Link to={`/product/${product.slug}`} className='text-decoration-none text-dark'>
          <h5 class="card-title product-name">{product.name}</h5>
        </Link>
        <h6 class="text-muted text-semibold price">${product.price}.00</h6>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        {product.countInStock === 0 ? (
          <button disabled className='mt-2 btn btn-light border-1 border-secondary rounded-0 px-3 add-to-cart'>
            Out of stock
          </button>
        ) : (
          <button onClick={() => addToCartHandler(product)} className='mt-2 btn btn-secondary border-0 rounded-0 px-3 add-to-cart'>ADD TO CART</button>
        )}
      </div>
    </div>





    // {/* </Card> */ }
  );
}
export default Product;
