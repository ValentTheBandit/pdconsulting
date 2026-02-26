const btn = document.getElementById("btn");
const msg = document.getElementById("msg");

btn.addEventListener("click", () => {
  const now = new Date();
  msg.textContent = `Köszi! ${now.toLocaleString("hu-HU")} 😊`;
});