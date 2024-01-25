import React from 'react';



const Home = ({ loggedIn }) => {
  

  console.log('Home component rendered. Logged in:', loggedIn);
  const imageUrl = loggedIn
    ? '/picture/spiderman.jpg'
    : 'https://example.com/defaultImage.jpg';
    console.log('Image URL:', imageUrl);

  return (
    <div>
      <h2>Home Page</h2>
      {loggedIn ? (
        <div>
          {<img src={imageUrl} alt="Home wall" /> }
          <p>Welcome to the full homepage!</p>
        </div>
      ) : (
        <p>
          Please <a href="/login">login</a> to access the full homepage.
        </p>
      )}
    </div>
  );
};

export default Home;
