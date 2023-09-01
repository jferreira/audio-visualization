// An array to hold all loaded songs
let songs = [];
// Index to keep track of the currently playing song
let currentSongIndex = 0;
// Variable to store the current song title
let songTitle = "";

function preload() {
  // List all the MP3 files in the "audio/" folder
  let songFiles = [
    'audio/01 • Bicep • Glue.mp3',
    'audio/02 • DJ T. • Patci.mp3',
    'audio/03 • Roman Flugel • Wilkie.mp3',
    'audio/04 • Weval • Someday.mp3',
    // Add more songs here as needed
  ];

  // Load each song and store it in the 'songs' array
  for (let i = 0; i < songFiles.length; i++) {
    let song = loadSound(songFiles[i]);
    songs.push(song);
  }
}

function setup() {
  createCanvas(600, 600);
  // Set angle mode to DEGREES
  angleMode(DEGREES);
  // Set color mode to HSB
  colorMode(HSB);
  
  // Create a button to toggle play/pause
  button = createButton('Toggle Play');
  button.mousePressed(toggleSong);
  
  // Create a button to play the next song
  nextButton = createButton('Next Song');
  nextButton.mousePressed(playNextSong);
  
  // Create a button to play the previous song
  prevButton = createButton('Previous Song');
  prevButton.mousePressed(playPreviousSong);
  
  // Start playing the first song
  songs[currentSongIndex].play();
  
  // Create an FFT object for audio analysis
  fft = new p5.FFT(0.9, 128);
  // Calculate the space between lines for visualization
  space_between_lines = width / 128;
}

function toggleSong() {
  // If the current song is playing, pause it. Otherwise, play it.
  if (songs[currentSongIndex].isPlaying()) {
    songs[currentSongIndex].pause();
  } else {
    songs[currentSongIndex].play();
  }
}

function playNextSong() {
  // Pause the current song
  songs[currentSongIndex].pause();
  // Increment the current song index
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  // Play the new current song
  songs[currentSongIndex].play();
  // Update the displayed song title
  updateSongTitle();
}

function playPreviousSong() {
  // Pause the current song
  songs[currentSongIndex].pause();
  // Decrement the current song index
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  // Play the new current song
  songs[currentSongIndex].play();
  // Update the displayed song title
  updateSongTitle();
}

function draw() {
  // Set the background color to black
  background(0);

  // Analyze the audio spectrum using FFT
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i++) {
    // Set the fill color based on the spectrum frequency
    fill(i, 255, 255);
    let amp = spectrum[i];
    let y = map(amp, 0, 256, height, 0);
    // Draw rectangles for the audio visualization
    rect(i * space_between_lines, y, space_between_lines, height - y);
  }

  // Display the current song title at the bottom of the canvas
  fill(255); // Set text color to white
  textSize(20); // Set text size
  textAlign(CENTER); // Center-align the text
  text(songTitle, width / 2, height - 20); // Display the song title
}

function touchStarted() {
  // Resume the audio context to enable audio playback on touch devices
  getAudioContext().resume();
}

// Function to update the current song title
function updateSongTitle() {
  // Get the URL of the current song
  let filename = songs[currentSongIndex].url();
  // Split the URL by '/' to extract the filename
  let parts = filename.split('/');
  // Set the songTitle variable to the extracted filename
  songTitle = parts[parts.length - 1];
}
