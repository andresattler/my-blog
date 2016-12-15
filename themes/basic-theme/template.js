import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import NavBar from './components/Navbar';

class Template extends React.Component {
  render () {
    return (
      <div>
        <Header/>
        <NavBar/>
        <Main content={this.props.content}/>
        <Footer/>
      </div>
    );
  }
};

export default Template;
