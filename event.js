// Shared signup handler for self-produced show pages.
// Submits the email form to Kit and swaps the form for a confirmation, without
// leaving the page. Every show page loads this, so signup fixes happen once.
//
// Approach: a *native* form POST retargeted into a hidden iframe. This is what
// Kit's own embed does under the hood, so the request always reaches Kit and
// creates the subscriber — no CORS/fetch flakiness. The iframe just absorbs
// Kit's response so the page doesn't navigate.
const signupForm = document.querySelector(".event-signup");
if (signupForm) {
  // Hidden iframe to receive Kit's response.
  const sink = document.createElement("iframe");
  sink.name = "kit-signup-sink";
  sink.style.display = "none";
  sink.setAttribute("aria-hidden", "true");
  sink.setAttribute("tabindex", "-1");
  document.body.appendChild(sink);
  signupForm.target = sink.name;

  let submitted = false;

  function showConfirmation() {
    if (!submitted) return; // ignore the iframe's initial blank load
    const prompt = document.querySelector(".event-signup-prompt");
    if (prompt) prompt.hidden = true;
    signupForm.hidden = true;
    const done = document.querySelector(".event-signup-done");
    if (done) done.hidden = false;
  }

  signupForm.addEventListener("submit", () => {
    // Let the native submit proceed into the hidden iframe (no preventDefault).
    submitted = true;
    const button = signupForm.querySelector("button");
    button.disabled = true;
    button.textContent = "…";
    // Confirm on the iframe's load, with a timeout fallback in case Kit's
    // response headers (e.g. X-Frame-Options) suppress the load event.
    setTimeout(showConfirmation, 1500);
  });

  sink.addEventListener("load", showConfirmation);
}
