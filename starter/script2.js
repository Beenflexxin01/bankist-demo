'use strict';

/////////////////////////////
// LECTURES
/////////////////////////////
// SSELECTING ELEMENTS
/////////////////////////////
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');

const allButton = document.getElementsByTagName('button');
console.log(allButton);

console.log(document.getElementsByClassName('btn'));

/////////////////////////////
// CREATING AND INSERTING ELEMENTS
/////////////////////////////
// .insertAdjacentHTML

const message = document.createElement('div');
// message.textContent = 'We use cookies for improved functionality and analytics';
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie" > Got it </button > ';

//   header.prepend(message)
//   header.append(message)
// header.append(message.cloneNode(true))

header.before(message);
header.after(message);

/////////////////////////////
// DELETING ELEMENT
/////////////////////////////
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //   message.parentElement.removeChild(message)
  });

/////////////////////
//   STYLES -- INLINE
/////////////////////
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.backgroundColor);
console.log(message.style.width);
console.log(message.style.color);

console.log(getComputedStyle(message).color);

/////////////////////
// Adding height
/////////////////////

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
console.log(getComputedStyle(message).height);

/////////////////////
// CSS VARIABLES -- Changing styles
/////////////////////

document.documentElement.style.setProperty('--color-primary', 'orangered');

/////////////////////
// ATTRIBUTES -- STANDARD
/////////////////////
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.getAttribute('src'));
console.log(logo.alt);
console.log(logo.className);
logo.alt = 'Beautiful, minimalist logo';
// Non standard
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));
const links = document.querySelector('.nav__link--btn');
console.log(links.href);
console.log(links.getAttribute('href'));

console.log(logo.dataset.versionNumber);

// CLASSES
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c', 'j');
logo.classList.contains('c', 'j');

// DO NOT USE BECAUSE IT OVERWRITES ALL EXISITING CLASSES AND ALLOWS ONLY ONE CLASS.
logo.className = 'Omotayo';

const h1 = document.querySelector('h1');
const alerth1 = function (e) {
  alert('addeventlistener.   Great! You are reading the heading');
};
h1.addEventListener('mouseenter', alerth1);

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);

// rbg(255, 255, 255)
const randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomColor = function () {
  return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(
    0,
    255
  )})`;
};

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // STOPPING THE EVENT PROPAGATION -- Not a good idea
  // e.stopPropagation()
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

// DOM TRAVERSING --- EVENT DELEGATION
const h1 = document.querySelector('h1');
// Going downwards // childElements
console.log(h1.querySelectorAll('.highlight')); //Direct children of the h1
console.log(h1.childNodes);
console.log(h1.children); //Works for only direct children

h1.firstElementChild.style.color = 'blue';
h1.lastElementChild.style.color = 'gray';

// Going upwards //Selecting parents
console.log(h1.parentNode); //Getting direct parent

h1.closest('.header').style.background = 'var( --gradient-secondary)';
h1.closest('h1').style.background = 'var( --gradient-primary)';

// Going siddeways -- Selecting siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); //Not an Array
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'
})

///////////////////////////////////////////////////
// STICKY NAVIGATION with Intersection Observer API
//////////////////////////////////////////////////
const obserevrCallBack = function (entries, observer) {
  entries.forEach(function (entry) {
    return console.log(entry);
  })
};
const observerOptions = {
  root: null,
  threshold: [0, 0.2]
};
const observer = new IntersectionObserver(obserevrCallBack, observerOptions);
observer.observe(section1);

// const observe = new IntersectionObserver(function (entry, observer) {
//   entry.forEach(function (entries) {
//     console.log(entries);
//   })
// })

// observe.observe(section1)
*/

/////////////////////////////////////
// STICKY NAVIGATION with scroll event
//////////////////////////////////////
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoords.top) {
//     return nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Webpage Lifecyle-- Birth to Death
// Dom Content Loaded... Code execution after DOM is ready!!////////
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and Dom Tree built');
});
// Load Event-
window.addEventListener('load', function (e) {
  console.log('Page fully loaded');
});

// Leaving webpage
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
  