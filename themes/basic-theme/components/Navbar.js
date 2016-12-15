import React from 'react';

class NavBar extends React.Component {
  render () {
    return (
      <nav>
        <a href="/">Portfolio</a>
        <a href="/blog">Blog</a>
        <a href="/blog/about">About</a>
      </nav>
    )
  }
}

export default NavBar;
