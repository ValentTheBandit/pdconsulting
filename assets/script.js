// ===== Mobil menü =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const navAnchors = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];

function setMenu(open) {
  if (!burger || !navLinks) return;
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
}

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const open = !navLinks.classList.contains("is-open");
    setMenu(open);
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (e) => {
    const inside = navLinks.contains(e.target) || burger.contains(e.target);
    if (!inside) setMenu(false);
  });
}

// ===== Smooth scroll offset nélküli natív anchor kezelés jó, de bezárjuk a menüt =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => setMenu(false));
});

// ===== EmailJS =====
// Ezeket írd át a saját EmailJS adataidra
const EMAILJS_PUBLIC_KEY = "IDE_A_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "IDE_A_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "IDE_A_TEMPLATE_ID";

if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "IDE_A_PUBLIC_KEY") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

const form = document.getElementById("contactForm");
const hint = document.getElementById("formHint");
const submitBtn = document.getElementById("submitBtn");

if (form && hint && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const company = document.getElementById("company")?.value.trim();
    const topic = document.getElementById("topic")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !topic || !message) {
      hint.textContent = "Kérlek töltsd ki a kötelező mezőket.";
      return;
    }

    if (typeof emailjs === "undefined") {
      hint.textContent = "❌ Az EmailJS script nincs betöltve.";
      return;
    }

    if (
      EMAILJS_PUBLIC_KEY === "IDE_A_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "IDE_A_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "IDE_A_TEMPLATE_ID"
    ) {
      hint.textContent = "❌ Az EmailJS kulcsok még nincsenek beállítva a script.js fájlban.";
      return;
    }

    hint.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Küldés...";

    const templateParams = {
      name: name,
      email: email,
      company: company || "-",
      topic: topic,
      message: message,
      reply_to: email,
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log("✅ EmailJS siker:", response);
      hint.textContent = "✅ Üzenet elküldve. Hamarosan jelentkezünk.";
      form.reset();
    } catch (error) {
      console.error("❌ EmailJS hiba:", error);

      let errorMessage = "Hiba történt küldés közben.";
      if (error?.text) errorMessage += ` ${error.text}`;
      if (error?.status) errorMessage += ` (Status: ${error.status})`;

      hint.textContent = `❌ ${errorMessage}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Üzenet küldése";
    }
  });
}