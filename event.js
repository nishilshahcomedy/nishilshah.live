// Shared signup handler for self-produced show pages.
// Submits the email form to Kit without leaving the page, then swaps the form
// for a confirmation message. Every show page loads this, so signup fixes
// happen in ONE place.
const signupForm = document.querySelector(".event-signup");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = signupForm.querySelector("button");
    button.disabled = true;
    button.textContent = "…";
    try {
      // Kit's endpoint doesn't send CORS headers, so submit no-cors and treat a
      // completed request as success — the double opt-in email is the real
      // confirmation.
      await fetch(signupForm.action, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(signupForm)).toString(),
      });
      const prompt = document.querySelector(".event-signup-prompt");
      if (prompt) prompt.hidden = true;
      signupForm.hidden = true;
      const done = document.querySelector(".event-signup-done");
      if (done) done.hidden = false;
    } catch (err) {
      button.disabled = false;
      button.textContent = "Try again";
    }
  });
}
