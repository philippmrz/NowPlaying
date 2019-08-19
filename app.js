(function() {
  const API_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
  const API_AUTH = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = "0de75d8a42984939959b9392363bcd50";
  const SCOPE = "user-read-currently-playing";
  const SONG_NAME_P = document.querySelector('#song-name');
  const ARTIST_NAME_P = document.querySelector('#artist-name');
  const COVER = document.querySelector("#cover");

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
    '&redirect_uri=' + encodeURIComponent("https://philippmrz.github.io/NowPlaying/"));
  }

  let HTTP = new XMLHttpRequest();
  HTTP.open("GET", API_ENDPOINT);
  HTTP.setRequestHeader("Authorization", 'Bearer ' + hash.access_token);
  HTTP.send();
  HTTP.onreadystatechange = (e) => {
    if (HTTP.readyState === 4) {
      let songData = JSON.parse(HTTP.responseText);
      let songName = songData.item.name;
      let artistName = songData.item.artists[0].name;
      SONG_NAME_P.innerHTML = songName;
      ARTIST_NAME_P.innerHTML = artistName;
      COVER.src = songData.item.album.images[0].url;
      COVER.addEventListener('load', function() {
        let vibrant = new Vibrant(COVER);
        let swatches = vibrant.swatches();
        document.querySelector("body").style.backgroundColor = swatches["DarkVibrant"].getHex();
        document.querySelector("body").style.color = swatches["LightVibrant"].getHex();

        document.querySelector("#vibrant").style.backgroundColor = swatches["Vibrant"].getHex();
        document.querySelector("#muted").style.backgroundColor = swatches["Muted"].getHex();
        document.querySelector("#dark-vibrant").style.backgroundColor = swatches["DarkVibrant"].getHex();
        document.querySelector("#dark-muted").style.backgroundColor = swatches["DarkMuted"].getHex();
        document.querySelector("#light-vibrant").style.backgroundColor = swatches["LightVibrant"].getHex();

        for (let swatch in swatches) {
          if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
              console.log(swatch, swatches[swatch].getHex())
          }
        }
     });
    }
  }
}())
