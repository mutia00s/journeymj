const cover = document.getElementById('cover');
const journal = document.getElementById('journal');
const openJournal = document.getElementById('openJournal');
const chapters = [...document.querySelectorAll('.chapter')];
const progressBar = document.getElementById('progressBar');
const chapterNav = document.getElementById('chapterNav');
const menuToggle = document.getElementById('menuToggle');
const bgMusic = document.getElementById('backgroundMusic');
const specialSong = document.getElementById('specialSong');
const musicToggle = document.getElementById('musicToggle');
const songToggle = document.getElementById('songToggle');
const musicStatus = document.getElementById('musicStatus');
const toast = document.getElementById('toast');

let currentChapter = 'intro';
let isPlaying = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function openSite() {
  cover.style.display = 'none';
  journal.classList.add('visible');
  showChapter('intro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
openJournal.addEventListener('click', openSite);

function showChapter(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('chapter')) return;
  chapters.forEach(chapter => chapter.classList.toggle('active-chapter', chapter.id === id));
  currentChapter = id;
  const index = chapters.findIndex(chapter => chapter.id === id);
  progressBar.style.width = `${((index + 1) / chapters.length) * 100}%`;
  chapterNav.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-go]').forEach(button => {
  button.addEventListener('click', () => showChapter(button.dataset.go));
});
document.getElementById('homeLink').addEventListener('click', event => {
  event.preventDefault();
  showChapter('intro');
});
menuToggle.addEventListener('click', () => chapterNav.classList.toggle('open'));
chapterNav.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => showChapter(button.dataset.go));
});

// Card pop-ups for awards and memories
const contentModal = document.getElementById('contentModal');
const contentModalTitle = document.getElementById('contentModalTitle');
const contentModalText = document.getElementById('contentModalText');
function openContentModal(title, message) {
  contentModalTitle.textContent = title;
  contentModalText.textContent = message;
  contentModal.classList.add('show');
  contentModal.setAttribute('aria-hidden', 'false');
}
function closeContentModal() {
  contentModal.classList.remove('show');
  contentModal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('.award-card, .memory-card').forEach(card => {
  card.addEventListener('click', () => openContentModal(card.dataset.title, card.dataset.message));
});
document.getElementById('closeContentModal').addEventListener('click', closeContentModal);
document.getElementById('okayModal').addEventListener('click', closeContentModal);
contentModal.addEventListener('click', event => {
  if (event.target === contentModal) closeContentModal();
});

// Letter envelope
const envelope = document.getElementById('openLetter');
const letterModal = document.getElementById('letterModal');
envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  window.setTimeout(() => {
    letterModal.classList.add('show');
    letterModal.setAttribute('aria-hidden', 'false');
  }, 250);
});
function closeLetter() {
  letterModal.classList.remove('show');
  letterModal.setAttribute('aria-hidden', 'true');
  envelope.classList.remove('open');
}
document.getElementById('closeLetter').addEventListener('click', closeLetter);
letterModal.addEventListener('click', event => {
  if (event.target === letterModal) closeLetter();
});

// Music: users can choose to play; browsers may block autoplay, so nothing starts automatically.
async function toggleAudio(audio, button, statusText) {
  if (!audio.querySelector('source')?.getAttribute('src')) {
    showToast('Tambahkan file lagu ke folder assets/music dulu, ya ♡');
    return;
  }
  const src = audio.querySelector('source').getAttribute('src');
  if (!src || src.endsWith('song.mp3') && !audio.dataset.ready) {
    // The file may be absent; play() will catch that case.
  }
  try {
    if (audio.paused) {
      // Pause the other player so two copies don't play together.
      [bgMusic, specialSong].filter(other => other !== audio).forEach(other => other.pause());
      await audio.play();
      if (button) button.textContent = 'Ⅱ';
      if (statusText) statusText.textContent = 'now playing ♫';
      isPlaying = true;
      musicToggle.textContent = 'Ⅱ';
      musicStatus.textContent = audio === specialSong ? 'special song playing' : 'music is playing';
      if (audio === specialSong) songToggle.textContent = 'Ⅱ';
    } else {
      audio.pause();
      if (button) button.textContent = audio === specialSong ? '▶' : '♫';
      if (statusText) statusText.textContent = 'a song for you';
      isPlaying = false;
      if (audio === specialSong) songToggle.textContent = '▶';
      if (audio === bgMusic) musicToggle.textContent = '♫';
      musicStatus.textContent = 'a song for you';
    }
  } catch (error) {
    showToast('Belum bisa memutar lagu. Pastikan file song.mp3 sudah ditambahkan ♡');
  }
}
musicToggle.addEventListener('click', () => toggleAudio(bgMusic, musicToggle, musicStatus));
songToggle.addEventListener('click', () => toggleAudio(specialSong, songToggle, musicStatus));

[bgMusic, specialSong].forEach(audio => {
  audio.addEventListener('ended', () => {
    if (audio === specialSong) songToggle.textContent = '▶';
    if (audio === bgMusic) musicToggle.textContent = '♫';
  });
  audio.addEventListener('timeupdate', () => {
    if (audio === specialSong && audio.duration) {
      document.getElementById('trackProgress').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
  });
});

// Final surprise + a tiny confetti-like sparkle burst
document.getElementById('finalSurprise').addEventListener('click', () => {
  const message = document.getElementById('finalMessage');
  message.hidden = false;
  document.getElementById('finalSurprise').textContent = 'surprise unlocked ♡';
  document.getElementById('finalSurprise').disabled = true;
  showToast('a little reminder: you did well ♡');
});
document.getElementById('replay').addEventListener('click', () => {
  cover.style.display = 'grid';
  journal.classList.remove('visible');
  chapters.forEach(chapter => chapter.classList.remove('active-chapter'));
  document.getElementById('finalMessage').hidden = true;
  document.getElementById('finalSurprise').disabled = false;
  document.getElementById('finalSurprise').textContent = 'one last surprise ♡';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Keyboard accessibility for modals
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeContentModal();
    closeLetter();
  }
});
