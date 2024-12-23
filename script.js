// script.js

// 15 rakun resmi
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

// Basit dizi karıştırma (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Her reel'e "repeatCount" kadar (ör: 15x10=150) resim ekliyoruz
function populateReel(reelElement, repeatCount) {
  reelElement.innerHTML = "";
  const shuffled = shuffleArray(racoonImages);
  
  for (let i = 0; i < repeatCount; i++) {
    shuffled.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      reelElement.appendChild(img);
    });
  }
}

// Reel'i döndürme fonksiyonu (Hız yavaşlamalı)
function spinReel(reelElement, duration, callback) {
  let startTime = null;
  const initialSpeed = 30; // Başlangıç hızı (px/frame)
  const deceleration = 0.5; // Hızın yavaşlama oranı
  let currentSpeed = initialSpeed;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < duration) {
      const displacement = currentSpeed;
      let currentTop = parseFloat(reelElement.style.top) || 0;
      reelElement.style.top = (currentTop - displacement) + "px";

      // Hızı yavaşlat
      currentSpeed -= deceleration;
      if (currentSpeed < 5) currentSpeed = 5; // Minimum hız

      requestAnimationFrame(animate);
    } else {
      // Spin tamamlandı, reel'i durdur
      // Ortadaki resmin index'ini bul
      const finalIndex = getMiddleImageIndex(reelElement);
      reelElement.style.top = (-finalIndex * 100) + "px";
      callback(finalIndex);
    }
  }

  requestAnimationFrame(animate);
}

// Ortadaki resmi bulma fonksiyonu
function getMiddleImageIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;
  const reelHeight = reelElement.parentElement.clientHeight; // 300px
  const middlePixel = -currentTop + (reelHeight / 2);
  const imgHeight = 100;
  let index = Math.floor(middlePixel / imgHeight);

  const totalImages = reelElement.querySelectorAll("img").length;
  if (index < 0) index = 0;
  if (index >= totalImages) index = totalImages - 1;

  // Resimlerin tekrarlandığını göz önünde bulundurarak index'i normalize et
  index = index % racoonImages.length;

  return index;
}

document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  // Her reel'e 15 resmin 10 kez tekrarlanması (150 resim)
  const repeatCount = 10;
  populateReel(reel1Content, repeatCount);
  populateReel(reel2Content, repeatCount);
  populateReel(reel3Content, repeatCount);

  spinBtn.addEventListener("click", () => {
    resultDiv.textContent = "";

    // Her spin'de yeniden doldur (yeni shuffle)
    populateReel(reel1Content, repeatCount);
    populateReel(reel2Content, repeatCount);
    populateReel(reel3Content, repeatCount);

    // Spin süresi (her reel için farklı olabilir)
    const spinDuration = 2000; // 2 saniye

    let finalIndexes = [null, null, null];

    // Reel 1'i döndür
    spinReel(reel1Content, spinDuration, (finalIndex1) => {
      finalIndexes[0] = finalIndex1;
      checkFinal();
    });

    // Reel 2'yi döndür
    // Reel 2'nin spin süresini biraz daha uzatıyoruz (gerçek slot makinesine benzerlik için)
    spinReel(reel2Content, spinDuration + 500, (finalIndex2) => {
      finalIndexes[1] = finalIndex2;
      checkFinal();
    });

    // Reel 3'ü döndür
    // Reel 3'ün spin süresini biraz daha uzatıyoruz
    spinReel(reel3Content, spinDuration + 1000, (finalIndex3) => {
      finalIndexes[2] = finalIndex3;
      checkFinal();
    });

    // Tüm reel'ler durduğunda sonucu kontrol et
    function checkFinal() {
      if (finalIndexes.every(idx => idx !== null)) {
        const img1 = racoonImages[finalIndexes[0]];
        const img2 = racoonImages[finalIndexes[1]];
        const img3 = racoonImages[finalIndexes[2]];

        if (img1 === img2 && img2 === img3) {
          resultDiv.textContent = "Jackpot!";
        } else {
          resultDiv.textContent = "Tekrar dene!";
        }

        // Sonuçları sıfırla
        finalIndexes = [null, null, null];
      }
    }
  });
});
