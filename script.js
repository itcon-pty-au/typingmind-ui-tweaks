(function () {
  "use strict";

  const settingsKeys = {
    hideTeams: "tweak_hideTeams",
    hideKB: "tweak_hideKB",
    hideLogo: "tweak_hideLogo",
  };

  const consolePrefix = "TypingMind Tweaks:";

  // Function to get settings from localStorage
  function getSetting(key) {
    // Default to true (hide elements initially) if setting doesn't exist
    const value = localStorage.getItem(key);
    // Ensure we handle null case correctly and parse stored boolean
    return value === null ? true : JSON.parse(value);
  }

  // Modified function to apply styles based on settings
  function applyStylesBasedOnSettings() {
    const hideTeams = getSetting(settingsKeys.hideTeams);
    const hideKB = getSetting(settingsKeys.hideKB);
    const hideLogo = getSetting(settingsKeys.hideLogo);

    // --- Apply Teams button style ---
    const teamsButton = document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    if (teamsButton) {
      const newDisplay = hideTeams ? "none" : ""; // Use '' to revert to default CSS
      if (teamsButton.style.display !== newDisplay) {
        teamsButton.style.display = newDisplay;
        // Optional: console.log(`${consolePrefix} Teams button display set to '${newDisplay || 'default'}'.`);
      }
    } else {
      // Optional: console.log(`${consolePrefix} Teams button not found.`);
    }

    // --- Apply KB button style ---
    const workspaceBar = document.querySelector(
      'div[data-element-id="workspace-bar"]'
    );
    let kbButtonFound = false; // Track if KB button was found in this run
    if (workspaceBar) {
      const buttons = workspaceBar.querySelectorAll("button");
      buttons.forEach((button) => {
        const textSpan = button.querySelector("span > span");
        if (textSpan && textSpan.textContent.trim() === "KB") {
          kbButtonFound = true; // Mark as found
          const newDisplay = hideKB ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
            // Optional: console.log(`${consolePrefix} KB button display set to '${newDisplay || 'default'}'.`);
          }
          return; // Found the KB button, exit forEach for this iteration
        }
      });
    }
    // Optional: if (!kbButtonFound) { console.log(`${consolePrefix} KB button not found.`); }

    // --- Apply Logo/Announcement style ---
    // Find the logo image first
    const logoImage = document.querySelector(
      'img[alt="TypingMind"][src="/logo.png"]'
    );
    let logoContainerDiv = null;
    // Navigate up to the expected container div
    if (
      logoImage &&
      logoImage.parentElement &&
      logoImage.parentElement.parentElement &&
      logoImage.parentElement.parentElement.tagName === "DIV"
    ) {
      // Check if the parent's parent looks like the container we want to hide
      // This might need adjustment based on exact DOM structure if it changes
      logoContainerDiv = logoImage.parentElement.parentElement;
    }

    if (logoContainerDiv) {
      const newDisplay = hideLogo ? "none" : "";
      if (logoContainerDiv.style.display !== newDisplay) {
        logoContainerDiv.style.display = newDisplay;
        // Optional: console.log(`${consolePrefix} Logo container display set to '${newDisplay || 'default'}'.`);
      }
    } else {
      // Optional: console.log(`${consolePrefix} Logo container not found.`);
    }
  }

  // --- Modal Elements and Logic ---
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    // Prevent creating multiple modals if script runs again somehow
    if (document.getElementById("tweak-modal-overlay")) return;

    // Inject CSS
    const styles = `
      #tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.6); /* Slightly darker overlay */
        display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10001; /* High z-index */
        font-family: sans-serif; /* Basic font */
      }
      #tweak-modal {
        background-color: #ffffff; padding: 25px 35px; border-radius: 8px;
        min-width: 320px; max-width: 500px; box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        position: relative; color: #333; border: 1px solid #ddd;
      }
      #tweak-modal h2 {
          margin-top: 0; margin-bottom: 15px; color: #1a1a1a; font-size: 1.6em;
          font-weight: 600; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px;
       }
      #tweak-modal-feedback {
          font-size: 0.95em; color: #007bff; /* Blue feedback text */
          margin-bottom: 20px; min-height: 1.3em; text-align: center;
          font-weight: 500;
       }
      #tweak-modal-close {
        position: absolute; top: 8px; right: 8px; font-size: 2em;
        color: #aaa; cursor: pointer; line-height: 1; border: none; background: none;
        padding: 0 5px; font-weight: lighter;
      }
      #tweak-modal-close:hover { color: #e60000; /* Red on hover */ }
      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item input[type='checkbox'] {
          margin-right: 12px; transform: scale(1.2); cursor: pointer;
          accent-color: #007bff; /* Style checkbox color */
       }
      .tweak-checkbox-item label { cursor: pointer; flex-grow: 1; font-size: 1.05em; color: #444;}
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Overlay
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    // Optional: Close on overlay click (if clicked outside the modal content)
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });

    // Create Modal Content
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";

    // Close Button ('X')
    const closeButton = document.createElement("button");
    closeButton.id = "tweak-modal-close";
    closeButton.innerHTML = "&times;"; // HTML entity for '×'
    closeButton.setAttribute("aria-label", "Close Settings");
    closeButton.addEventListener("click", () => toggleModal(false));

    // Header
    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";

    // Feedback Area
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " "; // Placeholder to reserve space

    // Checkbox Container
    const checkboxContainer = document.createElement("div");

    // Define Settings and Labels
    const settings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" }, // Updated labels for clarity
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement section" },
    ];

    // Create Checkbox Items
    settings.forEach((setting) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key; // Use setting key as ID
      checkbox.name = setting.key;
      // Add event listener to save setting on change
      checkbox.addEventListener("change", (event) =>
        saveSetting(setting.key, event.target.checked)
      );

      const label = document.createElement("label");
      label.htmlFor = setting.key; // Link label to checkbox by ID
      label.textContent = setting.label;

      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      checkboxContainer.appendChild(itemDiv);
    });

    // Assemble Modal structure
    modalElement.appendChild(closeButton);
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(checkboxContainer);
    modalOverlay.appendChild(modalElement); // Add modal box to overlay
    document.body.appendChild(modalOverlay); // Add overlay to page body
  }

  // Function to load current settings into the modal's checkboxes
  function loadSettingsIntoModal() {
    if (!modalElement) return; // Ensure modal exists

    Object.values(settingsKeys).forEach((key) => {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        checkbox.checked = getSetting(key); // Set checked state based on localStorage
      }
    });
    // Clear feedback message when opening the modal
    if (feedbackElement) feedbackElement.textContent = " ";
  }

  // Function to save a setting to localStorage and update feedback
  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`${consolePrefix} Setting ${key} saved: ${value}`);
      // Show feedback message
      if (feedbackElement) {
        feedbackElement.textContent =
          "Settings saved. Reload the page for changes to take effect.";
      }
      // Re-apply styles immediately. While reload is needed for full effect (especially if elements were added later),
      // this provides instant feedback for existing elements.
      applyStylesBasedOnSettings();
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }

  // Function to toggle the modal visibility
  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found.`);
      return; // Modal hasn't been created yet
    }
    // Determine target state: show if forceState is true, hide if false, toggle otherwise
    const shouldShow =
      typeof forceState === "boolean"
        ? forceState
        : modalOverlay.style.display === "none";

    if (shouldShow) {
      loadSettingsIntoModal(); // Load current settings when showing
      modalOverlay.style.display = "flex"; // Use flex to enable centering
    } else {
      modalOverlay.style.display = "none"; // Hide the modal
    }
  }

  // --- Keyboard Shortcut Listener ---
  document.addEventListener("keydown", (event) => {
    // Check for Shift + Alt + T (case-insensitive key check)
    if (event.shiftKey && event.altKey && event.key.toUpperCase() === "T") {
      // Optional: Check if focus is inside an input/textarea to avoid conflict
      // const activeElement = document.activeElement;
      // const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
      // if (isInputFocused) return;

      event.preventDefault(); // Prevent any default browser action for this combo
      event.stopPropagation(); // Stop the event from bubbling further
      toggleModal(); // Toggle the modal visibility
    }
  });

  // --- Initialization ---

  // Ensure the modal is created when the script runs
  createSettingsModal();

  // --- Observe DOM changes and apply styles ---
  const observer = new MutationObserver((mutationsList) => {
    // Optimization: debounce or check mutations if performance becomes an issue
    // For now, simply re-apply styles on any observed change
    applyStylesBasedOnSettings();
  });

  // Start observing the body for child additions/removals and subtree changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Apply styles based on settings as soon as the DOM is ready
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    applyStylesBasedOnSettings();
  } else {
    document.addEventListener("DOMContentLoaded", applyStylesBasedOnSettings);
  }

  console.log(`${consolePrefix} Initialized. Press Shift+Alt+T for settings.`);
})();
