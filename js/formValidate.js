const form = document.getElementById('contact-form');
const emailInput = document.getElementById('email');
const formButton = document.getElementById('submit');

form.addEventListener('submit', (event) => {
  if (emailInput.value !== emailInput.value.toLowerCase()) {
    formButton.setCustomValidity(
      'Please put your email characters in lowercase!',
    );
    formButton.reportValidity();
    event.preventDefault();
  }
});