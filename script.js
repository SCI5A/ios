// ==============================
// Tabs System
// ==============================
const tabBtns = document.querySelectorAll(".tab-btn");
const tabs = document.querySelectorAll(".tab");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ==============================
// Clock + Date (Simple)
// ==============================
const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${h}:${m}`;

  const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const dayName = days[now.getDay()];
  dateEl.textContent = `${dayName} • ${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

// ==============================
// Background System
// ==============================
const bgVideo = document.getElementById("bgVideo");
const bgImage = document.getElementById("bgImage");

const imageInput = document.getElementById("imageInput");
const videoInput = document.getElementById("videoInput");
const removeVideo = document.getElementById("removeVideo");

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  bgImage.style.backgroundImage = `url(${URL.createObjectURL(file)})`;

  bgVideo.pause();
  bgVideo.src = "";
  bgVideo.style.display = "none";
});

videoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  bgVideo.src = URL.createObjectURL(file);
  bgVideo.style.display = "block";
  bgVideo.play();

  bgImage.style.backgroundImage = "";
});

removeVideo.addEventListener("click", () => {
  bgVideo.pause();
  bgVideo.src = "";
  bgVideo.style.display = "none";
});

// ==============================
// Filters
// ==============================
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");

function updateFilters() {
  const filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%)`;
  bgVideo.style.filter = filter;
  bgImage.style.filter = filter;
}

brightness.addEventListener("input", updateFilters);
contrast.addEventListener("input", updateFilters);
saturation.addEventListener("input", updateFilters);

// ==============================
// Theme System
// ==============================
const themeBtn = document.getElementById("themeBtn");
const themeLabel = document.getElementById("themeLabel");

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    themeLabel.textContent = "Light Mode";
  } else {
    document.body.classList.remove("light");
    themeLabel.textContent = "Dark Mode";
  }
  localStorage.setItem("theme", theme);
}

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  applyTheme(isLight ? "dark" : "light");
});

applyTheme(localStorage.getItem("theme") || "dark");

// ==============================
// Audio System
// ==============================
const enableAudio = document.getElementById("enableAudio");
const notifSoundInput = document.getElementById("notifSoundInput");
const musicInput = document.getElementById("musicInput");

const notifSound = document.getElementById("notifSound");
const music = document.getElementById("music");

const notifVol = document.getElementById("notifVol");
const musicVol = document.getElementById("musicVol");

const testNotif = document.getElementById("testNotif");
const toggleMusic = document.getElementById("toggleMusic");

let audioEnabled = false;
let musicPlaying = false;

function updateVolumes() {
  notifSound.volume = notifVol.value / 100;
  music.volume = musicVol.value / 100;
}

notifVol.addEventListener("input", updateVolumes);
musicVol.addEventListener("input", updateVolumes);

enableAudio.addEventListener("click", async () => {
  try {
    updateVolumes();
    await notifSound.play().catch(()=>{});
    notifSound.pause();
    notifSound.currentTime = 0;

    audioEnabled = true;
    enableAudio.textContent = "✅ Audio Enabled";
  } catch {
    alert("المتصفح منع تشغيل الصوت، حاول مرة أخرى.");
  }
});

notifSoundInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  notifSound.src = URL.createObjectURL(file);
});

musicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  music.src = URL.createObjectURL(file);
});

testNotif.addEventListener("click", () => {
  if (!audioEnabled) return alert("اضغط Enable Audio أولاً");
  if (!notifSound.src) return alert("ارفع صوت إشعار أولاً");

  notifSound.currentTime = 0;
  notifSound.play().catch(()=>{});
});

toggleMusic.addEventListener("click", () => {
  if (!audioEnabled) return alert("اضغط Enable Audio أولاً");
  if (!music.src) return alert("ارفع موسيقى أولاً");

  if (!musicPlaying) {
    music.play().catch(()=>{});
    musicPlaying = true;
    toggleMusic.textContent = "⏸ إيقاف الموسيقى";
  } else {
    music.pause();
    musicPlaying = false;
    toggleMusic.textContent = "🎵 تشغيل / إيقاف";
  }
});

// ==============================
// Notifications Engine
// ==============================
const notifs = document.getElementById("notifs");
const maxNotifs = document.getElementById("maxNotifs");
const notifLife = document.getElementById("notifLife");

function showNotif(title, body) {
  const box = document.createElement("div");
  box.className = "notif";

  box.innerHTML = `
    <div class="title">${title}</div>
    <div class="body">${body}</div>
  `;

  notifs.prepend(box);

  // limit notifs
  const max = parseInt(maxNotifs.value, 10);
  while (notifs.children.length > max) {
    notifs.removeChild(notifs.lastChild);
  }

  if (audioEnabled && notifSound.src) {
    notifSound.currentTime = 0;
    notifSound.play().catch(()=>{});
  }

  setTimeout(() => {
    box.remove();
  }, parseInt(notifLife.value, 10));
}

const sampleNotifs = [
  ["Instagram", "📩 رسالة جديدة وصلت الآن"],
  ["WhatsApp", "🔔 لديك إشعار جديد"],
  ["TikTok", "🔥 فيديوك حقق 50K مشاهدة"],
  ["Snapchat", "👻 لديك سناب جديد"],
  ["Bank", "💳 تم تنفيذ عملية شراء ناجحة"],
  ["YouTube", "🎥 فيديو جديد على قناتك"],
  ["X", "📢 منشورك أصبح ترند"],
  ["Gmail", "✉️ لديك رسالة مهمة"],
];

// ==============================
// Countdown
// ==============================
const countdown = document.getElementById("countdown");
const countNum = document.getElementById("countNum");

function runCountdown(seconds) {
  return new Promise((resolve) => {
    countdown.classList.remove("hidden");

    let c = seconds;
    countNum.textContent = c;

    const t = setInterval(() => {
      c--;
      countNum.textContent = c;

      if (c <= 0) {
        clearInterval(t);
        countdown.classList.add("hidden");
        resolve();
      }
    }, 1000);
  });
}

// ==============================
// Recording / Preview
// ==============================
const startBtn = document.getElementById("startBtn");
const previewBtn = document.getElementById("previewBtn");
const stopBtn = document.getElementById("stopBtn");

const duration = document.getElementById("duration");
const delay = document.getElementById("delay");
const interval = document.getElementById("interval");

let notifTimer = null;
let endTimer = null;

function stopAll() {
  if (notifTimer) clearInterval(notifTimer);
  if (endTimer) clearTimeout(endTimer);

  notifTimer = null;
  endTimer = null;

  document.body.classList.remove("clean-mode");

  if (music.src) {
    music.pause();
    musicPlaying = false;
    toggleMusic.textContent = "🎵 تشغيل / إيقاف";
  }
}

function startEngine(durationSeconds) {
  notifs.innerHTML = "";

  const speed = parseInt(interval.value, 10);
  const endTime = Date.now() + (durationSeconds * 1000);

  notifTimer = setInterval(() => {
    if (Date.now() >= endTime) {
      stopAll();
      alert("✅ انتهى العرض! يمكنك إيقاف تسجيل الشاشة.");
      return;
    }

    const r = sampleNotifs[Math.floor(Math.random() * sampleNotifs.length)];
    showNotif(r[0], r[1]);

  }, speed);
}

previewBtn.addEventListener("click", () => {
  stopAll();
  startEngine(10);
});

stopBtn.addEventListener("click", () => {
  stopAll();
});

startBtn.addEventListener("click", async () => {
  stopAll();

  const d = parseInt(duration.value, 10);
  const del = parseInt(delay.value, 10);

  await runCountdown(del);

  document.body.classList.add("clean-mode");

  if (audioEnabled && music.src) {
    music.currentTime = 0;
    music.play().catch(()=>{});
    musicPlaying = true;
  }

  startEngine(d);

  endTimer = setTimeout(() => {
    stopAll();
    alert("✅ انتهى العرض! يمكنك الآن إيقاف تسجيل الشاشة.");
  }, d * 1000);
});

// ==============================
// Preset System
// ==============================
const savePreset = document.getElementById("savePreset");
const loadPreset = document.getElementById("loadPreset");
const presetFile = document.getElementById("presetFile");

savePreset.addEventListener("click", () => {
  const preset = {
    theme: document.body.classList.contains("light") ? "light" : "dark",
    brightness: brightness.value,
    contrast: contrast.value,
    saturation: saturation.value,
    duration: duration.value,
    delay: delay.value,
    interval: interval.value,
    notifVol: notifVol.value,
    musicVol: musicVol.value,
    maxNotifs: maxNotifs.value,
    notifLife: notifLife.value
  };

  const blob = new Blob([JSON.stringify(preset, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "UltraPreset.json";
  a.click();

  URL.revokeObjectURL(url);
});

loadPreset.addEventListener("click", () => {
  presetFile.click();
});

presetFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const preset = JSON.parse(reader.result);

      applyTheme(preset.theme || "dark");

      brightness.value = preset.brightness || 100;
      contrast.value = preset.contrast || 100;
      saturation.value = preset.saturation || 100;

      duration.value = preset.duration || 15;
      delay.value = preset.delay || 3;
      interval.value = preset.interval || 1500;

      notifVol.value = preset.notifVol || 70;
      musicVol.value = preset.musicVol || 35;

      maxNotifs.value = preset.maxNotifs || 5;
      notifLife.value = preset.notifLife || 6500;

      updateFilters();
      updateVolumes();

      alert("✅ تم تحميل الـ Preset بنجاح");
    } catch {
      alert("❌ ملف Preset غير صالح");
    }
  };
  reader.readAsText(file);
});
