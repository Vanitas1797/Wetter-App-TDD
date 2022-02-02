const email = document.getElementById('email');
const password = document.getElementById('password');
const button_login = document.getElementById('button_login');
import { setCookie } from './cookie.js';
import { fetchToBackend } from './http.js';

async function whoIsLoggedIn(params) {
  await fetch();
}

async function login() {
  const json = await fetchToBackend('http://localhost:3000/user/login', {
    email: email.value,
    password: password.value,
  });

  if (!json.isError) {
    setCookie(global_variables.cookies.logged_user_id, json.user_id, 5);
    window.location.href = '../views/index.html';
  } else alert('E-Mail oder Passwort falsch!');
}

button_login.onclick = async () => {
  await login();
};
