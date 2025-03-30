(function () {
  "use strict";

  function hideMenuItems() {
    let teamsHidden = false;
    let kbHidden = false;
    let logoSectionHidden = false; // Renamed flag
    const consolePrefix = "TypingMind Tweaks:";

    // --- Hide Teams button ---
    const teamsButton = document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    if (teamsButton) {
      if (teamsButton.style.display !== "none") {
        teamsButton.style.display = "none";
        console.log(`${consolePrefix} Teams button hidden.`);
      }
      teamsHidden = true;
    }

    // --- Hide KB button ---
    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    let kbButtonFound = false;
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          kbButtonFound = true;
          if (button.style.display !== "none") {
            button.style.display = "none";
            console.log(`${consolePrefix} KB button hidden.`);
          }
          kbHidden = true;
          return;
        }
      });
    }

    // --- Hide Logo/Announcement Container Div (using logo.png as anchor) ---
    const logoImage = document.querySelector(
      'img[alt="TypingMind"][src="/logo.png"]'
    );
    let logoContainerDiv = null;

    if (logoImage) {
      // Go up two levels: img -> div (logo wrapper) -> div (main container)
      const logoWrapper = logoImage.parentElement;
      if (
        logoWrapper &&
        logoWrapper.parentElement &&
        logoWrapper.parentElement.tagName === "DIV"
      ) {
        logoContainerDiv = logoWrapper.parentElement;
      }
    }

    if (logoContainerDiv) {
      if (logoContainerDiv.style.display !== "none") {
        logoContainerDiv.style.display = "none";
        console.log(`${consolePrefix} Logo/Announcement container hidden.`);
      }
      logoSectionHidden = true; // Mark as hidden
    } else {
      // console.log(`${consolePrefix} Logo/Announcement container not found yet.`);
    }

    // Check if all target elements exist (even if hidden).
    const teamsButtonExists = !!document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    const kbButtonExists = kbButtonFound; // Reuse the flag from search
    const logoContainerExists = !!logoContainerDiv; // Check if we found it this run

    // Optional: Disconnect observer if all targets are found.
    // if (teamsButtonExists && kbButtonExists && logoContainerExists) {
    //   console.log(`${consolePrefix} All target elements found. Observer could stop.`);
    //   // observer.disconnect(); // Uncomment to stop observing
    //   return true;
    // }

    // Return true if all elements we *expect* to find *have been found* at least once.
    return teamsHidden && kbHidden && logoSectionHidden;
  }

  // --- Run the hiding logic ---

  const observer = new MutationObserver((mutationsList, observerInstance) => {
    hideMenuItems();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    hideMenuItems();
  } else {
    document.addEventListener("DOMContentLoaded", hideMenuItems);
  }
})();
