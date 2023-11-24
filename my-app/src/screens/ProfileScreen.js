import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import './ProfileScreen.css';

// profile update reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

// Profile page
export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // state variables
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(userInfo.phone);
  const [address, setAddress] = useState(userInfo.address);
  const [image, setImage] = useState({ preview: '', data: '' });

  // console.log("User Details: ", userInfo);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });



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
    const response = axios.post(`https://ecomserver-jyy1.onrender.com/uploadProfilePic`, formData);
    // setIsLoading(false);
    return response;
  }


  // upload/ update profile picture

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (image.preview === '') {
      toast.warn('Profile Image mandatory!', {
        position: "top-center",
        autoClose: 3000,
      });
      return
    }

    try {

      const imgRes = await handleImgUpload();        // image upload function call
      const { data } = await axios.put(
        'https://ecomserver-jyy1.onrender.com/api/users/profile',
        {
          name,
          email,
          password,
          phone,
          image: `https://ecomserver-jyy1.onrender.com/files/${imgRes.data.fileName}`,
          address,
        },
        {
          // send token with request
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
      setImage({ preview: '', data: '' });
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };







  // update the user details
  const submitHandler = async (e) => {
    e.preventDefault();
    try {

      const { data } = await axios.put(
        'https://ecomserver-jyy1.onrender.com/api/users/profile',
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
          // send token with request
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };




  return (
    <div className="container small-container shopping-cart">

      <h3 className="my-3 text-center fw-bold">User Profile</h3>


      <div className="mb-3 w-100">

        {/* upload image form */}
        <form onSubmit={uploadHandler} className="mb-3 d-flex justify-content-center flex-column align-items-center">
          <div className='text-primary' onChange={handleFileSelect}>
            <label htmlFor='drop_zone' className='prof-pic border border-3 border-light m-auto'>
              <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" required style={{ display: "none" }} />
              <img src={userInfo.image} alt={userInfo.name} />
            </label>


            {image.preview && (
              <img src={image.preview} width='100%' alt='commentIMG' height='100%' className='img-fluid border border-2 border-dark rounded mt-3' />
            )}
          </div>
          <div>
            <button type='submit' className='btn btn-dark btn-sm mt-2'>Upload Image</button>
          </div>
        </form>
      </div>


      {/* user details with user update form */}
      <form onSubmit={submitHandler}>


        <div className="mb-3">
          <label>User Name</label>
          <input
            className="form-control bg-light"
            placeholder="name"
            aria-label="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>


        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control bg-light"
            placeholder="email"
            aria-label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>


        <div className="mb-3">
          <label>Reset Password</label>
          <input
            className="form-control bg-light"
            placeholder="password"
            aria-label="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            minLength="5"
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            className="form-control bg-light"
            placeholder="phone number"
            aria-label="phone number"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minLength="10"
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <input
            className="form-control bg-light"
            placeholder="address"
            aria-label="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Admin or user indicator */}
        {userInfo.isAdmin ? <span className="badge text-bg-primary mb-3">Admin User</span> : <span className="badge text-bg-danger mb-3">User</span>}


        <div className="mb-5">
          <button type="submit" className='btn btn-success'>Update</button>
        </div>


        <div className="alert alert-info p-2 mb-3" role="alert" >
          <span className='text-muted'>Note: Image should be square in shape and size less that 10mb.</span>
        </div>
      </form>


    </div>
  );
}
