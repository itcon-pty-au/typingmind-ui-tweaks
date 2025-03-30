(function () {
  "use strict";

  function hideMenuItems() {
    let teamsHidden = false;
    let kbHidden = false;
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
      teamsHidden = true; // Mark as potentially handled
    } else {
      // console.log(`${consolePrefix} Teams button not found yet.`);
    }

    // --- Hide KB button ---
    // Find the KB button by its text content within the workspace bar
    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    let kbButtonFound = false;
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        // Check the direct text content or text within a nested span
        const textSpan = button.querySelector("span > span"); // Look for the common structure
        if (textSpan && textSpan.textContent.trim() === "KB") {
          kbButtonFound = true;
          if (button.style.display !== "none") {
            button.style.display = "none";
            console.log(`${consolePrefix} KB button hidden.`);
          }
          kbHidden = true; // Mark as potentially handled
          return; // Exit the forEach loop once found
        }
      });
    }
    if (!kbButtonFound) {
      // console.log(`${consolePrefix} KB button not found yet.`);
    }

    // Check if both elements exist in the DOM now, even if already hidden.
    // This tells the observer if its job might be done.
    const teamsButtonExists = !!document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    const kbButtonExists = kbButtonFound; // Reuse the flag from search

    // If both buttons we intend to hide *exist*, we can potentially stop observing.
    // If they don't exist yet, the observer needs to keep looking.
    if (teamsButtonExists && kbButtonExists) {
      // You could uncomment the next two lines if you want the observer
      // to stop running once it successfully hides both buttons.
      // console.log(`${consolePrefix} Both target buttons found. Observer will stop.`);
      // observer.disconnect();
      return true; // Indicate that the target elements are present
    }

    return false; // Indicate that target elements might still be loading
  }

  // --- Run the hiding logic ---

  // Use MutationObserver to handle elements loading dynamically
  const observer = new MutationObserver((mutationsList, observerInstance) => {
    // console.log(`${consolePrefix} DOM change detected, checking for buttons...`);
    // Check if the buttons are now present and hide them
    hideMenuItems();

    // Note: The logic to disconnect the observer is inside hideMenuItems now.
  });

  // Start observing the document body for added nodes and subtree modifications
  // This is robust for dynamically loaded content.
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also, run the function once immediately in case the elements are already present
  // when the script executes.
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // console.log(`${consolePrefix} Running initial check on loaded DOM.`);
    hideMenuItems();
  } else {
    // console.log(`${consolePrefix} Waiting for DOMContentLoaded.`);
    document.addEventListener("DOMContentLoaded", hideMenuItems);
  }
})();
