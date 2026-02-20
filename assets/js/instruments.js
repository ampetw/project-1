(function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = AudioContext ? new AudioContext() : null;

  var SOUNDS = {
    guzheng: { freq: 440, type: 'sine', duration: 0.5 },
    krar: { freq: 330, type: 'triangle', duration: 0.45 }
  };

  function playInstrumentSound(id) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var s = SOUNDS[id];
    if (!s) return;
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = s.freq;
    osc.type = s.type;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + s.duration);
    osc.start(now);
    osc.stop(now + s.duration);
  }

  function triggerSpin(card) {
    card.classList.remove('spin');
    card.offsetHeight;
    card.classList.add('spin');
    setTimeout(function () {
      card.classList.remove('spin');
    }, 650);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('.instrument-card');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener('click', function () {
          var id = card.getAttribute('data-instrument');
          if (id) {
            playInstrumentSound(id);
            triggerSpin(card);
          }
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      })(cards[i]);
    }
  });
})();
