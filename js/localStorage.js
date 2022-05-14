const name = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");
const button = document.getElementById("submit");
const out = document.getElementById("out");

button.onclick= function() {
  const user = name.value;
  const mail = email.value;
  const sms = message.value;

  if(user && mail && sms) {
    localStorage.setItem(user, mail, sms);
    location.reload();
  }
}
