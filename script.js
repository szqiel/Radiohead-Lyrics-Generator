// Initialize the application
let allLyrics = [];
let currentLyric = null;
let lastLyricText = null;

// Load lyrics data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLyrics();
    
    // Initialize background with default image
    const albumCover = document.getElementById('albumCover');
    if (albumCover && albumCover.src) {
        updateBackgroundFromImage(albumCover);
    }
    
    // Add event listeners
    document.getElementById('generateBtn').addEventListener('click', generateRandomLyric);
    document.getElementById('resetBtn').addEventListener('click', resetDisplay);
});

// Load lyrics from JavaScript variable
function loadLyrics() {
    try {
        console.log('Loading lyrics from JavaScript variable...');
        allLyrics = RADIOHEAD_LYRICS.songs;
        console.log(`Successfully loaded ${allLyrics.length} songs`);
        
        if (allLyrics.length === 0) {
            console.warn('Warning: No songs found in the database');
            document.getElementById('lyricsText').textContent = 'No songs found in the database.';
        }
    } catch (error) {
        console.error('Error loading lyrics:', error);
        document.getElementById('lyricsText').textContent = `Error: ${error.message}`;
    }
}

// Generate a random lyric line
function generateRandomLyric() {
    if (allLyrics.length === 0) {
        document.getElementById('lyricsText').textContent = 'No lyrics data available.';
        return;
    }

    // Remove landing state if it exists
    const player = document.querySelector('.player');
    if (player) player.classList.remove('is-landing');

    let randomSong, randomLine;
    
    // Ensure we don't get the same lyric twice in a row
    const totalLines = allLyrics.reduce((acc, song) => acc + song.lines.length, 0);
    
    do {
        // Pick a random song
        randomSong = allLyrics[Math.floor(Math.random() * allLyrics.length)];
        // Pick a random line from that song
        randomLine = randomSong.lines[Math.floor(Math.random() * randomSong.lines.length)];
    } while (totalLines > 1 && randomLine === lastLyricText);

    lastLyricText = randomLine;
    
    // Store current lyric
    currentLyric = {
        text: randomLine,
        song: randomSong.song,
        album: randomSong.album,
        cover: randomSong.cover
    };

    // Display the lyric
    displayLyric(currentLyric);
}

// Display the lyric on the page with a smooth cross-fade transition
function displayLyric(lyric) {
    const lyricsText = document.getElementById('lyricsText');
    const songName = document.getElementById('songName');
    const albumName = document.getElementById('albumName');
    const albumCover = document.getElementById('albumCover');
    const progressBar = document.getElementById('lyricsProgress');
    const songInfo = document.querySelector('.song-info-container');

    // Create an array of elements to animate
    const animatedElements = [lyricsText, songInfo, albumCover];

    // Step 1: Add fade-out class to current content
    animatedElements.forEach(el => {
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
    });

    // Step 2: Wait for fade-out to complete (400ms) then update content
    setTimeout(() => {
        // Update text content
        lyricsText.textContent = `"${lyric.text}"`;
        songName.textContent = lyric.song;
        albumName.textContent = lyric.album;
        
        // Update image
        albumCover.src = lyric.cover;
        albumCover.alt = `${lyric.album} - ${lyric.song}`;

        // Update progress bar with a simulated song position (10% to 90%)
        const simulatedPosition = Math.floor(Math.random() * 81) + 10;
        progressBar.style.width = simulatedPosition + '%';

        // Update background
        updateBackgroundFromImage(albumCover);

        // Step 3: Remove fade-out and add fade-in class
        animatedElements.forEach(el => {
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
        });
    }, 400);
}

let activeLayer = 1;

// Update background using a two-layer cross-fade system to prevent blinking
function updateBackgroundFromImage(imgElement) {
    if (!imgElement.src || imgElement.src.includes('undefined')) return;

    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const nextLayer = activeLayer === 1 ? layer2 : layer1;
    const currentLayer = activeLayer === 1 ? layer1 : layer2;

    // 1. Set the new cover to the inactive layer
    nextLayer.style.setProperty('--album-cover', `url("${imgElement.src}")`);
    
    // 2. Cross-fade: Activate the next, Deactivate the current
    nextLayer.classList.add('active');
    currentLayer.classList.remove('active');

    // 3. Update state
    activeLayer = activeLayer === 1 ? 2 : 1;

    console.log(`Background cross-faded to layer ${activeLayer}`);
}

function fallbackColors() {
    const blobs = document.querySelectorAll('.blob');
    const colors = ['255, 0, 0', '0, 255, 0', '0, 0, 255', '255, 255, 0', '255, 0, 255'];
    blobs.forEach((blob, i) => {
        blob.style.background = `rgba(${colors[i]}, 0.3)`;
        blob.style.opacity = '0.5';
    });
}

// Reset the background to default
function resetBackground() {
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    
    layer1.classList.remove('active');
    layer2.classList.remove('active');
    layer1.classList.add('active'); // Reset to layer 1
    activeLayer = 1;
    
    document.documentElement.style.setProperty('--primary-color', '57, 169, 203');
}

// Reset the display to landing page state
function resetDisplay() {
    const lyricsText = document.getElementById('lyricsText');
    const songName = document.getElementById('songName');
    const albumName = document.getElementById('albumName');
    const albumCover = document.getElementById('albumCover');
    const progressBar = document.getElementById('lyricsProgress');

    // Restore landing page content
    lyricsText.textContent = 'Press generate to make your life more depressing';
    songName.textContent = 'Generate a Lyric...';
    albumName.textContent = 'RADIOHEAD';
    albumCover.src = 'assets/Radiohead.png';
    albumCover.alt = 'Radiohead';
    progressBar.style.width = '0%';
    
    currentLyric = null;
    
    // Update background using the default image
    updateBackgroundFromImage(albumCover);
}
