// script.js

document.addEventListener("DOMContentLoaded", function() {
    const reel1Content = document.getElementById("reel1-content");
    const reel2Content = document.getElementById("reel2-content");
    const reel3Content = document.getElementById("reel3-content");
    
    const spinBtn = document.getElementById("spinBtn");
    const resultDiv = document.getElementById("result");
    
    // Kullanacağımız rakun resimleri (5 tane örnek)
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
      
  
    // Bir makaraya (ör: reel1Content) birçok kez bu resimleri ekle
    // Örnek: her reel'e 15 tane resim koyalım
    function populateReel(reelElement) {
      for (let i = 0; i < 15; i++) {
        // Rastgele bir resim seç
        const randomIndex = Math.floor(Math.random() * racoonImages.length);
        const imgSrc = racoonImages[randomIndex];
        
        const img = document.createElement("img");
        img.src = imgSrc;
        reelElement.appendChild(img);
      }
    }
  
    // Başta populate edelim
    populateReel(reel1Content);
    populateReel(reel2Content);
    populateReel(reel3Content);
  
    // Bir reel'i döndürme fonksiyonu
    // duration: kaç ms sürecek
    // reelElement: reel-content div
    // callback: durunca yapılacak şey
    function spinReel(reelElement, duration, callback) {
      // Animasyon başlarken top=0 olsun
      reelElement.style.top = "0px";
  
      // Her 16 ms'de (≈60 FPS) top'u artırarak yukarıya kaydıracağız.
      // Speed'i istersen random da yapabilirsin.
      const speed = 25; // px per frame
      let startTime = null;
      
      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
  
        // Ne kadar yol alacağımıza elapsed'e göre karar verelim
        // Örnek: speed px per 16ms gibi sabit
        let currentTop = parseFloat(reelElement.style.top) || 0;
        reelElement.style.top = (currentTop - speed) + "px";
  
        if (elapsed < duration) {
          requestAnimationFrame(animate);
        } else {
          // Süre doldu, callback ile "dur" diyoruz
          callback();
        }
      }
  
      requestAnimationFrame(animate);
    }
  
    // Her reel durduğunda ortadaki resmin ne olduğunu bulacağız
    // .reel = 150px yüksek. "Orta"yı basitçe 75px alt sınır gibi düşünebiliriz.
    // top offset'ini hesaba katarak hangi img'ye denk geliyor bulmamız lazım.
    function getMiddleImageIndex(reelElement) {
      // reelElement.style.top negatif bir değerde olabilir
      const currentTop = parseFloat(reelElement.style.top) || 0;
      
      // Her resmin "height"ını varsayımsal olarak 100px alalım (veya DOM'dan ölçebilirsin).
      // Ama senin görsellerin 100px Genişlik, Yükseklik "auto" = ~100 px civarıysa => Yaklaşık 100 px diyebiliriz.
      // Projende gerçekte tam boyutunu sayarken 1 resmin offsetHeight'ını ölçüp kullanabilirsin.
      const singleImageHeight = reelElement.querySelector("img").offsetHeight; 
      // console.log("1 resim yüksekliği:", singleImageHeight);
  
      // Orta piksel = reel yüksekliği / 2 = 150/2= 75 px, ama reelElement'in top offset'i var.
      // Tüm bu "top offset" + "ortadaki px" i hesaba katıp hangi resme denk geliyor bulacağız.
      const middlePixel = -currentTop + 75; // negative top'u düzeltiyoruz
  
      // Hangi resmin index'i = middlePixel / singleImageHeight (alt taban)
      let index = Math.floor(middlePixel / singleImageHeight);
      
      // Dizi sınırlarını aşmasın diye clamp
      const totalImages = reelElement.querySelectorAll("img").length;
      if (index < 0) index = 0;
      if (index >= totalImages) index = totalImages - 1;
  
      return index;
    }
  
    spinBtn.addEventListener("click", function() {
      resultDiv.textContent = "";
      
      // Rastgele 3 durma süresi belirleyelim ki makaralar farklı zamanlarda dursun
      // (ör: 2sn, 2.5sn, 3sn)
      const durations = [
        2000 + Math.random() * 1000, // 2-3 sn
        2000 + Math.random() * 1000,
        2000 + Math.random() * 1000
      ];
  
      // Makaralar durunca seçeceğimiz "index" değerleri
      let finalIndexes = [null, null, null];
      
      // 1. reel spin
      spinReel(reel1Content, durations[0], () => {
        // Durunca ortadaki resmi bul
        finalIndexes[0] = getMiddleImageIndex(reel1Content);
        checkResult();
      });
  
      // 2. reel spin
      spinReel(reel2Content, durations[1], () => {
        finalIndexes[1] = getMiddleImageIndex(reel2Content);
        checkResult();
      });
  
      // 3. reel spin
      spinReel(reel3Content, durations[2], () => {
        finalIndexes[2] = getMiddleImageIndex(reel3Content);
        checkResult();
      });
  
      // Makaralar durdukça finalIndexes dolacak. Hepsi null değilse, "hepsi durdu" demektir.
      function checkResult() {
        // Tüm reel durmaları bitti mi?
        if (finalIndexes.every(idx => idx !== null)) {
          // Her makaradaki ortadaki resmin SRC'sini alalım
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
        }
      }
    });
  });
  