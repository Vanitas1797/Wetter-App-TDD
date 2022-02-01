const email = document.getElementById('email');
const password = document.getElementById('password');
const button_login = document.getElementById('button_login');
import { fetchToBackend } from './http.js';

export let logged_user_id = null;

async function whoIsLoggedIn(params) {
  await fetch();
}

async function login() {
  const json = await fetchToBackend('http://localhost:3000/user/login', {
    email: email.value,
    password: password.value,
  });

  if (!json.isError) {
    logged_user_id = json.user_id;
    window.location.href = '../views/index.html';
  } else alert('E-Mail oder Passwort falsch!');
}

button_login.onclick = async () => {
  await login();
};
