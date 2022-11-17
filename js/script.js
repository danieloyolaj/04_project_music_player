//Selecting different parts of the html to avoid repeating the same document.querySelector every time
const wrapper = document.querySelector(".wrapper");
const musicImg = document.querySelector(".img-area img");
const musicName = document.querySelector(".song-details .name");
const musicArtist = document.querySelector(".song-details .artist");
const playPauseBtn = document.querySelector(".play-pause");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const mainAudio = document.querySelector("#main-audio");
const progressArea = document.querySelector(".progress-area");
const progressBar = document.querySelector(".progress-bar");
const musicList = document.querySelector(".music-list");
const moreMusicBtn = document.querySelector("#more-music");
const closemoreMusic = document.querySelector("#close");

//Returns a random number between 1 and 7
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let isMusicPaused = true;

//Loads a music
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();//Plays the song chosen by the loadMusic function

});

// Loads the music with all its info
function loadMusic(indexNumber){
    musicName.innerText = allMusic[indexNumber -1].name;
    musicArtist.innerText = allMusic[indexNumber -1].artist;
    musicImg.src = `images/${allMusic[indexNumber -1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumber -1].src}.mp3`;
}

//Plays the song
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pauses the song
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//Previous music
function prevMusic(){
    musicIndex--; //Decrement musicIndex by 1
    //If musicIndex is less than 1 then musicIndex will be the array
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//Next music
function nextMusic(){
    musicIndex++; //Decrement musicIndex by 1
    //If musicIndex is greater than array length then musicIndex will be 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// Events listeners for each button

//Play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    //If isMusicPlay is true then call pauseMusic else call playMusic
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});

prevBtn.addEventListener("click", () => {
    prevMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
});

//For the audio
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    
    //This will change the progressBar width
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuration = wrapper.querySelector(".max-duration");
    
    mainAudio.addEventListener("loadeddata", () => {
        //update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if(totalSec < 10){ //if sec is less than 10 then add 0 before the second
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //updating playing song current time
    let currenMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){//if sec is less than 10 then add 0 before the second
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currenMin}:${currentSec}`;
});

//Updating the progress bar when clicking it on any part
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; //Gets the width of progress bar
    let clickedOffsetX = e.offsetX; //Gets the offset x value
    let songDuration = mainAudio.duration; //Gets the song total duration

    //Plays the song based on the clicked offset x, progressWidth and song duration
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); // calling playMusic function
    playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song lopped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

//When ending the song do what's necessary depending on the repeatBtn state
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic(); //calling the next music function
            break;
        
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);

            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

//close more music
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});

//Showing the list 
const ulTag = wrapper.querySelector("ul");

for(let i = 0; i < allMusic.length; i++){
    let liTag = `
        <li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
        </li>
    `;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    //Puts the total seconds of each song
    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
        liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");

    for(let j = 0; j < allLiTag.length; j++){
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        //Checks if it contains the playing tag
        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");

            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = addDuration;
        }

        //Checking if the allLiTag is == the music index, if it is, we'll add a class ""playing"
        if(allLiTag[j].getAttribute("li-index") == musicIndex){
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}


