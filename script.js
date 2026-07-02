/* ===================================================
   MATCH FLOW v1.0
   Cardigan Town FC Tournament Display
=================================================== */

const SETTINGS_FILE = "config/settings.json";

let divisions = [];
let currentIndex = 0;
let rotationTimer = null;

const frame = document.getElementById("leagueFrame");
const currentDivision = document.getElementById("currentDivision");
const nextDivision = document.getElementById("nextDivision");
const progressBar = document.getElementById("progressBar");
const tickerText = document.getElementById("tickerText");

async function loadApplication() {

    try {

        const settingsResponse = await fetch(SETTINGS_FILE);

        if (!settingsResponse.ok) {
            throw new Error("Unable to load settings.json");
        }

        const settings = await settingsResponse.json();

        const playlistResponse = await fetch(`config/${settings.playlist}.json`);

        if (!playlistResponse.ok) {
            throw new Error("Unable to load playlist");
        }

        divisions = await playlistResponse.json();

        if (!divisions.length) {
            throw new Error("Playlist is empty");
        }

        if (settings.ticker) {
            tickerText.textContent = settings.ticker;
        }

        showDivision(0);

    }

    catch (error) {

        console.error(error);

        currentDivision.textContent = "Error";
        nextDivision.textContent = "Check Console";

    }

}

function showDivision(index) {

    clearTimeout(rotationTimer);

    currentIndex = index;

    const division = divisions[index];

    const next = divisions[(index + 1) % divisions.length];

    currentDivision.textContent = division.name;

    nextDivision.textContent = next.name;

    frame.classList.add("fade-out");

    setTimeout(() => {

        frame.src = division.url;

        frame.classList.remove("fade-out");
        frame.classList.add("fade-in");

    }, 250);

    animateProgress(division.duration);

    rotationTimer = setTimeout(() => {

        showDivision((currentIndex + 1) % divisions.length);

    }, division.duration * 1000);

}

function animateProgress(seconds) {

    progressBar.style.transition = "none";
    progressBar.style.width = "100%";

    void progressBar.offsetWidth;

    progressBar.style.transition = `width ${seconds}s linear`;
    progressBar.style.width = "0%";

}

loadApplication();