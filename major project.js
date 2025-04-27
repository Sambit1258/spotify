document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cards = document.querySelectorAll('.playable-card');
  const mainControls = {
    play: document.querySelector(".player-controls .play"),
    pause: document.querySelector(".player-controls .pause"),
    albumImg: document.querySelector(".album-img"),
    progressBar: document.querySelector(".progress-bar"),
    currentTime: document.querySelector(".curr-time"),
    totalTime: document.querySelector(".total-time")
  };

  // State
  let currentAudio = null;
  let isPlaying = false;

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const updatePlayer = () => {
    if (!currentAudio) return;
    
    mainControls.currentTime.textContent = formatTime(currentAudio.currentTime);
    mainControls.progressBar.value = currentAudio.currentTime;
    mainControls.progressBar.max = currentAudio.duration || 0;
    mainControls.totalTime.textContent = formatTime(currentAudio.duration) || "0:00";
  };

  const togglePlayback = () => {
    if (!currentAudio) return;
    
    isPlaying ? currentAudio.pause() : currentAudio.play();
    isPlaying = !isPlaying;
    
    // Update all buttons
    document.querySelectorAll('.play-button i').forEach(icon => {
      icon.style.display = icon.classList.contains('fa-play') ? 
        (isPlaying ? 'none' : 'inline') : 
        (isPlaying ? 'inline' : 'none');
    });
    
    mainControls.play.style.display = isPlaying ? 'none' : 'inline';
    mainControls.pause.style.display = isPlaying ? 'inline' : 'none';
  };

  // Setup cards
  cards.forEach(card => {
    const btn = card.querySelector('.play-button');
    const audio = card.querySelector('audio');
    
    btn.addEventListener('click', () => {
      if (currentAudio !== audio) {
        currentAudio?.pause();
        currentAudio = audio;
        mainControls.albumImg.src = card.querySelector('.card-img').src;
        audio.addEventListener('timeupdate', updatePlayer);
        if (audio.readyState > 0) updatePlayer();
      }
      togglePlayback();
    });
  });

  // Main controls
  mainControls.play.addEventListener('click', togglePlayback);
  mainControls.pause.addEventListener('click', togglePlayback);
  mainControls.pause.style.display = 'none';

  // Progress bar
  mainControls.progressBar.addEventListener('input', () => {
    if (currentAudio) {
      currentAudio.currentTime = mainControls.progressBar.value;
      updatePlayer();
    }
  });
});