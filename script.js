// 15 raccoon images
const raccoonImages = [
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

// Global variable to track spin count
let spinCount = 0;

// Simple array shuffle (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Add "repeatCount" times the images to each reel
function populateReel(reelElement, repeatCount) {
  reelElement.innerHTML = "";
  const shuffled = shuffleArray(raccoonImages);

  for (let i = 0; i < repeatCount; i++) {
    shuffled.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      reelElement.appendChild(img);
    });
  }
}

// Function to spin the reel (with deceleration)
function spinReel(reelElement, duration, callback, forceJackpot=false, jackpotImage=null) {
  try {
    let startTime = null;
    const initialSpeed = 30; // Initial speed (px/frame)
    const deceleration = 0.5; // Deceleration rate
    let currentSpeed = initialSpeed;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < duration) {
        const displacement = currentSpeed;
        let currentTop = parseFloat(reelElement.style.top) || 0;
        reelElement.style.top = (currentTop - displacement) + "px";

        // Decelerate
        currentSpeed -= deceleration;
        if (currentSpeed < 5) currentSpeed = 5; // Minimum speed

        requestAnimationFrame(animate);
      } else {
        if (forceJackpot && jackpotImage) {
          // Clear reel content and set to jackpotImage
          reelElement.innerHTML = "";
          // Add the same image multiple times (15 times, reel height 300px)
          for (let i = 0; i < 15; i++) { 
            const img = document.createElement("img");
            img.src = jackpotImage;
            reelElement.appendChild(img);
          }
          // Reset reel position
          reelElement.style.top = "0px";
          // Set final index randomly
          const finalIndex = Math.floor(Math.random() * raccoonImages.length);
          reelElement.style.top = (-finalIndex * 100) + "px";
          callback(finalIndex);
        } else {
          // Normal stop
          // Find the index of the middle image
          const finalIndex = getMiddleImageIndex(reelElement);
          reelElement.style.top = (-finalIndex * 100) + "px";
          callback(finalIndex);
        }
      }
    }

    requestAnimationFrame(animate);
  } catch (error) {
    console.error("Error in spin animation:", error);
  }
}

// Function to find the index of the middle image
function getMiddleImageIndex(reelElement) {
  const currentTop = parseFloat(reelElement.style.top) || 0;
  const reelHeight = reelElement.parentElement.clientHeight; // 300px
  const middlePixel = -currentTop + (reelHeight / 2);
  const imgHeight = 100;
  let index = Math.floor(middlePixel / imgHeight);

  const totalImages = reelElement.querySelectorAll("img").length;
  if (index < 0) index = 0;
  if (index >= totalImages) index = totalImages - 1;

  // Normalize index considering image repetitions
  index = index % raccoonImages.length;

  return index;
}

// Function to show gold animation
function showGoldAnimation() {
  const goldAnimation = document.getElementById("goldAnimation");
  
  // Create gold particles
  const particles = 30; // Number of particles
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div");
    particle.classList.add("gold-particle");
    // Random positioning
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 1.5}s`;
    goldAnimation.appendChild(particle);
  }

  // Start animation
  goldAnimation.classList.add("active");

  // Remove particles after animation
  setTimeout(() => {
    goldAnimation.classList.remove("active");
    goldAnimation.innerHTML = "";
  }, 1500); // 1.5 seconds
}

document.addEventListener("DOMContentLoaded", () => {
  const reel1Content = document.getElementById("reel1-content");
  const reel2Content = document.getElementById("reel2-content");
  const reel3Content = document.getElementById("reel3-content");

  const spinBtn = document.getElementById("spinBtn");
  const resultDiv = document.getElementById("result");

  const spinSound = document.getElementById("spinSound");
  const jackpotSound = document.getElementById("jackpotSound");
  const goldAnimation = document.getElementById("goldAnimation");

  // Populate each reel with 15 images repeated 10 times (150 images)
  const repeatCount = 10;
  populateReel(reel1Content, repeatCount);
  populateReel(reel2Content, repeatCount);
  populateReel(reel3Content, repeatCount);

  spinBtn.addEventListener("click", () => {
    // Clear previous result classes
    resultDiv.classList.remove("jackpot");

    resultDiv.textContent = "";
    spinCount++; // Increment spin count

    // Disable spin button during spin
    spinBtn.disabled = true;

    // Add spinning animation class (optional)
    // spinBtn.classList.add("animate-spin"); // Uncomment if enhanced animation is desired

    // Repopulate reels with new shuffled images
    populateReel(reel1Content, repeatCount);
    populateReel(reel2Content, repeatCount);
    populateReel(reel3Content, repeatCount);

    // Spin duration
    const spinDuration = 2000; // ms

    let finalIndexes = [null, null, null];

    // Check if spin count is a multiple of 3
    const isJackpotSpin = (spinCount % 3 === 0);
    let jackpotImage = null;
    if (isJackpotSpin) {
      // Select a random jackpot image
      jackpotImage = raccoonImages[Math.floor(Math.random() * raccoonImages.length)];
    }

    // Play spin sound
    spinSound.play();

    // Spin Reel 1
    spinReel(reel1Content, spinDuration, (finalIndex1) => {
      finalIndexes[0] = finalIndex1;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    // Spin Reel 2 with slightly longer duration
    spinReel(reel2Content, spinDuration + 500, (finalIndex2) => {
      finalIndexes[1] = finalIndex2;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    // Spin Reel 3 with even longer duration
    spinReel(reel3Content, spinDuration + 1000, (finalIndex3) => {
      finalIndexes[2] = finalIndex3;
      checkFinal();
    }, isJackpotSpin, jackpotImage);

    // Function to check final result
    function checkFinal() {
      if (finalIndexes.every(idx => idx !== null)) {
        const img1 = raccoonImages[finalIndexes[0]];
        const img2 = raccoonImages[finalIndexes[1]];
        const img3 = raccoonImages[finalIndexes[2]];

        if (isJackpotSpin) {
          // Automatic jackpot on every 3rd spin
          resultDiv.textContent = "JACKPOT!";
          resultDiv.classList.add("jackpot"); // Jackpot sınıfını ekle
          jackpotSound.play();
          showGoldAnimation();
        } else if (img1 === img2 && img2 === img3) {
          // All three images are the same
          resultDiv.textContent = "JACKPOT!";
          resultDiv.classList.add("jackpot"); // Jackpot sınıfını ekle
          jackpotSound.play();
          showGoldAnimation();
        } else {
          // No jackpot
          resultDiv.textContent = "Try Again!";
        }

        // Remove spinning animation class (optional)
        // spinBtn.classList.remove("animate-spin"); // Uncomment if enhanced animation is desired

        // Re-enable spin button
        spinBtn.disabled = false;

        // Reset finalIndexes
        finalIndexes = [null, null, null];
      }
    }
  });
});
