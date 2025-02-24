(async function () {
    let theme = localStorage.getItem("vite-ui-theme") || "dark";
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.classList.add(theme);
  })();
  