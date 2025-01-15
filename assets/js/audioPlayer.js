import playList from "./playList.js";

createPlaylistElements();

const audioSlider = document.querySelector('.audio__slider');
const playPrevButton = document.querySelector('.button_play-prev');
const playNextButton = document.querySelector('.button_play-next');
const playPauseButton = document.querySelector('.button_play');
const playlistItem = document.querySelectorAll('.audio__song');
const currentSong = document.querySelector('.audio__current-song');
const volumeSlider = document.querySelector('.audio__volume-slider');
const volumeButton = document.querySelector('.button_volume');

const audio = document.querySelector('audio');
const durationText = document.querySelector('.audio__duration');
const currentTimeText = document.querySelector('.audio__current-time');

let currentTime = audio.currentTime;
let songNumber = 0;
let isPlay = false;
let defaultVolume = 0.05;

for (let i = 0; i < playlistItem.length; i++) {
  playlistItem[i].addEventListener('click', () => {
    const previousSongNumber = songNumber;
    if (playlistItem[i].children[0].classList.contains('button_pause')) {
      pauseAudio();
    } else {
      songNumber = i;
      if (previousSongNumber !== songNumber) {
        currentTime = 0;
      }
      playAudio();
      showCurrentTime();
    }
    togglePlayIcon(playPauseButton);
    toggleCurrentSongIcon();
  });
}

window.addEventListener('load', () => {
  audio.volume = defaultVolume;
});

audioSlider.addEventListener('input', (event) => {
  showSliderProgress(event.target);
  audio.currentTime = event.target.value;
});

volumeSlider.addEventListener('input', (event) => {
  setVolume(event.target.value);
  if (audio.volume === 0) {
    toggleVolumeIcon();
  } else if (volumeButton.classList.contains('button_volume-mute')) {
    toggleVolumeIcon();
  }
})

volumeButton.addEventListener('click', volumeButtonHandler);

playPauseButton.addEventListener('click', playButtonHandler);

playPrevButton.addEventListener('click', playPrevious);
playNextButton.addEventListener('click', playNext);

audio.addEventListener('loadedmetadata', () => {
  showSongDuration(audio.duration);
  audioSlider.max = Math.round(audio.duration);
  showPlayingSong();
  toggleCurrentSongIcon();
})

function createPlaylistElements() {
  const playlist = document.querySelector('.audio__playlist');
  for (let i = 0; i < playList.length; i++) {
    const songTitle = playList[i].title;
    const playlistItem = document.createElement('li');
    playlistItem.className = 'audio__song';
    playlistItem.innerHTML = `
    <span class="audio__song-icon button button_play"></span>
    <p class="audio__song-name">${songTitle}</p>`
    playlist.appendChild(playlistItem);
  }
}

function toggleCurrentSongIcon() {
  const songsIcons = document.querySelectorAll('.audio__song-icon');
  songsIcons.forEach(icon => {
    icon.classList.remove('button_pause');
    icon.classList.add('button_play');
  })
  togglePlayIcon(songsIcons[songNumber]);
}

function playAudio() {
  isPlay = true;
  audio.src = playList[songNumber].src;
  audio.currentTime = currentTime;
  audio.play();
}

function pauseAudio() {
  isPlay = false;
  currentTime = audio.currentTime;
  audio.pause();
}

function playNext() {
  songNumber = (songNumber + 1) % playList.length;
  currentTime = 0;
  audioSlider.value = 0;
  
  if (isPlay) {
    playAudio();
  } else {
    playButtonHandler(playPauseButton);
  }
}

function playPrevious() {
  songNumber = (songNumber === 0) ? playList.length - 1 : --songNumber;
  currentTime = 0;
  audioSlider.value = 0;

  if (isPlay) {
    playAudio();
  } else {
    playButtonHandler(playPauseButton);
  }
}

function playButtonHandler() {
  if (isPlay) {
    pauseAudio();
  } else {
    playAudio();
    showCurrentTime();
  }

  togglePlayIcon(playPauseButton);
  toggleCurrentSongIcon();
}

function togglePlayIcon(button) {
  if (isPlay) {
    button.classList.remove('button_play');
    button.classList.add('button_pause');
  } else {
    button.classList.remove('button_pause');
    button.classList.add('button_play');
  }
}

function showCurrentTime() {
  const minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  currentTimeText.textContent = `${minutes}:${seconds}`;
  
  if (isPlay) {
    setTimeout(showCurrentTime, 1000);
    audioSlider.value = Math.floor(audio.currentTime);
    showSliderProgress(audioSlider);
  }
  if (audio.currentTime === audio.duration) {
    audio.currentTime = 0;
    playNext();
  }
}

function showSongDuration(duration) { 
  const minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  durationText.textContent = `${minutes}:${seconds}`;
}

function showSliderProgress(input) {
  const progressWidth = (input.value / input.max) * 100 + '%';
  input.style.setProperty('--slider-progress', progressWidth);
}

function showPlayingSong() {
  currentSong.textContent = playList[songNumber].title;
  if (!currentSong.classList.contains('active')) {
    currentSong.classList.toggle('active');
  }
}

function setVolume(volume) {
  audio.volume = volume / 1000;
}

function toggleVolumeIcon() {
  volumeButton.classList.toggle('button_volume');
  volumeButton.classList.toggle('button_volume-mute');
}

function volumeButtonHandler() {
  if (audio.volume) {
    audio.volume = 0;
  } else {
    setVolume(volumeSlider.value);
  }
  toggleVolumeIcon();
}