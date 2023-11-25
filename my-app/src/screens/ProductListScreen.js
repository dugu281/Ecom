import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import { getError } from '../utils';
import './ProductListScreen.css';

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
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // console.log("Pagination",pages);

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://ecom-server.vercel.app/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) { }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Do you want to create product?')) {
      try {
        navigate(`/admin/product/create`);

      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };



  const seedHandler = async () => {
    if (window.confirm('Are you sure to create seed Products? \nData will be saved in the database. \nPlease seed data only one time!')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          'https://ecomserver-jyy1.onrender.com/seed',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Seeded successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/products`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  // const createHandler = async () => {
  //   if (window.confirm('Are you sure to create?')) {
  //     try {
  //       dispatch({ type: 'CREATE_REQUEST' });
  //       const { data } = await axios.post(
  //         'https://ecom-server.vercel.app/products',
  //         {},
  //         {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       toast.success('product created successfully');
  //       dispatch({ type: 'CREATE_SUCCESS' });
  //       navigate(`/admin/product/${data.product._id}`);
  //     } catch (err) {
  //       toast.error(getError(error));
  //       dispatch({
  //         type: 'CREATE_FAIL',
  //       });
  //     }
  //   }
  // };

  // name, slug, price, image, category, brand, countInStock, description
  // const [productName, setProductName] = useState('Sample Name');
  // const [slugName, setslugName] = useState('Sample Name');
  // const [productPrice, setProductPrice] = useState('Sample Name');
  // const [productImage, setproductImage] = useState('Sample Name');
  // const [productCategory, setProductCategory] = useState('Sample Name');
  // const [productBrand, setProductBrand] = useState('Sample Name');
  // const [productCount, setProductCount] = useState('Sample Name');
  // const [productDesc, setProductDesc] = useState('Sample Name');

  // // create product with input fields
  // const createHandler = async () => {
  //   if (window.confirm('Are you sure to create?')) {
  //     try {
  //       dispatch({ type: 'CREATE_REQUEST' });
  //       const { data } = await axios.post(
  //         'https://ecom-server.vercel.app/products',
  //         {
  //           name: productName,
  //           slug: slugName,
  //           price: productPrice,
  //           image: productImage,
  //           category: productCategory,
  //           brand: productBrand,
  //           countInStock: productCount,
  //           description: productDesc
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       toast.success('product created successfully');
  //       dispatch({ type: 'CREATE_SUCCESS' });
  //       navigate(`/admin/product/${data.product._id}`);
  //     } catch (err) {
  //       toast.error(getError(error));
  //       dispatch({
  //         type: 'CREATE_FAIL',
  //       });
  //     }
  //   }
  // };



  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`https://ecom-server.vercel.app/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className='container-fluid ProductListScreen'>
      <div className='row mb-3'>
        <div className='col'>
          <h3 className='fw-bold'>Product List</h3>
        </div>
        <div className="col text-end">
          <div>
            <button className='btn btn-secondary me-3' type="button" onClick={seedHandler}>
              Seed Products
            </button>
            <button className='btn btn-info' type="button" onClick={createHandler}>
              Create New Product
            </button>
          </div>
        </div>
      </div>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      type="button"
                      className='btn btn-secondary'
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className='btn btn-danger'
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn btn-secondary text-bold me-1' : 'btn btn-light me-1'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
