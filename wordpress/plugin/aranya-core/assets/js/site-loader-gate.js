/* Site loader gate — printed inline right after the loader (keep in step with
   the copy in the React index.html). Lifts the loader once the hero's first
   frame has loaded and decoded; also on a failed image, on a page without a
   hero, and after 8 s at the most. */
(function () {
  var root = document.documentElement;
  var loader = document.getElementById('site-loader');
  if (!loader) return;
  root.classList.add('aranya-loading');
  var done = false;
  function lift() {
    if (done) return;
    done = true;
    root.classList.remove('aranya-loading');
    loader.classList.add('is-done');
    window.aranyaReady = true;
    window.dispatchEvent(new Event('aranya:ready'));
    setTimeout(function () { loader.remove(); }, 700);
  }
  function whenLoaded(img) {
    var shown = function () { img.decode ? img.decode().then(lift, lift) : lift(); };
    if (img.complete) return shown();
    img.addEventListener('load', shown, { once: true });
    img.addEventListener('error', lift, { once: true });
  }
  // The hero is parsed after this script (WordPress) or mounted by React: look until it is there.
  var tries = 0;
  (function find() {
    var img = document.querySelector('img[data-aranya-lcp]');
    if (img) return whenLoaded(img);
    if (++tries > 160 || (document.readyState === 'complete' && tries > 20)) return lift();
    setTimeout(find, 50);
  })();
  setTimeout(lift, 8000);
})();
