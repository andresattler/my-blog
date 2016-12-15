import React from 'react';

class Header extends React.Component {
  render () {
    return (
      <header>
        <a href='/blog'>
          <h1>my Blog</h1>
          <p>some thoughts</p>
        </a>
      </header>
    )
  }
}

export default Header;
