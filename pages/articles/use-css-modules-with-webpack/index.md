---
nr: 5
date: 08.04.18
title: Use CSS Modules with Webpack
---
# Use CSS Modules with Webpack

CSS came along way over the years and standard CSS stylesheets are still the way to go for simple webpages. For larger projects css can easy get hard to maintain and different methodologies evolved to help maintaining CSS. Most of them like BEM evolve around strict naming conventions. With the rise of components like we getting with React and bundler like Webpack we are getting more intuitive ways.

## The advantages we get

Components are getting more and more popular and so we have gotten ways to bundle them together out of HTML CSS and images and put them anywhere on the webpage.
With Webpack we can write CSS for individual peaces or components of our webpage without affecting other peacesor components.

Under the hood it works very similar to naming conventions like BEM but all the hustle is managed by webpack and we as a developer or designer have more time to focus on what is important.  

## Configuring Webpack 

In this tutorial I am assuming you are already using webpack so I'm not going over the full configuration of webpack.
Se more in the documentation [https://webpack.js.org/guides/getting-started/#using-a-configuration](https://webpack.js.org/guides/getting-started/#using-a-configuration) to get a basic configuration.


In this tutorial I will use [Yarn](https://yarnpkg.com) for package management.
If you want to stick to npm just change the commands appropriately.

First we need to install some loaders for Webpack:

```sh
yarn add -D style-loader css-loader
```

Then we add the loader to the Webpack config file.

```js
const path = require('path')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
    		use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',				  
            options: {
              modules: true, // heare we enable CSS moudles
              localIdentName: '[name]-[local][hash:base64:6]' //this is a naming pattern we define
              // this is not necesary but it helps in debunging
              // by default webpack is just using hashes 
            }
          }
        ]
			}		
	 ]
  }
}
```

## Now let's do some magic
```js
  import React from 'react'

  import style from './style.css' // now we can import css files

  const Projects = () => (
    <div className={style.container}> // and aply styles like this
      <h1 className={style.heading}>Hello World1</h1>
    </div>
  )

  export default Projects

```

The coresponding CSS file looks like this

```css
.heading {
  color: red;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

And this is the product:
![css-modules in action](/blog/assets/css-modules.png)

I know this is a very simple example but this method helps easily maintain huge pages build out of dozens of components by just 
working on individual stylesheets that just affect one component.

## One thing more

Many people like to name their CSS classes using hyphens to separate words.
This makes it on the other hand not nice to use in JS.

If we have a css class like this:

```css
heading-one
```

we can't just reference it we need ro use a bracket notation like
```js
style[heading-one]
```
Luckily there is a nice way to improve this by editing our webpack config

I know this is a very simple example but this method helps easaly maintain huge pages build out of dozens of components by just 
working on indiviual stylesheets that just affect one component.


```js
{
  [...]
  loader: 'css-loader',				  
    options: {
      modules: true,
      cammelCase: true, // this option converts hyphen seperated names to cammelCase
      localIdentName: '[name]-[local][hash:base64:6]'
    }
  }
`
```

Now we can access our heading-one class by:

```js
style.headingOne
```

___


