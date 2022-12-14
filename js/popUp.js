const projects = [
  {
    title: 'Hotel Reservation',
    devs: ['Sahar', ' • backend', ' • 2021'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tags: ['html', 'css', 'javascript'],
    image: 'img/Snapshoot.png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(2).png',
    btnImg2: '/img/Vector(1).png',
    // eslint-disable-next-line linebreak-style
  },
  {
    title: 'Tonic',
    devs: ['Sahar', ' • backend', ' • 2021'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tags: ['html', 'css', 'javascript'],
    image: 'img/Snapshoot(1).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(2).png',
    btnImg2: '/img/Vector(1).png',
    // eslint-disable-next-line linebreak-style
  },
  {
    title: 'Multi-Post Stories',
    devs: ['Sahar', ' • backend', ' • 2021'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tags: ['html', 'css', 'javascript'],
    image: 'img/Snapshoot(2).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(2).png',
  },

  {
    title: 'Facebook 360',
    devs: ['Sahar', ' • backend', ' • 2021'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tags: ['html', 'css', 'javascript'],
    image: 'img/Snapshoot(3).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(2).png',
  },
  {
    title: 'Uber Navigation',
    devs: ['Sahar', ' • backend', ' • 2021'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    tags: ['html', 'css', 'javascript'],
    image: 'img/Snapshoot(4).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    btnImg1: '/img/Vector(1).png',
    btnImg2: '/img/Vector(1).png',
  },
];

const buttonOne = document.querySelectorAll('.btn');

const headersection = document.querySelector('header');

function open(index) {
  const {
    title, devs, description, tags, image, liveVersion, sourceLink,
  } = projects[index];
  const dev1 = devs[0];
  const dev2 = devs[1];
  const dev3 = devs[2];
  const tags1 = tags[0];
  const tags2 = tags[1];
  const tags3 = tags[2];
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
  </ul>
  <div class="popup-button">
  <button type="button" class="popup-button1">${liveVersion}<img class="" src='img/Icone.png'></button>
  <button type="button" class="popup-button1">${sourceLink}<img class=""  src='img/Vectors.png'></button>
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