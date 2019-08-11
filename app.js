let API_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
let API_AUTH = "https://accounts.spotify.com/authorize";
let CLIENT_ID = "0de75d8a42984939959b9392363bcd50";
let SCOPE = "user-read-currently-playing";

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
      if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
  }, {});

if (!hash.access_token) {
  window.location.replace(API_AUTH + '?response_type=token' + '&client_id=' + CLIENT_ID +
  '&scope=' + encodeURIComponent(SCOPE) +
  '&redirect_uri=' + encodeURIComponent("http://localhost:8000/"));
}

let HTTP = new XMLHttpRequest();
HTTP.open("GET", API_ENDPOINT);
HTTP.setRequestHeader("Authorization", 'Bearer ' + hash.access_token);
HTTP.send();
HTTP.onreadystatechange = (e) => {
  if (HTTP.readyState === 4) console.log(HTTP.responseText);
}
