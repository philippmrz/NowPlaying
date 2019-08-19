(function() {
  const API_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
  const API_AUTH = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = "0de75d8a42984939959b9392363bcd50";
  const SCOPE = "user-read-currently-playing";
  const SONG_NAME_P = document.querySelector('#song-name');
  const ARTIST_NAME_P = document.querySelector('#artist-name');
  const COVER = document.querySelector("#cover");


  const hash = extractHash();

  //Redirect client to Spotify for authentication if not done already
  if (!hash.access_token) {
    window.location.replace(API_AUTH + '?response_type=token' + '&client_id=' + CLIENT_ID +
    '&scope=' + encodeURIComponent(SCOPE) +
    '&redirect_uri=' + encodeURIComponent("https://philippmrz.github.io/NowPlaying/"));
  }
  setInterval(updateSong, 5000);


  function updateSong() {
    let req = requestSongInfo();

    req.onreadystatechange = (e) => {
        if (req.readyState === 4 && req.status == 200) buildPage(JSON.parse(req.responseText));
    };
  }


  function extractHash(){
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
    return hash;
  }

  function requestSongInfo() {
    let HTTP = new XMLHttpRequest();
    HTTP.open("GET", API_ENDPOINT);
    HTTP.setRequestHeader("Authorization", 'Bearer ' + hash.access_token);
    HTTP.send();
    return HTTP;
  }

  function buildPage(songData) {
    let songName = songData.item.name;
    let artistName = songData.item.artists[0].name;

    //Check if song actually changed before rebuilding page
    if (songName != SONG_NAME_P.innerHTML && artistName != ARTIST_NAME_P) {
      //Fill appropriate html elements with information from API
      SONG_NAME_P.innerHTML = songName;
      ARTIST_NAME_P.innerHTML = artistName;
      COVER.src = songData.item.album.images[0].url;

      //Let vibrant.js extract colors from cover image and use these colors to color the page
      COVER.addEventListener('load', function() {
        let vibrant = new Vibrant(COVER);
        let swatches = vibrant.swatches();
        colorPage(swatches);
      });
    }
  }


  function colorPage(swatches) {
    const GRAD = "linear-gradient(" + swatches["DarkVibrant"].getHex() + ", " + swatches["Vibrant"].getHex() + ")";
    document.querySelector("body").style.background = GRAD;
    document.querySelector("body").style.color = swatches["LightVibrant"].getHex();

    document.querySelector("#vibrant").style.backgroundColor = swatches["Vibrant"].getHex();
    document.querySelector("#muted").style.backgroundColor = swatches["Muted"].getHex();
    document.querySelector("#dark-vibrant").style.backgroundColor = swatches["DarkVibrant"].getHex();
    document.querySelector("#dark-muted").style.backgroundColor = swatches["DarkMuted"].getHex();
    document.querySelector("#light-vibrant").style.backgroundColor = swatches["LightVibrant"].getHex();
  }
}())










let i = 0;
document.querySelector("#cover").addEventListener('click', () => {
  i++;
  if (i >= 10) document.querySelector("#color-cont").style.display = "flex";
});
