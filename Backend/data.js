// import bcrypt from 'bcryptjs';
const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('11111'),
      isAdmin: true,
      phone: 9087654321,
      address: 'Seed address',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
      phone: 9087654321,
      address: 'Seed address',
    },
    {
      name: 'Durgesh',
      email: 'durgesh@example.com',
      password: bcrypt.hashSync('111'),
      isAdmin: true,
      phone: 9087654321,
      address: 'Nashik,Maharashtra',
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Blue Stripped Shirt',
      slug: 'blue-shirt',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 679px × 829px
      price: 499,
      countInStock: 8,
      brand: 'Raymond',
      rating: 3.5,
      numReviews: 20,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      name: 'Nike Sports Shoes',
      slug: 'nike-shoes',
      category: 'Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 999,
      countInStock: 4,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 786,
      description: 'multicolor shoes',
    },
    {
      // _id: '3',
      name: 'Acne Jeans Pant',
      slug: 'acne-jeans-pant',
      category: 'Pants',
      image: 'https://images.unsplash.com/photo-1624378441864-6eda7eac51cb?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 699,
      countInStock: 0,
      brand: 'Acne',
      rating: 4,
      numReviews: 5,
      description: 'high quality product',
    },
    {
      // _id: '4',
      name: 'iPhone 14 Pro Max',
      slug: 'iphone-14',
      category: 'Pants',
      image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 98999,
      countInStock: 5,
      brand: 'Apple',
      rating: 4.5,
      numReviews: 10,
      description: 'Retina iPhone display',
    },
  ],
};




module.exports = data;


// export default data;
