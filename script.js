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

// Spin fonksiyonu: her 100ms'de bir resim değiştir
function spinReel(reelElement, duration, callback) {
  let currentStep = 0;
  const intervalTime = 100; // ms
  const totalSteps = Math.floor(duration / intervalTime); // 2000 / 100 = 20 steps
  const totalImages = reelElement.querySelectorAll("img").length;

  const spinInterval = setInterval(() => {
    // Her step, aşağı kaydır
    // currentStep mod totalImages
    reelElement.style.top = (-currentStep * 100) + "px";
    currentStep++;
    if (currentStep >= totalImages) {
      currentStep = 0;
    }
    
    // Spin tamamlandıysa dur
    if (currentStep >= totalSteps) {
      clearInterval(spinInterval);
      // Calculate final index
      const finalIndex = currentStep % racoonImages.length;
      // Set reel to final index
      reelElement.style.top = (-finalIndex * 100) + "px";
      callback(finalIndex);
    }
  }, intervalTime);
}

// Orta satırdaki resmi bul
function getMiddleImageIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;
  const reelHeight = reelElement.parentElement.clientHeight; // 300px
  const middlePixel = -currentTop + (reelHeight / 2);
  const imgHeight = 100;
  let index = Math.floor(middlePixel / imgHeight);

  const totalImages = reelElement.querySelectorAll("img").length;
  if (index < 0) index = 0;
  if (index >= totalImages) index = totalImages - 1;

  return index;
}

document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  // Her reel'e 15 resim, tekrarlayarak 150 resim ekliyoruz
  // repeatCount = 10: 15x10=150 resim
  populateReel(reel1Content, 10);
  populateReel(reel2Content, 10);
  populateReel(reel3Content, 10);

  spinBtn.addEventListener("click", () => {
    resultDiv.textContent = "";

    // Her spin'de yeniden shuffle ve populate
    populateReel(reel1Content, 10);
    populateReel(reel2Content, 10);
    populateReel(reel3Content, 10);

    // Spin süresi
    const spinDuration = 2000; // 2 saniye

    let finalIndexes = [null, null, null];

    // Reel 1'i döndür
    spinReel(reel1Content, spinDuration, (finalIndex1) => {
      finalIndexes[0] = finalIndex1;
      checkFinal();
    });

    // Reel 2'i döndür
    spinReel(reel2Content, spinDuration, (finalIndex2) => {
      finalIndexes[1] = finalIndex2;
      checkFinal();
    });

    // Reel 3'ü döndür
    spinReel(reel3Content, spinDuration, (finalIndex3) => {
      finalIndexes[2] = finalIndex3;
      checkFinal();
    });

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

        // Sıfırla
        finalIndexes = [null, null, null];
      }
    }
  });
});
