const PLAYLIST = "config/saturday.json";

let divisions = [];
let currentIndex = 0;
let countdown = 0;

const frame = document.getElementById("leagueFrame");
const currentDivision = document.getElementById("currentDivision");
const nextDivision = document.getElementById("nextDivision");
const timer = document.getElementById("timer");

async function loadPlaylist() {
    try {
        const response = await fetch(PLAYLIST);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        divisions = await response.json();

        if (divisions.length === 0) {
            throw new Error("Playlist is empty");
        }

        startDivision(0);

    } catch (error) {
        console.error(error);
        currentDivision.textContent = "Playlist Error";
        nextDivision.textContent = "-";
        timer.textContent = "--";
    }
}

function startDivision(index) {

    currentIndex = index;

    const division = divisions[index];
    const next = divisions[(index + 1) % divisions.length];

    frame.src = division.url;

    currentDivision.textContent = division.name;
    nextDivision.textContent = next.name;

    countdown = division.duration;
    timer.textContent = countdown;
}

setInterval(() => {

    if (divisions.length === 0) return;

    countdown--;

    timer.textContent = countdown;

    if (countdown <= 0) {

        startDivision((currentIndex + 1) % divisions.length);

    }

}, 1000);

loadPlaylist();