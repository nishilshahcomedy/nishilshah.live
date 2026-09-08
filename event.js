// Shared signup handler for the signup surfaces (show pages + /subscribe).
//
// Submit: a native form POST retargeted into a hidden iframe — same as Kit's
// own embed, so it always reaches Kit (no CORS/fetch flakiness); the iframe
// just absorbs the response so the page doesn't navigate.
//
// Feedback on success:
//   • a toast slides up from the bottom (all surfaces) with the confirm nudge
//   • inline, the form is replaced with a quiet "you're on the list" line
//     — except the mobile footer card, which gives way to the toast (same spot)
(function () {
  const signupForm = document.querySelector(".event-signup");
  if (!signupForm) return;

  // Toast carries the full instruction so it also covers mobile (where the card
  // is dismissed). Desktop additionally shows a persistent inline reminder —
  // redundant, which is fine.
  const TOAST_MSG = "Thanks so much! Check your email to confirm :)";

  // --- Toast styles (injected once; colors come from theme.css tokens) ---
  if (!document.getElementById("site-toast-style")) {
    const style = document.createElement("style");
    style.id = "site-toast-style";
    style.textContent =
      ".site-toast{position:fixed;left:50%;" +
      "bottom:calc(1.5rem + env(safe-area-inset-bottom,0px));" +
      "transform:translate(-50%,1rem);background:var(--charcoal,#272425);color:#fff;" +
      "padding:.8rem 1.15rem;border-radius:10px;" +
      "font:500 .95rem/1.35 system-ui,-apple-system,BlinkMacSystemFont,sans-serif;" +
      "box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;" +
      "transition:opacity .28s ease,transform .28s ease;z-index:9999;" +
      "max-width:calc(100% - 2rem);text-align:center;pointer-events:none}" +
      ".site-toast.show{opacity:1;transform:translate(-50%,0)}";
    document.head.appendChild(style);
  }

  function showToast(msg) {
    const t = document.createElement("div");
    t.className = "site-toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 350);
    }, 5000);
  }

  // Hidden iframe absorbs Kit's response so the page doesn't navigate.
  const sink = document.createElement("iframe");
  sink.name = "kit-signup-sink";
  sink.style.display = "none";
  sink.setAttribute("aria-hidden", "true");
  sink.setAttribute("tabindex", "-1");
  document.body.appendChild(sink);
  signupForm.target = sink.name;

  let submitted = false;

  function onSuccess() {
    if (!submitted || onSuccess.fired) return; // ignore blank load; once only
    onSuccess.fired = true;

    showToast(TOAST_MSG);

    const card = document.querySelector(".event-signup-card");
    if (card && window.matchMedia("(max-width: 899px)").matches) {
      // Mobile footer card gives way to the toast (same bottom spot).
      card.style.display = "none";
    } else {
      const prompt = document.querySelector(".event-signup-prompt");
      if (prompt) prompt.style.display = "none";
      signupForm.style.display = "none";
      const line = document.querySelector(".event-signup-done");
      if (line) {
        line.textContent = "✓ Check your inbox";
        line.hidden = false;
      }
    }
  }

  signupForm.addEventListener("submit", () => {
    submitted = true;
    const button = signupForm.querySelector("button");
    button.disabled = true;
    button.textContent = "…";
    setTimeout(onSuccess, 1500); // fallback if the iframe load is suppressed
  });

  sink.addEventListener("load", onSuccess);
})();
