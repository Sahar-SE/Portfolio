const projects = [
  {
    title: 'Hotel Reservation',
    devs: ['• frontend', ' • backend', ' • 2022'],
    description:
      "This application is a web application for final capstone project that you can find your favorite Hotel around the world and reserve it for a specific date, find information about a hotel at details page and cancel a reservation.",
    tags: ['html', 'css', 'React/Redux', 'Ruby on Rails'],
    image: 'img/Snapshoot.png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(2).png',
    btnImg2: '/img/Vector(1).png',
    link: 'https://hotel-reservation-i2st.onrender.com/',
    srcLink: 'https://github.com/Sahar-SE/hotel-reservation'
    // eslint-disable-next-line linebreak-style
  },
  {
    title: 'Media Hub',
    devs: ['• HTML/CSS', ' • JavaScript', ' • 2022'],
    description:
      "In this project, we developed an application that displays movies and allows users to like and comment on their favorite movies. The application is built on HTML, CSS and JavaScript.",
    tags: ['html', 'css', 'javascript', 'Bootstrap'],
    image: 'img/Snapshoot(1).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(2).png',
    btnImg2: '/img/Vector(1).png',
    link: 'https://kamba56.github.io/MediaHub/docs/',
    srcLink: 'https://github.com/Sahar-SE/MediaHub',
    // eslint-disable-next-line linebreak-style
  },
  {
    title: 'Weather App',
    devs: ['• React', '• Redux', ' • 2021'],
    description:
      "This is a SPA react-app project that is built using two APIs. And users can select and choose countries and states and get their updated weather info. I have built this project using react-redux and JavaScript.",
    tags: ['html', 'css', 'React/Resux', 'API'],
    image: 'img/Snapshoot(2).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(2).png',
    link: 'https://redux-h.herokuapp.com/',
    srcLink: 'https://github.com/Sahar-SE/sakwa-weather-app',
  },

  {
    title: 'Leader Board',
    devs: ['• HTML/CSS', ' • JavaScript', ' • 2022'],
    description:
      "This project contains a leader board for a game which contains players name and list and store them on API build with HTML, CSS, JS and API.",
    tags: ['html', 'css', 'javascript', 'bootstrap'],
    image: 'img/Snapshoot(3).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(2).png',
    link: 'https://sahar-se.github.io/Leaderboard/docs/',
    srcLink: 'https://github.com/Sahar-SE/Leaderboard',
  },
  {
    title: 'Recipe App',
    devs: ['• Ruby', ' • SQL', ' • 2022'],
    description:
      "he Recipe app keeps track of all your recipes and ingredients. It will allow you to save ingredients, keep track of what you have, create recipes, and generate a shopping list based on what you have and what you are missing from a recipe. Also, since sharing recipes is an important part of cooking the app should allow you to make them public so anyone can access them.",
    tags: ['Ruby', 'Rails', 'MySQL','Tailwind'],
    image: 'img/Snapshoot(4).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(1).png',
    link: 'https://github.com/Sahar-SE/Recipe_App/pull/29',
    srcLink: 'https://github.com/Sahar-SE/Recipe_App',
  },
];

const buttonOne = document.querySelectorAll('.btn');

const headersection = document.querySelector('header');

function open(index) {
  const {
    title, devs, description, tags, image, liveVersion, sourceLink, link, srcLink,
  } = projects[index];
  const dev1 = devs[0];
  const dev2 = devs[1];
  const dev3 = devs[2];
  const tags1 = tags[0];
  const tags2 = tags[1];
  const tags3 = tags[2];
  const tags4 = tags[3];
  const container = document.querySelector('.popup-menus');
  container.innerHTML = `
  <div class="popup-main-container">
  <div class="popup-content ">
  <div class="popup-heading">
  <h1 class="popup-project1-title">${title}</h1>
  <a="button" class="popup-close">&times;</a>
  </div>
  <ul class="popup-example-dev">
  <li class="dev1">${dev1}</li>
  <li class="dev2">${dev2}</li>
  <li class="dev2">${dev3}</li>
  </ul>
  <div class="popup-container-img">
  <img src=${image} alt="card-img1" class="card-img">
  </div>
  <div class="popup-desktop">
  <p class="project-popup-info1">${description}</p>
  <div class="project-popup-info2">
  <ul class="popup-tags">
  <li class="popup-tag">${tags1}</li>
  <li class="popup-tag">${tags2}</li>
  <li class="popup-tag">${tags3}</li>
  <li class="popup-tag">${tags4}</li>
  </ul>

  <div class="popup-button">
  <a href=${link}><button type="button" class="popup-button1">${liveVersion}<img class="" src='img/Icone.png'></button></a>
  <a href=${srcLink}><button type="button" class="popup-button1">${sourceLink}<img class=""  src='img/Vectors.png'></button></a>
  </div>
  </div>
  </div>
  </div>
  </div>
`;

  headersection.appendChild(container.firstChild);

  container.style.display = 'block';

  const buttonClose = document.querySelector('.popup-close');
  buttonClose.addEventListener('click', () => {
    const popup = document.querySelector('.popup-menus');
    popup.style.display = 'none';
  });
}

for (let i = 0; i < buttonOne.length; i += 1) {
  buttonOne[i].addEventListener('click', () => open(i));
}