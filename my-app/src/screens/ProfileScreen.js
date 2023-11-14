import React, { useContext, useReducer, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

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

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(userInfo.phone);
  const [address, setAddress] = useState(userInfo.address);
  // const [confirmPassword, setConfirmPassword] = useState('');

  // console.log("User Details: ", userInfo);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  axios.defaults.withCredentials = true;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        'https://ecom-server.vercel.app/users/profile',
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
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
      {/* <Helmet>
        <title>User Profile</title>
      </Helmet> */}
      <h3 className="my-3 text-center fw-bold">User Profile</h3>

      <form onSubmit={submitHandler}>


        <div class="mb-3">
          <label>User Name</label>
          <input
            class="form-control bg-light"
            placeholder="name"
            aria-label="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>


        <div class="mb-3">
          <label>Email</label>
          <input
            class="form-control bg-light"
            placeholder="email"
            aria-label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>


        <div class="mb-3">
          <label>Reset Password</label>
          <input
            class="form-control bg-light"
            placeholder="password"
            aria-label="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            minlength="5"
          />
        </div>

        <div class="mb-3">
          <label>Phone</label>
          <input
            class="form-control bg-light"
            placeholder="phone number"
            aria-label="phone number"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minlength="10"
          />
        </div>

        <div class="mb-3">
          <label>Address</label>
          <input
            class="form-control bg-light"
            placeholder="address"
            aria-label="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>


        {/* <div class="mb-3" controlId="password">
          <label>Confirm Password</label>
          <input
            class="form-control bg-light"
            placeholder="password"
            aria-label="password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div> */}

        {userInfo.isAdmin ? <span class="badge text-bg-primary mb-3">Admin</span> : <span class="badge text-bg-info mb-3">User</span>}


        <div className="mb-3">
          <button type="submit" className='btn btn-success'>Update</button>
        </div>






      </form>


    </div>
  );
}
