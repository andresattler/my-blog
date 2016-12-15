import React from 'react';
import Template from './themes/basic-theme/template'
class Html extends React.Component {
  render () {
    return (
      <html lang="eng">
        <head>
          <title>Andres Blog</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="author" content="Andre Sattler"/>
          <meta name="description" content="This blog is a web development blog of me Andre Sattler a beginning front-end developer who likes challenges and shares his thoughts and experiences on his juorney."/>
          <link rel="stylesheet" href="/blog/css/style.css"/>
        </head>
        <body>
          <Template content={this.props}/>
        </body>
      </html>
    )
  }
};

export default Html
