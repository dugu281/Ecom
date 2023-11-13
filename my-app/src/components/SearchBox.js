import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    // <Form className="d-flex me-auto" onSubmit={submitHandler}>
    //   <InputGroup>
    //     <FormControl
    //       type="text"
    //       name="q"
    //       id="q"
    //       onChange={(e) => setQuery(e.target.value)}
    //       placeholder="search products..."
    //       aria-label="Search Products"
    //       aria-describedby="button-search"
    //     ></FormControl>
    //     <Button variant="outline-primary" type="submit" id="button-search">
    //       <i className="fas fa-search"></i>
    //     </Button>
    //   </InputGroup>
    // </Form>

    <form class="d-flex" onSubmit={submitHandler}>
      <input class="form-control me-2 rounded-5 price"
        type="text"
        name="q"
        id="q"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        aria-label="Search Products"
        aria-describedby="button-search"
      />
      <button class="btn btn-outline-primary rounded-5 shopping-cart" type="submit" id="button-search">Search</button>
    </form>

  );
}
