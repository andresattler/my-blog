import React from 'react';
import Profile from './profile';
import Social from './social'
class Aside extends React.Component {
  render () {
    return (
      <aside>
        <Profile/>
        <Social/>
      </aside>
    )
  }
}

export default Aside;
