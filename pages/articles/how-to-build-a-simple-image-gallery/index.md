---
nr: 2
date: 14.12.16
title: How to write a simple image gallery
---

# How to write a simple image gallery

Today I want to show how to write an simple image slider to view images with descriptions. I’ve came to this idea because I’m travelling at the moment and wanted to share my pictures with friends and family. All existing library's I’ve found doesn’t fit for me. They were to complex and feature-rich and mostly to complex to configure to my use-case so I’ve decided to write one at my one.

## The Markup

For this gallery we create a full with and height layout with an responsive image and two arrow buttons to navigate through the images.

The markup looks as follows:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="./src/stylesheet" href="style.css">
    <script src="./src/script.js"></script>
  </head>
  <body>
    <div id="gallery">
      <button id="left">&#8592</button>
      <div id="slider"><img src="" alt="loading">
      </div>
      <button id="right">&#8594</button>
    </div>
  </body>
</html>
```
For the arrows on the buttons we are using the Unicode characters and the image source will be dynamically changed via JavaScript.

## The CSS

So we want to achieve an full width and height layout...
```css
body {
  margin: 0;
}
#gallery {
  width: 100vw;
  height: 100vh;
  background-color: #2f2f31;
  overflow: hidden;
}
```
Now the positioning and styling of the navigation-buttons…

```css
#gallery button {
  margin: 5px;
}
#left, #right {
  position: absolute;
  top: 50%;
  height: 50px;
  width: 50px;
  margin-top: -25px;
  font-size: 26px;
  border-radius: 50%;
  border: none;
  background-color: #4b5f5f;
  color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
#right {
  right: 0;
}
```
The last thing we need to do is to center the image and to set the image responsive by setting a max width off 100% and height to auto we also need to consider different image orientations.

```css
#slider {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#slider img {
  max-width: 100%;
  height: auto;
  max-height: 100%;
  image-orientation: from-image;
}
```
![the image gallery so far](/blog/assets/simple-gallery1.jpg)

## The JavaScript

Now we need to give the gallery thee function to change the picture.
So we create a function gallery and first cache relevant DOM elements.

Then we set up the different event-listeners. We basically want to listen to two event types. The first one is clicking on one of the navigation-buttons and the other on is using the left or right arrow keys. For simplification we use only one event-listener for key down and differ later in the function ‘keyPressed’.

In the function ‘slide’ and ‘keyPressed’ we are modifying a global index variable and calling afterwards the render function witch modifys the image source.

```javascript
window.onload = function(){
  function gallery (pictures){
    var index= 0;
    //cache DOM
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    var img = document.querySelector("#slider img");
    //bind events
    left.addEventListener("click", slide);
    right.addEventListener("click", slide);
    document.addEventListener("keydown", keyPressed);
    render();
    function render(){
      img.src = pictures[index];
    };
    function slide(e){
      if(e.target.id =="left" && index>0){
        index--;
      }else if (e.target.id =="right" && index+1<pictures.length) {
        index++;
      }
      render();
    }
    function keyPressed(e){
      if(e.key =="ArrowLeft" && index>0){
        index--;
        render();
      }else if(e.key =="ArrowRight" && index+1<pictures.length){
        index++;
        render();
      }
    }
  }
```
Afterwards we only need to call this function by passing an array of image sources.

```javascript
//[...]
gallery('pic1.jpg', './pics/image1.png', 'assets/profile.jpg');
```
So we did it!

## But that's to basic!

Yeah I now for my purpose I wanted to give my family and friends an description to some of my photos. Also does this gallery deliver a bad user experience while loading each picture so lets also create some preloading.

### Descriptions

First we need to add an description div to the markup:

```html
<div id="gallery">
  <button id="left">&#8592</button>
  <div id="slider"><img src="mangos.jpg" alt="loading">
    <div id="description"></div>
  </div>
  <button id="right">&#8594</button>
</div>
```
Then we style it so that’s in the bottom of the image and transparent with a good to read font-collor.

```css
#description {
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100vw;
  height: 100px;
  background-color: rgba(0,0,0,0.4);
  overflow: hidden;
}
#description p {
  padding: 10px 0;
  color: #fff;
  text-align: center;
  font-size: 26px;
}
```
Now I wanted to pass an array to the function gallery like this:

```javascript
var pictures = [
  {
    src: "pics/1.jpeg",
    description: "Hello world!"
  },
  {
    src: "pics/2.jpeg",
  },
  {
    src: "pics/3.jpeg",
    description: "Some description"
  },
];

gallery(pictures);
```
If an description exist the description should be visible with the description text. So our new render function looks like this:

```javascript
function render(){
  preload();
  var pic = pictures[index];
  img.src = pic.src;
  if(pic.description){
    description.style.display = "block";
    description.innerHTML = "<p>" + twemoji.parse(pic.description) + "</p>";
  }else{
    description.style.display = "none";
  }
};
```
### Image preloading

Preloading images helps to achieve a smother user-experience without images that are still loading while sliding.

There are different ways to preload an image but in our case its the best doing this in JavaScript.

```javascript
var images = [];
for(var i =0; i<5; i++){
  images[i]= new Image();
  images[i].src = pictures[i].src;
};
```
We do this by loading an number(in this case 5) of images in an array.

Additional when the amount of pictures is heigh enough that we don’t want to load every image at start due to bad initial loading speed, we can load every action one more. For this we define this preload function which we are calling in the render function.

```javascript
function preload(){
  if(index+50<pictures.length){
    var nextImg = new Image();
    nextImg.src = pictures[index+50].src;
  }
}
```
So now we have it. You can see the whole code with some more features [here](https://github.com/andresattler/simple-gallery)

___
Thank you for reading and I hoped you appreciated it.
