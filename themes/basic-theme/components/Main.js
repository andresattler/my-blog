import React from 'react';
import Aside from './Aside'

class Main extends React.Component {
  render () {
    let content;
    if(this.props.content.articles){
      const articles = this.props.content.articles.sort( (a,b) => {
        let date1 = new Date(Date.parse(a.date));
        let date2 = new Date(Date.parse(b.date));
        return date2 - date1});
      content = articles.map(val => (
        <article
          key={val.title}
          >
          <a href={val.link}>
            <p>{val.date}</p>
            <h1>{val.title}</h1>
            <p dangerouslySetInnerHTML={{__html: val.description}}></p>
          </a>
        </article>
      ));
    }else{
      content=<article dangerouslySetInnerHTML={{__html: this.props.content.content}}></article>;
    }

    return (
      <div id="wrapper">
        <main>
          {content}
        </main>
        <Aside/>
      </div>
    )
  }
}

export default Main;
