/* eslint-disable no-unused-vars */
const menuOn = document.getElementById('expend');
const menuOff = document.getElementById('burger');

function openNav() {
  menuOn.classList.add('show');
  menuOff.classList.add('burgeract');
}

function closeNav() {
  menuOn.classList.remove('show');
  menuOff.classList.remove('burgeract');
}