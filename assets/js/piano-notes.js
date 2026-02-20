/**
 * Plays piano notes when mainbox-link elements are clicked.
 * Uses Web Audio API for synthesized piano-like tones.
 * Waits 2 seconds before navigating to the link.
 */

(function () {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = AudioContext ? new AudioContext() : null;

  const NOTE_DURATION = 2;

  const NOTE_FREQUENCIES = {
    'fsharp': 369.99,
    'gsharp': 415.30,
    'asharp': 466.16,
    'csharp': 554.37,
    'dsharp': 622.25,
    'fsharp-high': 739.99,
    'gsharp-high': 830.61
  };

  function playPianoNote(frequency, duration) {
    if (!audioCtx) return;
    duration = duration || NOTE_DURATION;
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    osc.type = 'triangle';
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  function handleMainboxClick(e) {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    var link = e.currentTarget;
    var note = link.getAttribute('data-piano-note');
    if (!note || !NOTE_FREQUENCIES[note]) return;
    e.preventDefault();
    var freq = NOTE_FREQUENCIES[note];
    playPianoNote(freq);
    var href = link.getAttribute('href');
    if (href) {
      setTimeout(function () {
        window.location.href = href;
      }, NOTE_DURATION * 1000);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('.mainbox-link[data-piano-note]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', handleMainboxClick);
    }
  });
})();
