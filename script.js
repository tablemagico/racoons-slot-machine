// script.js

// 15 NFT görselin:
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

// Basit dizi karıştırma
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Her reel'e (reelContent) 'repeatCount' kadar rastgele sıralanmış 15 resmi ekle
function populateReel(reelElement, repeatCount) {
  reelElement.innerHTML = ""; // varsa temizle

  for (let i = 0; i < repeatCount; i++) {
    // 15 resmi shuffle et
    const shuffled = shuffleArray(racoonImages);
    // Ekle
    shuffled.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      reelElement.appendChild(img);
    });
  }
}

// Her reel'i döndürme fonksiyonu
// reelElement => reel-content
// duration => kaç ms dönecek
// callback => durunca yapılacak işlem
function spinReel(reelElement, duration, callback) {
  reelElement.style.top = "0px";
  
  // Sabit hız
  const speed = 30; // px/frame
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    let currentTop = parseFloat(reelElement.style.top) || 0;

    // Yukarı kaydırma (currentTop - speed)
    reelElement.style.top = (currentTop - speed) + "px";

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      // Durunca callback
      callback();
    }
  }

  requestAnimationFrame(animate);
}

// Ortadaki resmi bul (Reel yüksekliği 180px => ortası ~90px)
function getMiddleImageIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;
  // Bir resmin yüksekliği (varsayılan ~100-120px olabilir,
  // net ölçmek için ilk resmi incelemek iyidir.)
  const firstImg = reelElement.querySelector("img");
  if (!firstImg) return 0;

  const imgHeight = firstImg.offsetHeight; // piksel cinsinden
  // Ortanın reel içinde kalması = ( -currentTop + 90 ) / imgHeight
  const middlePixel = -currentTop + 90;
  let index = Math.floor(middlePixel / imgHeight);

  // dizi sınırlarını aşma
  const totalImg = reelElement.querySelectorAll("img").length;
  if (index < 0) index = 0;
  if (index >= totalImg) index = totalImg - 1;

  return index;
}

// Ana program
document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  // Başlangıçta reel'leri dolduralım (3 veya 4 tekrarla)
  populateReel(reel1Content, 3);
  populateReel(reel2Content, 3);
  populateReel(reel3Content, 3);

  spinBtn.addEventListener("click", () => {
    resultDiv.textContent = "";

    // Her Spin'de yeniden doldur (yeni shuffle) istersen:
    populateReel(reel1Content, 3);
    populateReel(reel2Content, 3);
    populateReel(reel3Content, 3);

    // 2sn dönsün
    const spinDuration = 2000;

    // 1. Reel'i döndür
    spinReel(reel1Content, spinDuration, () => {
      // Durunca ortadaki resmi bul
      const idx1 = getMiddleImageIndex(reel1Content);
      finalizeResult(0, idx1);
    });

    // 2. Reel
    spinReel(reel2Content, spinDuration, () => {
      const idx2 = getMiddleImageIndex(reel2Content);
      finalizeResult(1, idx2);
    });

    // 3. Reel
    spinReel(reel3Content, spinDuration, () => {
      const idx3 = getMiddleImageIndex(reel3Content);
      finalizeResult(2, idx3);
    });
  });

  // Final index'ler
  let finalIndexes = [null, null, null];
  function finalizeResult(reelNumber, indexVal) {
    finalIndexes[reelNumber] = indexVal;
    // Bütün reel'ler durdu mu?
    if (finalIndexes.every(i => i !== null)) {
      // Hepsi durdu, bakalım resimler aynı mı?
      const reel1Images = reel1Content.querySelectorAll("img");
      const reel2Images = reel2Content.querySelectorAll("img");
      const reel3Images = reel3Content.querySelectorAll("img");

      const src1 = reel1Images[finalIndexes[0]].src;
      const src2 = reel2Images[finalIndexes[1]].src;
      const src3 = reel3Images[finalIndexes[2]].src;

      if (src1 === src2 && src2 === src3) {
        resultDiv.textContent = "Jackpot!";
      } else {
        resultDiv.textContent = "Tekrar dene!";
      }

      // Sıfırla
      finalIndexes = [null, null, null];
    }
  }
});
