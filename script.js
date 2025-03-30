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

    // Inject CSS (Updated for Dark Theme)
    const styles = `
      #tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.75); /* Darker overlay */
        display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10001; /* High z-index */
        font-family: sans-serif; /* Basic font */
      }
      #tweak-modal {
        background-color: #2d2d2d; /* Dark background */
        color: #f0f0f0; /* Light text */
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 350px; /* Slightly wider */
        max-width: 500px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.5); /* More prominent shadow */
        position: relative;
        /* border: 1px solid #555; /* Optional subtle border */
      }
      #tweak-modal h2 {
          margin-top: 0; margin-bottom: 20px; /* Increased margin */
          color: #ffffff; /* White header */
          font-size: 1.5em; /* Slightly adjusted size */
          font-weight: 600;
          text-align: center;
          /* Removed border-bottom */
       }
      #tweak-modal-feedback {
          font-size: 0.9em; /* Slightly smaller */
          color: #a0cfff; /* Light blue feedback text */
          margin-top: 15px; /* Added margin top */
          margin-bottom: 5px; /* Reduced margin bottom */
          min-height: 1.2em;
          text-align: center;
          font-weight: 500;
       }
      #tweak-modal-close {
        position: absolute; top: 10px; right: 10px; /* Adjusted position */
        font-size: 2.2em;
        color: #aaaaaa; /* Lighter grey 'X' */
        cursor: pointer; line-height: 1; border: none; background: none;
        padding: 0 5px; font-weight: lighter;
        transition: color 0.2s ease; /* Smooth transition */
      }
      #tweak-modal-close:hover { color: #ff4d4d; /* Brighter Red on hover */ }

      /* NEW: Styling for the settings section */
      .tweak-settings-section {
        background-color: #3a3a3a; /* Slightly lighter dark background for section */
        padding: 20px 25px;
        border-radius: 6px;
        margin-top: 10px; /* Space below header/feedback */
        border: 1px solid #484848; /* Subtle border for the section */
      }

      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; } /* Reduce margin for last item */

      .tweak-checkbox-item input[type='checkbox'] {
          margin-right: 15px; /* Increased spacing */
          transform: scale(1.2);
          cursor: pointer;
          accent-color: #007bff; /* Keep blue accent for visibility */
          background-color: #555; /* Darker background for unchecked state */
          border-radius: 3px; /* Slightly rounded */
          border: 1px solid #777;
       }
       /* Style the checkmark itself for better contrast (browser support varies) */
       .tweak-checkbox-item input[type='checkbox']::before {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            background-color: white; /* Ensures checkmark is visible */
            transform: scale(0); /* Hidden when unchecked */
            transition: transform 0.1s ease-in-out;
       }
       .tweak-checkbox-item input[type='checkbox']:checked::before {
            transform: scale(0.6); /* Visible checkmark size */
            /* You might need vendor prefixes depending on browser target */
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 15%, 80% 0%, 43% 62%); /* Checkmark shape */
       }


      .tweak-checkbox-item label {
          cursor: pointer;
          flex-grow: 1;
          font-size: 1em; /* Adjusted size */
          color: #e0e0e0; /* Slightly off-white */
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Overlay
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
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
    closeButton.innerHTML = "&times;";
    closeButton.setAttribute("aria-label", "Close Settings");
    closeButton.addEventListener("click", () => toggleModal(false));

    // Header
    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";

    // Feedback Area
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";

    // NEW: Settings Section Container
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section"; // Add class for styling

    // Checkbox Container (now goes inside settingsSection)
    const checkboxContainer = document.createElement("div");

    // Define Settings and Labels
    const settings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement section" },
    ];

    // Create Checkbox Items
    settings.forEach((setting) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.name = setting.key;
      checkbox.addEventListener("change", (event) =>
        saveSetting(setting.key, event.target.checked)
      );

      const label = document.createElement("label");
      label.htmlFor = setting.key;
      label.textContent = setting.label;

      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
      checkboxContainer.appendChild(itemDiv); // Add item to inner container
    });

    // Add checkboxContainer to the new section container
    settingsSection.appendChild(checkboxContainer);

    // Assemble Modal structure
    modalElement.appendChild(closeButton);
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement); // Feedback appears above the section
    modalElement.appendChild(settingsSection); // Add the styled section
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
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
