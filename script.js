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

// Basit shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Her reel'e "satirSayisi" kadar (ör: 9-10) resim ekliyoruz ki rahat dönsün
// 3 satır ekranda gözükecek, 6-7 satırı da dönme animasyonu sırasında kullanılır.
// Rastgele 15 resimden seçilip eklenebilir
function populateReel(reelElement, satirSayisi) {
  reelElement.innerHTML = "";
  // Tüm resimleri shuffle et
  const shuffled = shuffleArray(racoonImages);

  // satirSayisi kadar resim ekle (tekrar da olabilir)
  for (let i = 0; i < satirSayisi; i++) {
    // i, 15'ten büyükse mod al, 0-14 arası index tekrar kullansın
    const index = i % shuffled.length; 
    const img = document.createElement("img");
    img.src = shuffled[index];
    reelElement.appendChild(img);
  }
}

// Dikey kaydırma animasyonu
// reelElement = reel-content
// duration = kaç ms dönecek
// callback = durunca yapılacak işlem
function spinReel(reelElement, duration, callback) {
  reelElement.style.top = "0px";
  let startTime = null;
  // Her frame'de ne kadar piksel kaydıralım? (örnek sabit hız)
  const speed = 20; // px per frame (isteğe göre ayarla)

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    let currentTop = parseFloat(reelElement.style.top) || 0;

    // Yukarı kaydır
    reelElement.style.top = (currentTop - speed) + "px";

    // Daha bitmedi, devam
    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      // Bitti, callback
      callback();
    }
  }

  requestAnimationFrame(animate);
}

// Orta satır => 2. satır. (satır yüksekliği = 100px, reel toplam = 300px)
// "Ortada hangi resim var?" => top offset'i hesaba katmalıyız.
function getMiddleIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;

  // Her satır 100px
  // Orta satırın tam ortası: 150px (toplam 300px / 2)
  const middlePixel = -currentTop + 150;

  // Kaçıncı satırdayız?
  // (0. satır: 0-100px, 1. satır: 100-200px, 2. satır: 200-300px, ...)
  let rowIndex = Math.floor(middlePixel / 100);

  // reelElement içindeki toplam satır sayısı
  const totalRows = reelElement.querySelectorAll("img").length;
  if (rowIndex < 0) rowIndex = 0;
  if (rowIndex >= totalRows) rowIndex = totalRows - 1;

  return rowIndex;
}

document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  // Başlangıçta dolduralım (örnek 9 satırlık)
  populateReel(reel1Content, 9);
  populateReel(reel2Content, 9);
  populateReel(reel3Content, 9);

  spinBtn.addEventListener("click", () => {
    resultDiv.textContent = "";

    // Her spin'de tekrar doldur (yeni shuffle):
    populateReel(reel1Content, 9);
    populateReel(reel2Content, 9);
    populateReel(reel3Content, 9);

    // 2 sn dönsün
    const spinDuration = 2000;
    let finalIndexes = [null, null, null];

    spinReel(reel1Content, spinDuration, () => {
      finalIndexes[0] = getMiddleIndex(reel1Content);
      checkFinal();
    });
    spinReel(reel2Content, spinDuration, () => {
      finalIndexes[1] = getMiddleIndex(reel2Content);
      checkFinal();
    });
    spinReel(reel3Content, spinDuration, () => {
      finalIndexes[2] = getMiddleIndex(reel3Content);
      checkFinal();
    });

    // Bütün reel'ler durunca sonucu kontrol edelim
    function checkFinal() {
      if (finalIndexes.every(idx => idx !== null)) {
        // Hepsi durdu
        const img1 = reel1Content.querySelectorAll("img")[finalIndexes[0]].src;
        const img2 = reel2Content.querySelectorAll("img")[finalIndexes[1]].src;
        const img3 = reel3Content.querySelectorAll("img")[finalIndexes[2]].src;
        
        if (img1 === img2 && img2 === img3) {
          resultDiv.textContent = "Jackpot!";
        } else {
          resultDiv.textContent = "Tekrar dene!";
        }
        // sıfırla
        finalIndexes = [null, null, null];
      }
    }
  });
});
