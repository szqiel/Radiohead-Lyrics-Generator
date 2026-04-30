// Initialize the application
let allLyrics = [];
let currentLyric = null;

// Load lyrics data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLyrics();
    
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

    // Pick a random song
    const randomSong = allLyrics[Math.floor(Math.random() * allLyrics.length)];
    
    // Pick a random line from that song
    const randomLine = randomSong.lines[Math.floor(Math.random() * randomSong.lines.length)];
    
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

// Display the lyric on the page
function displayLyric(lyric) {
    const lyricsText = document.getElementById('lyricsText');
    const songName = document.getElementById('songName');
    const albumName = document.getElementById('albumName');
    const albumCover = document.getElementById('albumCover');
    const progressBar = document.getElementById('lyricsProgress');

    lyricsText.textContent = `"${lyric.text}"`;
    songName.textContent = lyric.song;
    albumName.textContent = lyric.album;
    albumCover.src = lyric.cover;
    albumCover.alt = `${lyric.album} - ${lyric.song}`;

    // Update progress bar based on lyrics length
    const progress = Math.min((lyric.text.length / 150) * 100, 100);
    progressBar.style.width = progress + '%';

    // Update background with album cover colors
    updateBackgroundFromImage(albumCover);
}

// Extract dominant colors from image and update background blobs
const colorThief = new ColorThief();

function updateBackgroundFromImage(imgElement) {
    if (imgElement.complete) {
        processImage(imgElement);
    } else {
        imgElement.onload = function() {
            processImage(imgElement);
        };
    }
}

function processImage(imgElement) {
    try {
        // Extract a palette of 5 colors
        const palette = colorThief.getPalette(imgElement, 5);
        const blobs = document.querySelectorAll('.blob');
        
        palette.forEach((color, index) => {
            if (blobs[index]) {
                const rgb = color.join(', ');
                blobs[index].style.setProperty('--blob-color', rgb);
                blobs[index].style.background = `rgba(${rgb}, 0.6)`;
            }
        });

        // Also update primary color for other UI elements
        const dominant = palette[0].join(', ');
        document.documentElement.style.setProperty('--primary-color', dominant);
        
        console.log('Background blobs updated with new palette');
    } catch (error) {
        console.error('Error extracting palette:', error);
    }
}

// Reset the background to default
function resetBackground() {
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach(blob => {
        blob.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    document.documentElement.style.setProperty('--primary-color', '57, 169, 203');
}

// Reset the display
function resetDisplay() {
    document.getElementById('lyricsText').textContent = 'Click generate to get a random lyric line...';
    document.getElementById('songName').textContent = 'Select a lyric';
    document.getElementById('albumName').textContent = 'Radiohead';
    document.getElementById('albumCover').src = '';
    document.getElementById('lyricsProgress').style.width = '0%';
    currentLyric = null;
    resetBackground();
}
