import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
// import MapScreen from './screens/MapScreen';
//import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
// import ResetPasswordScreen from './screens/ResetPasswordScreen';
import About from './screens/About';
import ProductCreateScreen from './screens/ProductCreateScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  // const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
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
  }, []);
  return (
    <BrowserRouter>
      <div
      // className={
      //   sidebarIsOpen
      //     ? fullBox
      //       ? 'site-container active-cont d-flex flex-column full-box'
      //       : 'site-container active-cont d-flex flex-column'
      //     : fullBox
      //       ? 'site-container d-flex flex-column full-box'
      //       : 'site-container d-flex flex-column'
      // }
      >
        <ToastContainer position="bottom-center" limit={1} autoClose={2000} />

        <header data-bs-theme="light">
          <nav class="navbar navbar-expand-md navbar-light fixed-top bg-light">
            <div class="container-fluid">
              <Link to="/" class="navbar-brand shopping-cart"><img width="35" height="35" src="https://img.icons8.com/fluency/96/shopping-bag.png" alt="shopping-bag" />Ecommerce App</Link>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse rating" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                  <li class="nav-item">
                    <Link class="nav-link" aria-current="page" to="/">Home</Link>
                  </li>

                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Categories
                    </a>
                    <ul class="dropdown-menu">
                      {categories.map((category) => (
                        <li key={category}>
                          <Link
                            to={{ pathname: '/search', search: `category=${category}` }}
                            // onClick={() => setSidebarIsOpen(false)}
                            className='text-decoration-none'
                          >
                            <a class="dropdown-item">{category}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" aria-current="page" to="/about">About</Link>
                  </li>
                  {/* <li className='nav-item'>
                    <SearchBox />
                  </li> */}
                </ul>
                <div className='d-flex'>
                  <div className='me-3 shopping-cart'>
                    <SearchBox />
                  </div>
                  <Link to="/cart" className="nav-link">
                    <button type="button" class="btn btn-info position-relative text-light me-3">
                      <i class="fa-solid fa-cart-shopping fs-5"></i>
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary text-light z-1">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        <span class="visually-hidden">unread messages</span>
                      </span>
                    </button>
                  </Link>
                  {/* <button className='me-1 text-light'> */}

                  {userInfo ? (
                    <div className="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {userInfo.name}
                      </button>
                      <ul class="dropdown-menu dropdown-menu-lg-end">
                        <li><a class="dropdown-item disabled text-primary fw-bold" aria-disabled="true">User Options</a></li>
                        <li><Link class="dropdown-item" to="/profile">User Profile</Link></li>
                        <li><Link class="dropdown-item" to="/orderhistory">Order History</Link></li>
                        {userInfo && userInfo.isAdmin && (
                          <span>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item disabled text-primary fw-bold" aria-disabled="true">Admin Options</a></li>
                            <li><Link class="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                            <li><Link class="dropdown-item" to="/admin/products">Products</Link></li>
                            <li><Link class="dropdown-item" to="/admin/orders">Orders</Link></li>
                            <li><Link class="dropdown-item" to="/admin/users">Users</Link></li>
                          </span>
                        )}
                        <li><hr class="dropdown-divider" /></li>
                        <li><Link
                          className="dropdown-item text-danger fw-bold"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link></li>
                      </ul>
                    </div>

                  ) : (
                    <Link className="btn btn-secondary text-light" to="/signin">
                      Sign In
                    </Link>
                  )}

                  {/* </button> */}
                  {/* {userInfo && userInfo.isAdmin && (
                    <div className="btn-group">
                      <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        Admin
                      </button>
                      <ul class="dropdown-menu dropdown-menu-lg-end">
                        <li><Link class="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link class="dropdown-item" to="/admin/products">Products</Link></li>
                        <li><Link class="dropdown-item" to="/admin/orders">Orders</Link></li>
                        <li><Link class="dropdown-item" to="/admin/users">Users</Link></li>
                      </ul>
                    </div>
                  )} */}

                </div>
              </div>
            </div>
          </nav>
        </header>



        <main className='mb-3'>
          <div className="container mt-5 pt-4 pb-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>


              <Route
                path="/admin/product/create"
                element={
                  <AdminRoute>
                    <ProductCreateScreen />
                  </AdminRoute>
                }
              ></Route>




              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />

              <Route path="/about" element={<About />} />
            </Routes>
          </div>
          <p className="text-center p-1 shopping-cart" id='footer'>Made with passion by <span className='text-muted'>&copy; </span>Durgesh Bhoye</p>
        </main>









        {/* <footer id='footer'> */}
        {/* </footer> */}

      </div>
    </BrowserRouter>
  );
}

export default App;
