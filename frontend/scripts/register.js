import { fetchToBackend } from './http.js';

const email = document.getElementById('email');
const password = document.getElementById('password');
const confirm_password = document.getElementById('confirm_password');
const button_register = document.getElementById('button_register');

button_register.onclick = async () => {
  const json = await fetchToBackend(`http://localhost:3000/user/register`, {
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
  });

  if (json.isError) {
    if (json.status === 400) {
      alert('Benutzer existiert bereits!');
      return;
    }
    alert('Passwörter stimmen nicht überein!');
    return;
  }

  window.location.href = 'login.html';
};
