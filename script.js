// script.js

// 15 tane NFT görselin
const racoonImages = [
  "images/racoons1.jpeg",
  "images/racoons2.jpeg",
  "images/racoons3.jpeg",
  "images/racoons4.jpeg",
  "images/racoons5.png",
  "images/racoons6.png",
  "images/racoons7.png",
  "images/racoons8.png",
  "images/racoons9.png",
  "images/racoons10.png",
  "images/racoons11.jpeg",
  "images/racoons12.png",
  "images/racoons13.png",
  "images/racoons14.jpeg",
  "images/racoons15.jpeg"
];

// Basit bir Fisher–Yates shuffle (diziyi rastgele sıralamak için)
function shuffleArray(array) {
  const arr = [...array]; // orijinali kopyala (zorunlu değil ama iyi)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// DOM elementlerini seç
const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");

spinBtn.addEventListener("click", () => {
  // Sonuç yazısını sıfırla
  resultDiv.textContent = "";

  // Her spin'de 3 AYRI rastgele sıralama
  const reel1 = shuffleArray(racoonImages);
  const reel2 = shuffleArray(racoonImages);
  const reel3 = shuffleArray(racoonImages);

  // 3 reel de index'lerini 0'dan başlatsın
  let idx1 = 0, idx2 = 0, idx3 = 0;

  // Ne kadar sürede dönsün?
  const intervalTime = 100;  // 0.1 saniyede 1 resim
  const spinDuration = 2000; // 2 saniye toplam spin

  // 1. Reel - her 100ms'de resim değiştir
  const interval1 = setInterval(() => {
    slot1.src = reel1[idx1];
    idx1++;
    if (idx1 >= reel1.length) idx1 = 0; // Biterse başa dön, beyaz ekran yok
  }, intervalTime);

  // 2. Reel
  const interval2 = setInterval(() => {
    slot2.src = reel2[idx2];
    idx2++;
    if (idx2 >= reel2.length) idx2 = 0;
  }, intervalTime);

  // 3. Reel
  const interval3 = setInterval(() => {
    slot3.src = reel3[idx3];
    idx3++;
    if (idx3 >= reel3.length) idx3 = 0;
  }, intervalTime);

  // 2 saniye (spinDuration) sonra durdur
  setTimeout(() => {
    clearInterval(interval1);
    clearInterval(interval2);
    clearInterval(interval3);

    // Durdurduğumuz AN'daki 3 resim eğer aynıysa = "Jackpot!"
    const finalSrc1 = slot1.src;
    const finalSrc2 = slot2.src;
    const finalSrc3 = slot3.src;

    if (finalSrc1 === finalSrc2 && finalSrc2 === finalSrc3) {
      resultDiv.textContent = "Jackpot!";
    } else {
      resultDiv.textContent = "Tekrar dene!";
    }
  }, spinDuration);
});
