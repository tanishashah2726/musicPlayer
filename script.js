const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const loopBtn = document.getElementById('loop');

//const star = document.getElementById('star');

const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const songs = [
    {name: 'Self Aware', artist: 'Temper City', src: 'songs/SelfAware-TemperCity.mp3'},
    {name: 'Babydoll', artist: 'Dominic Fike', src: 'songs/Babydoll.mp3'},
    {name: 'Earrings', artist: 'Malcolm Todd', src: 'songs/earrings.mp3'},
    {name: 'Sunflower', artist: 'Post Malone', src: 'songs/sunflower.mp3'},
    {name: 'Cicada', artist: 'Good Kid', src: 'songs/Cicada.mp3'},
    {name: 'stupid song', artist: 'Olivia Rodrigo', src: 'songs/stupidSong.mp3'}
];

let songIndex = 0;
let isPlaying = false;
let isLooping = false;

let isShuffling = false;
let shuffledPlaylist = [];
let currentIndex = 0;
let originalPlaylist = songs;


function loadSong(index) {
    title.textContent = songs[index].name;
    artist.textContent = songs[index].artist;
    audio.src = songs[index].src;
}

function playSong() {
    audio.play();
    playBtn.innerHTML = "<img src='images/pauseBtn.png' alt='pause'>";
    isPlaying = true;
}

function pauseSong() {
    audio.pause();
    playBtn.innerHTML = "<img src='images/playBtn.png' alt='play'>";
    isPlaying = false;
}

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
}

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
}

/*function shuffleSong() {
    isShuffling = !isShuffling;

    if (isShuffling){
        shuffleBtn.innerHTML = "<img src='images/shuffledBtn.png' alt='shuffle active'>";
        shufflePlaylist = songs
            .map((song, index) => ({ song, index }))
            .filter(({ index }) => index !== songIndex);

        for (let i = shufflePlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shufflePlaylist[i], shufflePlaylist[j]] = [shufflePlaylist[j], shufflePlaylist[i]];
        }

    }
    else{
        shuffleBtn.innerHTML = "<img src='images/shuffleBtn.png' alt='shuffle'>";
        shufflePlaylist = [];
    }
}*/

function shuffleSong() {
    isShuffling = !isShuffling;
    shuffleBtn.innerHTML = "<img src='images/shuffledBtn.png' alt='shuffle active'>";
    if (isShuffling) {
        shuffleBtn.innerHTML = "<img src='images/shuffledBtn.png' alt='shuffle active'>";
        shuffledPlaylist = songs.map((_, idx) => idx);

        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }
        currentIndex = 0;
        songIndex = shuffledPlaylist.indexOf(songIndex);
    }
    else {
        shuffleBtn.innerHTML = "<img src='images/shuffleBtn.png' alt='shuffle'>";
        songIndex = originalPlaylist[currentIndex];
    }
}


function loopSong() {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.classList.toggle('active', isLooping);
    if (isLooping) {
        loopBtn.innerHTML = "<img src='images/looped.png' alt='loop active'>";
    }
    else {
        loopBtn.innerHTML = "<img src='images/loop.png' alt='loop'>";
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds/60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

shuffleBtn.addEventListener('click', shuffleSong);
loopBtn.addEventListener('click', loopSong);

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener('input', () => {
    audio.volume = volume.value;
});

loadSong(songIndex);
audio.addEventListener('ended', nextSong);