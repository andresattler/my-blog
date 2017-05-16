---
nr: 3
date: 16.05.17
title: Using Path Parmas from react-router v4
---

# Using Path Parmas from react-router v4

The rewriting of React Router v4 has brought some useful advancements like the simple use of Path Params. In this article I'll cover what they are and how to use them. At the end I’ll show you how I’ve used Path Params to write a simple picture gallery using Path Params.

## What Path Params are

In React Router v4 you can define variables in the URL and aces them easily to render content based on dynamics parts of the URL.

For example we can render content based on some id entered by the user through the URL.

## Let’s see how to use them

The rewriting of React Router v4 has brought some useful advancements like the simple use of Path Params. In this article I'll cover what they are and how to use them. At the end I’ll show you how I’ve used Path Params to write a simple picture gallery using Path Params.

## What Path Params are

In React Router v4 you can define variables in the URL and aces them easily to render content based on dynamics parts of the URL.

For example we can render content based on some id entered by the user through the URL.

## Let’s see how to use them

You define a Parameter in the path attribute of one of your Route Components using  a colon in front of the parameter name you want to use

```javascript

<Route path=”/example/:user component={Main}/>

```

In the example above we are defining a parameter called user.

You can access the parameters then in the corresponding component through the match object.

```javascript
const Main =({match}) => (
	<div>
		<h1>The id is: {match.props.user}</h1>
	</div>
);
```

Now you can render for example content to the page relating if the id exists or not.

```javascript
const acounts = [‘john’ ,’bob’, ‘alice’];
const Main =({match}) => (
	<div>
		{acounts.indexOf(match.props.user) >= 0 ? <h1>Hello {match.props.user</h> : <h1>404 Page Not Found!</h1>  }
	</div>
);

```

## How to write a picture gallery using Path Params

I myself came over to use React Routers Path Params when I was developing a better version of my picture gallery.

I’ve used a nr parameter which corresponds to a specific picture and I’ve increased or decreased it with the use of two links.

It’s so simple and elegant.
Additionally I’ve used a second parameter to realize different image folders


[View my code](https://github.com/andresattler/gallery2) [Demo](https://andresattler.com/demos/gallery)
