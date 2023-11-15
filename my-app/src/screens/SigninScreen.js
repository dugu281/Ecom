import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // axios.defaults.withCredentials = true;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('https://reactecom-hhm4.onrender.com/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('SignIn Successful');
      setLoading(false);
      navigate(redirect || '/');
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="container justify-content-center row shopping-cart">
      {/* <Helmet>
        <title>Sign In</title>
      </Helmet> */}
      <h3 className="my-3 text-center fw-bold">Sign In</h3>
      {/* {loading ?
        <p className='text-primary'>
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span role="status"> Loading...</span>
        </p>
        :
        ''
      } */}


      <form onSubmit={submitHandler} className='col-12 col-md-6 col-lg-6'>


        <div class="mb-3">
          <label>Email</label>
          <input
            class="form-control bg-light"
            placeholder="email"
            aria-label="email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        <div class="mb-3">
          <label>Password</label>
          <input
            class="form-control bg-light"
            placeholder="password"
            aria-label="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <button type="submit" className='btn btn-primary text-light border-0 shadow'>{loading ?
            <span className='text-light'>
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span role="status"> Loading...</span>
            </span>
            :
            'Sign In'
          }</button>
        </div>

        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create new account</Link>
        </div>



        {/* <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group> */}
        {/* <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group> */}
        {/* <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div> */}
        {/* <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div> */}
        {/* <div className="mb-3">
          Forget Password? <Link to={`/forget-password`}>Reset Password</Link>
        </div> */}
      </form>
    </div>
  );
}
