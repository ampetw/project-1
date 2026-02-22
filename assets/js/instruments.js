/**
 * Play a tone and trigger rotation when an instrument card is clicked.
 */
(function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = AudioContext ? new AudioContext() : null;

  function playTone(freq, duration) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = typeof freq === 'number' ? freq : 440;
    osc.type = 'triangle';
    duration = duration || 0.35;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  function handleClick(e) {
    var card = e.currentTarget;
    var freq = parseFloat(card.getAttribute('data-freq')) || 440;
    playTone(freq);
    card.classList.remove('rotate');
    void card.offsetWidth;
    card.classList.add('rotate');
    setTimeout(function () {
      card.classList.remove('rotate');
    }, 650);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('.instrument-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', handleClick);
    }
  });
})();
