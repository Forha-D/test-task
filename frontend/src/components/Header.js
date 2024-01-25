import React from 'react';

const Header = ({ loggedIn, onLogout }) => {
  return (
    <header>
      <h1>Your Website</h1>
      {loggedIn ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
};

export default Header;
