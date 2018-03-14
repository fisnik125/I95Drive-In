import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
<div>
  <p> Page not found </p>
  <p> Return</p>
  <Link to="/"> Home </Link>
</div>
)

export default NotFound;