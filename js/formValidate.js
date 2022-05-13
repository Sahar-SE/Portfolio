const form = document.getElementById("contact-form");
const emailInput = document.getElementById("email");
const formButton = document.querySelector(".contact-section-button");

form.addEventListener("submit", (event) => {
  if (emailInput.value !== emailInput.value.toLowerCase()) {
    formButton.setCustomValidity(
      "Please put your email characters in lower case my g!"
    );
    formButton.reportValidity();
    event.preventDefault();
  }
});

emailInput.addEventListener("input", () => {
  formButton.setCustomValidity("");
});