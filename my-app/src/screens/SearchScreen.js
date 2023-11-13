import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
// import { Helmet } from 'react-helmet-async';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
// import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
// import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 - 100',
    value: '1-100',
  },
  {
    name: '$101 - 200',
    value: '101-200',
  },
  {
    name: '$201 - 1000',
    value: '201-1000',
  },
  {
    name: 'Above $1000',
    value: '1000-200000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${skipPathname ? '' : '/search?'
      }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div className='price'>
      {/* <Helmet>
        <title>Search Products</title>
      </Helmet> */}
      <div className="row">
        <div className="col-12 col-md-3">
          <h5 className='fw-bold'>Categories</h5>
          <div>
            <ul className='list-unstyled lh-base'>
              <li>
                <Link
                  className={'all' === category ? 'text-primary text-decoration-none fw-bold' : 'text-muted text-decoration-none'}
                  // style={{ textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
                  to={getFilterUrl({ category: 'all' })}
                >
                  All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-primary text-decoration-none fw-bold' : 'text-muted text-decoration-none'}
                    // style={{ textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className='fw-bold'>Price</h5>
            <ul className='list-unstyled'>
              <li>
                <Link
                  className={'all' === price ? 'text-primary text-decoration-none fw-bold' : 'text-muted text-decoration-none'}
                  // style={{ textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
                  to={getFilterUrl({ price: 'all' })}
                >
                  All
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-primary text-decoration-none fw-bold' : 'text-muted text-decoration-none'}
                  // style={{ textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className='fw-bold'>Avg. Customer Review</h5>
            <ul className='list-unstyled'>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-danger text-bold' : 'text-decoration-none'}
                  // style={{ textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-danger' : ' text-decoration-none'}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
              <li>
                {query !== 'all' ||
                  category !== 'all' ||
                  rating !== 'all' ||
                  price !== 'all' ? (
                  <button
                    className='btn rounded-0 mt-3 border-0 px-3 py-2 fw-semibold'
                    style={{ backgroundColor: "#ec7063" }}
                    onClick={() => navigate('/search')}
                  >
                    Clear Filters
                  </button>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-9">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
              <div className="row justify-content-between mb-3">
                <div className="col-12 col-md-6">
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} {countProducts === 1 ? 'Result' : 'Results'}
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price : ' + price}
                    {rating !== 'all' && ' : Rating : ' + rating + ' & up'}
                    {/* {query !== 'all' ||
                      category !== 'all' ||
                      rating !== 'all' ||
                      price !== 'all' ? (
                      <button
                        className='btn btn-danger rounded-0'
                        style={{ backgroundColor: "#ec7063" }}
                        onClick={() => navigate('/search')}
                      >
                        Clear Filters
                      </button>
                    ) : null} */}
                  </div>
                </div>
                <div className="col text-end">
                  Sorted By :
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                    className='py-1 px-3 bg-light rounded-2'
                  >
                    <option value="newest">Newest First</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Reviews</option>
                  </select>
                </div>
              </div>

              {products.length === 0 && (
                <div className="alert alert-primary" role="alert">
                  No Product Found
                </div>
              )}

              <div className="row">
                {products.map((product) => (
                  <div className="col-12 col-sm-6 col-lg-4 mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
              </div>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <button
                      className={Number(page) === x + 1 ? 'btn btn-secondary text-bold me-1' : 'btn btn-light me-1'}
                      variant="light"
                    >
                      {x + 1}
                    </button>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

