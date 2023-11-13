import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
// import Container from 'react-bootstrap/Container';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Form from 'react-bootstrap/Form';
// import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
// import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  // const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);


  // ==============================================================

  const [image, setImage] = useState({ preview: '', data: '' });


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

    const response = axios.post(`http://localhost:4000/uploadProfilePic`, formData);
    return response;
  }


  // upload or update profile picture
  const uploadProductPic = async (e) => {
    e.preventDefault();
    if (image.preview === '') {
      toast.warn('Image required!', {
        position: "top-center",
        autoClose: 3000,
      });
    }
    else {
      try {
        const imgRes = await handleImgUpload();
        // const request = {
        //   profilePic: `${API_BASE_URL}/files/${imgRes.data.fileName}`
        // }
        await axios.put(
          `http://localhost:4000/api/products/photo/${productId}`,
          {
            _id: productId,
            image: `http://localhost:4000/files/${imgRes.data.fileName}`,

          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Image updated successfully');
        navigate('/admin/products');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }

    }
  }



  // =============================================================

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `http://localhost:4000/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          // image,
          // image: `http://localhost:4000/files/${imgRes.data.fileName}`,
          images,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };




  // const uploadFileHandler = async (e, forImages) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post('http://localhost:4000/api/upload', bodyFormData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     dispatch({ type: 'UPLOAD_SUCCESS' });

  //     if (forImages) {
  //       setImages([...images, data.secure_url]);
  //     } else {
  //       setImage(data.secure_url);
  //     }
  //     toast.success('Image uploaded successfully. click Update to apply it');
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };
  // const deleteFileHandler = async (fileName, f) => {
  //   console.log(fileName, f);
  //   console.log(images);
  //   console.log(images.filter((x) => x !== fileName));
  //   setImages(images.filter((x) => x !== fileName));
  //   toast.success('Image removed successfully. click Update to apply it');
  // };


  // ==============================================================




  return (
    <div className="container w-75 shopping-cart">
      {/* <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet> */}

      <div className='row mb-3 align-items-center'>
        <div className='col'>
          <span className='col fs-3'>Edit Product</span>
        </div>
        <div className='col'>
          <label className='fs-6 text-primary'>Product ID : </label>
          <input value={productId} disabled className='form-control bg-light w-100' />
        </div>
      </div>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div>
          <form onSubmit={submitHandler}>

            <div class="row mb-3">
              <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="name">
                <label>Product Name</label>
                <input
                  class="form-control bg-light"
                  placeholder="name"
                  aria-label="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="slug">
                <label>Slug</label>
                <input
                  class="form-control bg-light"
                  placeholder="slug"
                  aria-label="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              {/* <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="image">
              <label>Image File</label>
              <input
                class="form-control bg-light"
                placeholder="image"
                aria-label="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div> */}
              <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="image">
                <label>Category</label>
                <input
                  class="form-control bg-light"
                  placeholder="category"
                  aria-label="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>


            {/* <div class="row mb-3">
              <div class="row" controlId="price">
                <label>Upload Image</label>

                <div className='text-primary col-md-6 col-12 mb-3 col-lg-6' onChange={handleFileSelect}>
                  <div>
                    <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" />
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
            </div>

            <button onClick={uploadProductPic} className='btn btn-dark'>Upload Photo</button> */}

            <div class="row mb-3">
              <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="brand">
                <label>Brand</label>
                <input
                  class="form-control bg-light"
                  placeholder="brand"
                  aria-label="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </div>
            </div>


            <div class="row mb-3">
              <div class="col-md-6 col-12 mb-3 col-lg-6" controlId="description">
                <label>Description</label>
                <input
                  class="form-control bg-light"
                  placeholder="description"
                  aria-label="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <button className='btn btn-info' disabled={loadingUpdate} type="submit">
                Update
              </button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>

          </form>


          <hr />


          <form class="row mb-3" onSubmit={uploadProductPic}>
            <div class="row" controlId="price">
              <label>Update Image</label>

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
              <button type='submit' className='btn btn-dark '>Upload Photo</button>
            </div>
          </form>

        </div>
      )
      }
    </div>
  );
}
