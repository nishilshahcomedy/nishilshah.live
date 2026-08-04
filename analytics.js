// Shared analytics loader — Cloudflare Web Analytics beacon.
// Loaded by the home page and every show page, so analytics is one edit.
(function () {
  var host = location.hostname;

  // Don't count local development / file previews.
  if (
    location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === ""
  ) {
    return;
  }

  // Per-device opt-out so your own visits don't inflate the numbers:
  //   visit  /?noanalytics  once on a device to stop counting it,
  //   visit  /?analytics    to start counting it again.
  try {
    var params = new URLSearchParams(location.search);
    if (params.has("noanalytics")) {
      localStorage.setItem("noanalytics", "1");
      console.log("%c[analytics] OFF — this device will NOT be counted.", "color:#c00;font-weight:bold");
    }
    if (params.has("analytics")) {
      localStorage.removeItem("noanalytics");
      console.log("%c[analytics] ON — this device will be counted again.", "color:#0a0;font-weight:bold");
    }
    if (localStorage.getItem("noanalytics") === "1") {
      console.log("%c[analytics] excluded on this device (visit /?analytics to undo).", "color:#c00;font-weight:bold");
      return;
    }
  } catch (e) {
    // localStorage blocked — fall through and just load analytics.
  }

  // Load the Cloudflare Web Analytics beacon.
  var beacon = document.createElement("script");
  beacon.defer = true;
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.setAttribute(
    "data-cf-beacon",
    '{"token": "f13962f8f96145cabe6cc5a3010b47d8"}'
  );
  document.head.appendChild(beacon);
})();
