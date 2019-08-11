const API_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const API_AUTH = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "0de75d8a42984939959b9392363bcd50";
const SCOPE = "user-read-currently-playing";
const SONG_DISPLAY = document.querySelector('#song-info');

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
window.location.hash = "";

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
  if (HTTP.readyState === 4) {
    let songData = JSON.parse(HTTP.responseText);
    let SONG_INFO = "You're now listening to " + songData.item.name + " by " + songData.item.artists[0].name;
    SONG_DISPLAY.innerHTML = SONG_INFO;
    document.querySelector("#cover").src = songData.item.album.images[0].url;
  }
}
