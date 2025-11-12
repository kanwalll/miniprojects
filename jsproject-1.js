

document.addEventListener('DOMContentLoaded', function () {
  // nav-tab
  const navButtons = document.querySelectorAll('.nav-button');
  const sections = document.querySelectorAll('main section');
  const pageTitle = document.getElementById('pageTitle');
  function showTab(name) {
    sections.forEach(s => s.style.display = (s.id === name ? 'block' : 'none'));
    navButtons.forEach(nb => nb.classList.toggle('active',
      nb.dataset.tab === name));
    pageTitle.textContent = navButtons && Array.from(navButtons).find(n => n.dataset.tab === name)?.textContent.trim() || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navButtons.forEach(nb => nb.addEventListener('click', () => showTab(nb.dataset.tab)));

  // speech to text
  (function () {
    const mic = document.getElementById('micButton');
    const textBox = document.getElementById('speechText');
    const downloadBtn = document.getElementById('downloadTxt');
    const resetBtn = document.getElementById('resetTxt');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      textBox.value = 'Speech Recognition not supported in this browser.';
      mic.disabled = true;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = true;

    let isRecording = false;
    let finalTranscript = '';

    mic.addEventListener('click', () => {
      if (!isRecording) {
        recognition.start();
        isRecording = true;
        mic.style.background = '#eaf4ff';
      } else {
        recognition.stop();
        isRecording = false;
        mic.style.background = '';
      }
    });

    recognition.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += t + ' ';
        else interim += t;
      }
      textBox.value = finalTranscript + interim;
    };

    recognition.onerror = (e) => {
      textBox.value = 'Error: ' + e.error;
    };

    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([textBox.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'speech.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    //  Reset
    resetBtn.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
        isRecording = false;
        mic.style.background = '';
      }
      finalTranscript = '';
      textBox.value = '';
    });
  })();


  // slider
  (function () {
    const display = document.getElementById('display');
    const captionEl = document.getElementById('caption');
    const thumbsEl = document.getElementById('thumbs');
    const thumbWindow = document.getElementById('thumbWindow');
    const thumbNodes = Array.from(document.querySelectorAll('.thumb'));
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    let current = 0;
    let auto;

    if (thumbNodes.length === 0) return;

    function setActive(i) {
      if (i < 0) i = thumbNodes.length - 1;
      if (i >= thumbNodes.length) i = 0;
      const thumb = thumbNodes[i];
      const src = thumb.dataset.src;
      const caption = thumb.dataset.caption || '';

      display.style.backgroundImage = src ? `url("${src}")` : '';
      captionEl.textContent = caption;
      thumbNodes.forEach((t, idx) => {
        t.classList.toggle('active', idx === i);
      });

      current = i;
      scrollThumbsTo(i);
    }

    function scrollThumbsTo(index) {
      const visibleCount = 3;
      const thumb = thumbNodes[0];
      const gap = 10;
      const thumbW = thumb.offsetWidth;
      const start = Math.max(0, Math.min(index - Math.floor(visibleCount / 2), thumbNodes.length - visibleCount));
      const scrollPos = start * (thumbW + gap);
      thumbWindow.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
    thumbNodes.forEach(t => {
      t.addEventListener('click', () => {
        const idx = Number(t.dataset.index);
        setActive(idx);
        resetAuto();
      });
    });

    prev.addEventListener('click', () => {
      setActive(current - 1);
      resetAuto();
    });

    next.addEventListener('click', () => {
      setActive(current + 1);
      resetAuto();
    });

    function resetAuto() {
      clearInterval(auto);
      auto = setInterval(() => setActive(current + 1), 5000);
    }

    setActive(0);
    resetAuto();

    window.addEventListener('resize', () => scrollThumbsTo(current));
  })();

  // clock
  (function () {
    function updateClock() {
      const now = new Date();
      const h = now.getHours() % 12; const m = now.getMinutes();
      const s = now.getSeconds();
      const hDeg = (h * 30) + (m / 2); const mDeg = m * 6; const sDeg = s * 6;
      document.getElementById('hour').style.transform = `rotate(${hDeg}deg)`;
      document.getElementById('minute').style.transform = `rotate(${mDeg}deg)`;
      document.getElementById('second').style.transform = `rotate(${sDeg}deg)`;
    }
    updateClock(); setInterval(updateClock, 1000);
  })();
  // fan
  (function () {
    const fanSvg = document.getElementById('fan-svg');
    const btnOn = document.getElementById('btnOn'),
      btnOff = document.getElementById('btnOff'),
      btn1 = document.getElementById('btn1'),
      btn2 = document.getElementById('btn2'),
      btn3 = document.getElementById('btn3');

    function setSpeed(sec) {
      fanSvg.style.animationDuration = sec + 's';
      fanSvg.style.animationPlayState = 'running';
    }

    btnOn.addEventListener('click', () => setSpeed(2));
    btnOff.addEventListener('click', () => fanSvg.style.animationPlayState = 'paused');
    btn1.addEventListener('click', () => setSpeed(1.8));
    btn2.addEventListener('click', () => setSpeed(1));
    btn3.addEventListener('click', () => setSpeed(0.6));
  })();

  // 
  (function () {
    const gen = document.getElementById('genColor'); const box = document.getElementById('colorBox');
    const hexText = document.getElementById('hexText'); const copy = document.getElementById('copyColor');
    gen.addEventListener('click', () => {
      const c = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      box.style.background = c; hexText.textContent = c.toUpperCase();
    });
    copy.addEventListener('click', () => navigator.clipboard.writeText(hexText.textContent));
    document.getElementById('convertWeight').addEventListener('click', () => {
      const v = parseFloat(document.getElementById('weightInput').value);
      const out = document.getElementById('weightResult'); if (isNaN(v) || v <= 0) {
        out.textContent = 'Please enter a valid positive number';
        out.style.color = 'crimson'; return;
      } out.style.color = '';
      out.textContent = (v * 2.20462).toFixed(2) + ' lbs';
    });
  })();

  // theme (light/dark)
  (function () {
    const t = document.getElementById('themeToggle');
    t.addEventListener('change', () => {
      if (t.checked) {
        // Dark Mode
        document.body.style.background = '#121214';
        document.body.style.color = '#e9ecef';
        document.querySelector('.sidebar').style.background = '#1e1e1f';
        document.querySelector('.sidebar').style.color = '#e9ecef';

        document.querySelectorAll('.nav-button').forEach(btn => {
          btn.style.color = '#e9ecef';
        });

        document.querySelectorAll('.card-panel').forEach(c => {
          c.style.background = '#1e1e1f';
          c.style.color = '#e9ecef';
        });
      }
      else {
        // Light Mode
        document.body.style.background = '#f8f9fb';
        document.body.style.color = '#111';
        document.querySelector('.sidebar').style.background = '#fff';
        document.querySelector('.sidebar').style.color = '#111';

        document.querySelectorAll('.nav-button').forEach(btn => {
          btn.style.color = '#111';
        });

        document.querySelectorAll('.card-panel').forEach(c => {
          c.style.background = '#fff';
          c.style.color = '#111';
        });
      }
    });
  })();

  // Initialize speech
  showTab('speech');
});
