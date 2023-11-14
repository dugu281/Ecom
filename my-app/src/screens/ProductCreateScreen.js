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

export default function ProductCreateScreen() {
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
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const { data } = await axios.get(`https://ecom-server.vercel.app/products/admin?page=${page} `, {
    //                 headers: { Authorization: `Bearer ${userInfo.token}` },
    //             });

    //             dispatch({ type: 'FETCH_SUCCESS', payload: data });
    //         } catch (err) { }
    //     };

    //     if (successDelete) {
    //         dispatch({ type: 'DELETE_RESET' });
    //     } else {
    //         fetchData();
    //     }
    // }, [page, userInfo, successDelete]);

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


    // const [productImage, setproductImage] = useState({ preview: '', data: '' });






    const [productName, setProductName] = useState('');
    const [slugName, setslugName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    // const [productImage, setproductImage] = useState('Sample Name');
    const [image, setImage] = useState({ preview: '', data: '' });
    const [productCategory, setProductCategory] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [productCount, setProductCount] = useState('');
    const [productDesc, setProductDesc] = useState('');


    // const [isLoading, setIsLoading] = useState(false);



    // function to upload image
    const handleFileSelect = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0]
        }
        setImage(img);
    }

    // function to upload image
    const handleImgUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', image.data);

        // setIsLoading(true);
        const response = axios.post(`http://localhost:4000/uploadProfilePic`, formData);
        // setIsLoading(false);
        return response;
    }





    // create product with input fields
    const createHandler = async (e) => {
        e.preventDefault();
        if (image.preview === '') {
            toast.warn('Image mandatory!', {
                position: "top-center",
                autoClose: 3000,
            });
            return
        }
        if (window.confirm('Please check details before proceed?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const imgRes = await handleImgUpload();
                const { data } = await axios.post(
                    'https://ecom-server.vercel.app/products',
                    {
                        name: productName,
                        slug: slugName,
                        price: productPrice,
                        image: `http://localhost:4000/files/${imgRes.data.fileName}`,
                        category: productCategory,
                        brand: productBrand,
                        countInStock: productCount,
                        description: productDesc
                    },
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                toast.success('product created successfully');
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



    // const deleteHandler = async (product) => {
    //     if (window.confirm('Are you sure to delete?')) {
    //         try {
    //             await axios.delete(`https://ecom-server.vercel.app/products/${product._id}`, {
    //                 headers: { Authorization: `Bearer ${userInfo.token}` },
    //             });
    //             toast.success('product deleted successfully');
    //             dispatch({ type: 'DELETE_SUCCESS' });
    //         } catch (err) {
    //             toast.error(getError(error));
    //             dispatch({
    //                 type: 'DELETE_FAIL',
    //             });
    //         }
    //     }
    // };

    return (
        <div className="container shopping-cart">
            <h3 className="my-3 text-center">Create Product</h3>
            <div className=' justify-content-center row'>
                <form onSubmit={createHandler} className='col-12 col-md-8 col-lg-8'>

                    <div class="row mb-3">
                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="name">
                            <label>Product Name</label>
                            <input
                                class="form-control bg-light"
                                placeholder="product name"
                                aria-label="name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                        </div>
                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="slug">
                            <label>Slug</label>
                            <input
                                class="form-control bg-light"
                                placeholder="unique_name_without_space"
                                aria-label="slug"
                                value={slugName}
                                onChange={(e) => setslugName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="price">
                            <label>Price</label>
                            <input
                                type='number'
                                class="form-control bg-light"
                                placeholder="price"
                                aria-label="price"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="image">
                            <label>Category</label>
                            <input
                                class="form-control bg-light"
                                placeholder="category"
                                aria-label="category"
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                                required
                            />
                        </div>







                        {/* <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="image">
                            <label>Category</label>
                            <input
                                class="form-control bg-light"
                                placeholder="category"
                                aria-label="category"
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                                required
                            />
                        </div> */}
                    </div>




                    <div class="row mb-3">
                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="brand">
                            <label>Brand</label>
                            <input
                                class="form-control bg-light"
                                placeholder="brand"
                                aria-label="brand"
                                value={productBrand}
                                onChange={(e) => setProductBrand(e.target.value)}
                                required
                            />
                        </div>
                        <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="stockCount">
                            <label>Count In Stock</label>
                            <input
                                type='number'
                                class="form-control bg-light"
                                placeholder="count"
                                aria-label="count"
                                value={productCount}
                                onChange={(e) => setProductCount(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    <div class="row mb-3">
                        <div class="col-12 col-12 mb-3" controlId="description">
                            <label>Description</label>
                            {/* <input
                                class="form-control bg-light"
                                placeholder="description"
                                aria-label="description"
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                                required
                            /> */}

                            <textarea
                                class="form-control bg-light"
                                placeholder="describe your product details here..."
                                aria-label="description"
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div class="row mb-3">
                            <label>Upload Image</label>

                            <div className='text-primary col-md-6 col-12 mb-3 col-lg-6' onChange={handleFileSelect}>
                                <div>
                                    <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" required />
                                </div>


                                {image.preview && (
                                    <img src={image.preview} width='100%' alt='commentIMG' height='100%' className='img-fluid border border-2 border-dark rounded mt-3' />
                                )}
                            </div>

                            <div className="alert alert-info col-md-6 col-12 mb-3 col-lg-6" role="alert" >
                                <span className='text-muted'>Note: Image should be of size less that 10mb.</span>
                            </div>
                            {/* {isLoading && <LoadingBox></LoadingBox>} */}
                        </div>
                    </div>
                    <div className="mb-3">
                        <button className='btn btn-info' type="submit" onClick={createHandler}>
                            Create Product
                        </button>
                        {loadingCreate && <LoadingBox></LoadingBox>}
                    </div>

                </form>





                {/* <form class="row mb-3" onSubmit={uploadProductPic}>
                    <div class="row" controlId="price">
                        <label>Upload Image</label>

                        <div className='text-primary col-md-6 col-12 mb-3 col-lg-6' onChange={handleFileSelect}>
                            <div>
                                <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" required />
                            </div>


                            {image.preview && (
                                <img src={image.preview} width='100%' alt='commentIMG' height='100%' className='img-fluid border border-2 border-dark rounded mt-3' />
                            )}
                        </div>

                        <div className="alert alert-info col-md-6 col-12 mb-3 col-lg-6" role="alert" style={{ fontSize: "14px" }}>
                            <span className='text-muted'>Note: Image should be of size less that 10mb.</span>
                        </div>
                        {loadingUpload && <LoadingBox></LoadingBox>}
                    </div>
                    <div>
                    </div>
                    <button type='submit' className='btn btn-dark'>Upload Photo</button>
                </form> */}


            </div>
        </div>
    );
}
