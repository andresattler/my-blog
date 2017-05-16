import React from 'react';

class Profile extends React.Component {
  render () {
    return (
      <div>
        <img src="/blog/assets/profile.jpg" alt="My Profile Picture"/>
        <h2>Who I Am</h2>
        <p>Hi I am André Sattler <br/> a beginning and ambitious Front-End developer from Germany</p>
      </div>
    )
  }
}

export default Profile;
