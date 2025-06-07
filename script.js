// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Sync ScrollTrigger with Lenis
lenis.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value) : window.scrollY;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.body.style.transform ? "transform" : "fixed",
});

ScrollTrigger.refresh();

// Prevent browser from restoring scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Scroll to top as early as possible
window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
});

// Also scroll to top again after full load (in case some browsers override earlier)
window.addEventListener("load", () => {
  setTimeout(() => window.scrollTo(0, 0), 0);
});

// Optional: Reset scroll before leaving the page (may help in some browsers)
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

//send email
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // prevent default form submit (no redirect)

  const formData = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/xqaqoqwy", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formMessage.textContent = "Thanks for your message! We'll be in touch.";
      form.reset();
    } else {
      const data = await response.json();
      if (data.errors) {
        formMessage.textContent = data.errors
          .map((error) => error.message)
          .join(", ");
      } else {
        formMessage.textContent =
          "Oops! There was a problem submitting your form.";
      }
    }
  } catch (error) {
    formMessage.textContent = "Oops! There was a problem submitting your form.";
  }
});

//loading animation
lenis.stop();

const overlay = document.querySelector(".overlay");
function generateBlocks() {
  overlay.innerHTML = "";

  const width = screen.width;
  let numBlocks;

  if (width <= 425) {
    numBlocks = 5;
  } else if (width >= 1440) {
    numBlocks = 20;
  } else {
    const minWidth = 426;
    const maxWidth = 1440;
    const progress = (width - minWidth) / (maxWidth - minWidth);
    numBlocks = Math.round(5 + progress * (20 - 5));
  }

  console.log(`Screen width: ${width}px → Generating ${numBlocks} blocks`);

  const percentWidth = 100 / numBlocks;

  for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = `${percentWidth * i}%`;
    block.style.width = `${percentWidth}%`;
    overlay.appendChild(block);
  }

  gsap.to(".block", {
    width: "0%",
    duration: 0.8,
    ease: "power1.in",
    delay: 2,
    stagger: 0.04,
  });
}

generateBlocks();

gsap.to(".loader", {
  x: 2,
  opacity: 0,
  duration: 1,
  ease: "expo.inOut",
  delay: 1.6,
});
gsap.from(".f.a-i-c.j-c-c.g-6, .text-wrapper, .btn-tp-2, .section-1 ul li", {
  opacity: 0,
  y: 30,
  duration: 2,
  ease: "expo.inOut",
  delay: 3,
  stagger: 0.06,
  onComplete: () => {
    lenis.start(); // Re-enable scroll
  },
});

// Cursor Elements
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");
const cursorLabel = document.querySelector(".cursor-label");

const cardElements = document.querySelectorAll(".cursor-card");
const blendTexts = document.querySelectorAll(".cursor-blend");
const cursorAreas = document.querySelectorAll(".cursor-area");

// Cursor State
let posX = 0,
  posY = 0;
let mouseX = 0,
  mouseY = 0;
let isInside = false;

// Utility Functions
const toggleCursorVisibility = (visible) => {
  const display = visible ? "block" : "none";
  cursor.style.display = display;
  follower.style.display = display;
};

const setCursorLabel = (text) => {
  cursorLabel.textContent = text;
};

cardElements.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    cursor.classList.add("scale-up");
    cursorLabel.textContent = "View Project";
    follower.classList.add("z-index-1");
  });

  card.addEventListener("mouseleave", () => {
    cursor.classList.remove("scale-up");
    cursorLabel.textContent = "";
    follower.classList.remove("z-index-1");
  });
});

// Blend Text Hover Effects
blendTexts.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("blend"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("blend"));
});

// Area Hover Effects
cursorAreas.forEach((area) => {
  area.addEventListener("mouseenter", () => {
    isInside = true;
    toggleCursorVisibility(true);
  });

  area.addEventListener("mouseleave", () => {
    isInside = false;
    toggleCursorVisibility(false);
  });
});

// Mouse Tracking
document.addEventListener("mousemove", (e) => {
  if (isInside) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

// Cursor Animation
gsap.ticker.add(() => {
  if (!isInside) return;

  posX += (mouseX - posX) / 9;
  posY += (mouseY - posY) / 9;

  gsap.set(follower, {
    left: posX - 20,
    top: posY - 20,
  });

  gsap.set(cursor, {
    left: mouseX,
    top: mouseY,
  });
});
window.addEventListener("load", () => {
  const cards = document.querySelector(".cards");
  setTimeout(() => {
    cards.classList.add("visible");
  }, 1000);
});

//horizental scrolling
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const stickySection = document.querySelector(".sticky");
  const outlineCanvas = document.querySelector(".outline-layer");
  const fillCanvas = document.querySelector(".fill-layer");
  const outlineCtx = outlineCanvas.getContext("2d");
  const fillCtx = fillCanvas.getContext("2d");

  // Function to get stickyHeight based on screen width
  function getStickyHeight() {
    const vw = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );
    const vh = window.innerHeight;
    const value = vw <= 1440 ? vh * 1 : vh * 4;
    return value;
  }

  // Initial stickyHeight
  let stickyHeight = getStickyHeight();

  function setCanvasSize(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  }

  setCanvasSize(outlineCanvas, outlineCtx);
  setCanvasSize(fillCanvas, fillCtx);

  const triangleSize = 300;
  const lineWidth = 1;
  const SCALE_THRESHOLD = 0.02;
  const triangleStates = new Map();
  let animationFrameId = null;
  let canvasXPosition = 0;

  function drawTriangle(
    ctx,
    x,
    y,
    fillscale = 0,
    flipped = false,
    drawFillAllowed = false
  ) {
    const halfSize = triangleSize / 2;
    const OVERDRAW = 1.015; // Slightly scale up to cover gaps

    if (fillscale < SCALE_THRESHOLD) {
      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.075)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    if (fillscale > SCALE_THRESHOLD && drawFillAllowed) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(fillscale * OVERDRAW, fillscale * OVERDRAW);
      ctx.translate(-x, -y);
      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    }
  }

  function drawGrid(scrollProgress = 0) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

    const animationProgress =
      scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;

    let needsUpdate = false;
    const animationSpeed = 0.15;
    const drawFillAllowed = scrollProgress > 0.65;
    triangleStates.forEach((state) => {
      if (state.scale < 1) {
        const x =
          state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPosition;
        const y = state.row * triangleSize + triangleSize / 2;
        const flipped = (state.row + state.col) % 2 !== 0;
        drawTriangle(outlineCtx, x, y, state.scale, flipped, drawFillAllowed);
      }
    });

    triangleStates.forEach((state) => {
      const shouldBeVisible = state.order <= animationProgress;
      const targetScale = shouldBeVisible ? 1 : 0;

      const newScale =
        state.scale + (targetScale - state.scale) * animationSpeed;

      if (Math.abs(newScale - state.scale) > 0.001) {
        state.scale = newScale;
        needsUpdate = true;
      }

      const x =
        state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPosition;
      const y = state.row * triangleSize + triangleSize / 2;
      const flipped = (state.row + state.col) % 2 !== 0;

      // ✅ Only draw filled triangles if they’ve animated or we're mid-scroll
      if (scrollProgress > 0.65 && state.scale >= 1 - 0.001) {
        drawTriangle(fillCtx, x, y, state.scale, flipped);
      }
    });

    // ✅ Keep updating if we're animating or scrollProgress is 1
    if (needsUpdate || scrollProgress === 1) {
      animationFrameId = requestAnimationFrame(() => {
        drawGrid(scrollProgress);
      });
    }
  }
  // if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
  //   triangleStates.forEach((state) => {
  //     state.scale = 1;
  //   });
  //   drawGrid(1); // force full render
  // }

  function initializeTriangles() {
    const scrollOffset = 200; // matches ScrollTrigger shift
    const cols = Math.ceil(
      (window.innerWidth + scrollOffset) / (triangleSize * 0.5)
    );
    const rows = Math.ceil(window.innerHeight / (triangleSize * 0.5));
    const totalTriangles = rows * cols;
    const positions = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({ row: r, col: c, key: `${r}-${c}` });
      }
    }
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    positions.forEach((pos, index) => {
      triangleStates.set(pos.key, {
        order: index / totalTriangles,
        scale: 0,
        row: pos.row,
        col: pos.col,
      });
    });
  }

  initializeTriangles();
  drawGrid();

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: () => {
      return "+=" + stickyHeight;
    },
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      canvasXPosition = -self.progress * 200;
      drawGrid(self.progress);

      const cards = document.querySelector(".cards");
      const progress = Math.min(self.progress / 0.654, 1);
      gsap.set(cards, { x: -progress * window.innerWidth * 2 });

      const animationProgress =
        self.progress <= 0.65 ? 0 : (self.progress - 0.65) / 0.35;

      // Fade out between animationProgress 0.1 to 0.5
      if (animationProgress >= 0.1 && animationProgress <= 0.3) {
        const fadeProgress = (animationProgress - 0.1) / (0.3 - 0.1); // normalize 0 → 1 between 0.1 and 0.5
        const opacity = 1 - fadeProgress;
        gsap.set(cards, { opacity });
        cards.classList.add("disabled"); // allow interaction while fading
      } else if (animationProgress > 0.3) {
        gsap.set(cards, { opacity: 0 });
        cards.classList.add("disabled"); // disable interaction after fade out
      } else {
        gsap.set(cards, { opacity: 1 });
        cards.classList.remove("disabled");
      }
    },
  });

  window.addEventListener("resize", () => {
    stickyHeight = getStickyHeight();

    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);
    triangleStates.clear();
    initializeTriangles();
    ScrollTrigger.refresh();
  });
});
