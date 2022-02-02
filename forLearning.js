function g(params) {
  const url = new URLSearchParams(window.location.search);
  url.append('city', 'lal');
  url.append('country', 'sdlsfd');
  url.append('state', 'desf');
  url.append('zip', 'kdif');
  url.append('lat', 324);
  url.append('lon', 54);
  let l = document.location.pathname + '?' + url;
  console.log(l);
  console.log(url);
  // window.location.href = l;
  console.log(window.location.search);
}

g()