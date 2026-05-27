(() => {
  const root = document.documentElement;
  const BREAKPOINTS = {
    phone: 640,
    tablet: 1024,
  };

  const SCALES = {
    phone: 0.92,
    tablet: 0.97,
    desktop: 1,
  };

  const getScreen = (width) => {
    if (width <= BREAKPOINTS.phone) return "phone";
    if (width <= BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  };

  const applyScale = () => {
    const width = window.innerWidth;
    const screen = getScreen(width);

    root.setAttribute("data-screen", screen);
    root.style.setProperty("--ui-scale", String(SCALES[screen]));
  };

  window.addEventListener("resize", applyScale);
  window.addEventListener("orientationchange", applyScale);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyScale);
  } else {
    applyScale();
  }
})();
