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

// Extract dominant color from image and update background
function updateBackgroundFromImage(imgElement) {
    imgElement.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = imgElement.naturalWidth || imgElement.width || 100;
            canvas.height = imgElement.naturalHeight || imgElement.height || 100;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;
            
            ctx.drawImage(imgElement, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Calculate average color
            let r = 0, g = 0, b = 0;
            const pixelCount = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            r = Math.floor(r / pixelCount);
            g = Math.floor(g / pixelCount);
            b = Math.floor(b / pixelCount);

            // Update CSS variables
            const root = document.documentElement;
            root.style.setProperty('--primary-color', `${r}, ${g}, ${b}`);
            root.style.setProperty('--primary-hex', `rgb(${r}, ${g}, ${b})`);

            // Create darker and lighter versions for gradient
            const darkR = Math.floor(r * 0.5);
            const darkG = Math.floor(g * 0.5);
            const darkB = Math.floor(b * 0.5);

            const lighterR = Math.floor(r * 0.25);
            const lighterG = Math.floor(g * 0.25);
            const lighterB = Math.floor(b * 0.25);

            // Update body background with gradient
            document.body.style.background = `linear-gradient(135deg, rgb(${lighterR}, ${lighterG}, ${lighterB}) 0%, rgb(${darkR}, ${darkG}, ${darkB}) 100%)`;

            console.log(`Updated background colors: RGB(${r}, ${g}, ${b})`);
        } catch (error) {
            console.log('Could not extract image colors, using default background');
        }
    };
    
    imgElement.onerror = function() {
        console.error('Failed to load album cover image:', imgElement.src);
    };

    // Trigger onload if image is already cached
    if (imgElement.complete) {
        imgElement.onload();
    }
}

// Reset the display
function resetDisplay() {
    document.getElementById('lyricsText').textContent = 'Click generate to get a random lyric line...';
    document.getElementById('songName').textContent = 'Select a lyric';
    document.getElementById('albumName').textContent = 'Radiohead';
    document.getElementById('albumCover').src = '';
    document.getElementById('lyricsProgress').style.width = '0%';
    currentLyric = null;
}
