// ============================================================
//  WATCH / "5-minute set" video control
//  Flip this one file to show/hide or swap the clip site-wide.
//    enabled  — true shows the link on the home page + the /watch page;
//               false hides the link and makes /watch bounce home.
//    videoId  — the YouTube video id (the bit after youtu.be/). Swap to
//               change the clip.
//    caption  — the italic line under the link / video.
//  (Heads-up: the share-preview image in /watch/index.html's <head> is
//   hardcoded to the current video's thumbnail — update it there too if you
//   swap videoId and care about the link preview.)
// ============================================================
window.WATCH = {
  enabled: false,
  videoId: "jST7wiKmfpk",
  caption: "set from a while back (even better now)",
};
