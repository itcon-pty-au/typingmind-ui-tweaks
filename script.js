(function () {
  "use strict";

  const settingsKeys = {
    hideTeams: "tweak_hideTeams",
    hideKB: "tweak_hideKB",
    hideLogo: "tweak_hideLogo",
    hideProfile: "tweak_hideProfile",
    hideChatProfiles: "tweak_hideChatProfiles",
    hidePinnedChars: "tweak_hidePinnedChars",
    newChatButtonColor: "tweak_newChatButtonColor",
    workspaceIconColor: "tweak_workspaceIconColor",
    workspaceFontColor: "tweak_workspaceFontColor",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";

  // Function to get settings from localStorage
  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    // Return the specific default value if null
    return value === null ? defaultValue : JSON.parse(value);
  }

  // Modified function to apply styles based on settings
  function applyStylesBasedOnSettings() {
    const hideTeams = getSetting(settingsKeys.hideTeams);
    const hideKB = getSetting(settingsKeys.hideKB);
    const hideLogo = getSetting(settingsKeys.hideLogo);
    const hideProfile = getSetting(settingsKeys.hideProfile);
    const hideChatProfiles = getSetting(settingsKeys.hideChatProfiles);
    const hidePinnedChars = getSetting(settingsKeys.hidePinnedChars);

    // Get color setting, default to null if not set
    const newChatColor = getSetting(settingsKeys.newChatButtonColor, null);
    const wsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
    const wsFontColor = getSetting(settingsKeys.workspaceFontColor, null);

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

    // --- Apply Profile button style ---
    const profileButton = document.querySelector(
      'button[data-element-id="workspace-profile-button"]'
    );
    if (profileButton) {
      const newDisplay = hideProfile ? "none" : "";
      if (profileButton.style.display !== newDisplay) {
        profileButton.style.display = newDisplay;
        // Optional: console.log(`${consolePrefix} Profile button display set to '${newDisplay || 'default'}'.`);
      }
    } else {
      // Optional: console.log(`${consolePrefix} Profile button not found.`);
    }

    // --- Apply Chat Profiles button style ---
    const chatProfileSpans = document.querySelectorAll("span");
    let chatProfileButtonFound = false;
    chatProfileSpans.forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button"); // Find the nearest ancestor button
        if (button) {
          chatProfileButtonFound = true;
          const newDisplay = hideChatProfiles ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
            // Optional: console.log(`${consolePrefix} Chat Profiles button display set to '${newDisplay || 'default'}'.`);
          }
          // Assuming there's only one such button, but loop continues just in case
        }
      }
    });
    // Optional: if (!chatProfileButtonFound) { console.log(`${consolePrefix} Chat Profiles button not found.`); }

    // --- Apply Pinned Characters container style ---
    const pinnedCharsContainer = document.querySelector(
      'div[data-element-id="pinned-characters-container"]'
    );
    if (pinnedCharsContainer) {
      const newDisplay = hidePinnedChars ? "none" : "";
      if (pinnedCharsContainer.style.display !== newDisplay) {
        pinnedCharsContainer.style.display = newDisplay;
        // Optional: console.log(`${consolePrefix} Pinned Characters container display set to '${newDisplay || 'default'}'.`);
      }
    } else {
      // Optional: console.log(`${consolePrefix} Pinned Characters container not found.`);
    }

    // --- Apply New Chat button color ---
    const newChatButton = document.querySelector(
      'button[data-element-id="new-chat-button-in-side-bar"]'
    );
    if (newChatButton) {
      if (newChatColor) {
        // Apply user-defined color
        if (newChatButton.style.backgroundColor !== newChatColor) {
          newChatButton.style.backgroundColor = newChatColor;
          // Optional: console.log(`${consolePrefix} New Chat button color set to ${newChatColor}.`);
        }
      } else {
        // Reset to default (remove inline style)
        if (newChatButton.style.backgroundColor !== "") {
          newChatButton.style.backgroundColor = "";
          // Optional: console.log(`${consolePrefix} New Chat button color reset to default.`);
        }
      }
    } else {
      // Optional: console.log(`${consolePrefix} New Chat button not found.`);
    }

    // --- Apply Workspace Icon color ---
    if (workspaceBar) {
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        if (wsIconColor) {
          // Apply user-defined color
          if (icon.style.color !== wsIconColor) {
            icon.style.color = wsIconColor;
          }
        } else {
          // Reset to default (remove inline style)
          if (icon.style.color !== "") {
            icon.style.color = "";
          }
        }
      });
      // Optional: console.log(`${consolePrefix} Workspace icons color updated.`);
    } else {
      // Optional: console.log(`${consolePrefix} Workspace bar not found for icon coloring.`);
    }

    // --- Apply Workspace Font color ---
    if (workspaceBar) {
      // Find all span elements within the workspace bar
      const textSpans = workspaceBar.querySelectorAll("span");
      textSpans.forEach((span) => {
        // Apply color directly to the span if it contains text
        // We might need to refine this selector if it colors unwanted spans
        if (span.textContent.trim()) {
          if (wsFontColor) {
            // Apply user-defined color
            if (span.style.color !== wsFontColor) {
              span.style.color = wsFontColor;
            }
          } else {
            // Reset to default (remove inline style)
            if (span.style.color !== "") {
              span.style.color = "";
            }
          }
        }
      });

      // Optional: Apply to the bar itself too, in case some elements inherit
      // if (wsFontColor) {
      //     if (workspaceBar.style.color !== wsFontColor) {
      //         workspaceBar.style.color = wsFontColor;
      //     }
      // } else {
      //     if (workspaceBar.style.color !== '') {
      //        workspaceBar.style.color = '';
      //     }
      // }
      // Optional: console.log(`${consolePrefix} Workspace font color updated.`);
    } else {
      // Optional: console.log(`${consolePrefix} Workspace bar not found for font coloring.`);
    }
  }

  // --- Modal Elements and Logic ---
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;

  function createSettingsModal() {
    // Prevent creating multiple modals if script runs again somehow
    if (document.getElementById("tweak-modal-overlay")) return;

    // Inject CSS (Updated for Dark Theme v2)
    const styles = `
      #tweak-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Even darker overlay */
        display: none; /* Hidden by default */
        justify-content: center; align-items: center; z-index: 10001;
        font-family: sans-serif;
      }
      #tweak-modal {
        background-color: #252525; /* Very dark grey, near black */
        color: #f0f0f0;
        padding: 25px 35px;
        border-radius: 8px;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.6); /* Stronger shadow */
        position: relative;
        border: 1px solid #4a4a4a; /* Subtle light grey border */
      }
      #tweak-modal h2 {
          margin-top: 0; margin-bottom: 20px;
          color: #ffffff;
          font-size: 1.5em;
          font-weight: 600;
          text-align: center;
       }
      #tweak-modal-feedback {
          font-size: 0.9em;
          color: #a0cfff;
          margin-top: 15px;
          margin-bottom: 5px;
          min-height: 1.2em;
          text-align: center;
          font-weight: 500;
       }

      .tweak-settings-section {
        background-color: #333333; /* Slightly adjusted section background */
        padding: 20px 25px;
        border-radius: 6px;
        margin-top: 10px;
        border: 1px solid #484848;
      }

      .tweak-checkbox-item { margin-bottom: 18px; display: flex; align-items: center; }
      .tweak-checkbox-item:last-child { margin-bottom: 5px; }

      .tweak-checkbox-item input[type='checkbox'] {
          margin-right: 15px;
          transform: scale(1.2);
          cursor: pointer;
          accent-color: #0d6efd; /* Standard Bootstrap blue for check */
          background-color: #555;
          border-radius: 3px;
          border: 1px solid #777;
          /* Appearance none needed for custom checkmark styling below */
          appearance: none;
          -webkit-appearance: none;
          width: 1.2em;
          height: 1.2em;
          position: relative;
       }
       /* Custom checkmark */
       .tweak-checkbox-item input[type='checkbox']::before {
            content: "✓"; /* Unicode checkmark */
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 1em;
            font-weight: bold;
            color: white;
            transition: transform 0.1s ease-in-out;
            line-height: 1;
       }
       .tweak-checkbox-item input[type='checkbox']:checked {
            background-color: #0d6efd; /* Blue background when checked */
            border-color: #0d6efd;
       }
       .tweak-checkbox-item input[type='checkbox']:checked::before {
            transform: translate(-50%, -50%) scale(1.2); /* Make checkmark visible */
       }

      .tweak-checkbox-item label {
          cursor: pointer;
          flex-grow: 1;
          font-size: 1em;
          color: #e0e0e0;
      }

      /* NEW: Footer styling */
      .tweak-modal-footer {
        margin-top: 25px; /* Space above the footer */
        padding-top: 15px; /* Space above the button */
        border-top: 1px solid #4a4a4a; /* Separator line */
        display: flex;
        justify-content: flex-end; /* Align button to the right */
      }

      /* NEW: Close button styling */
      #tweak-modal-bottom-close {
        background-color: #dc3545; /* Red background (Bootstrap danger) */
        color: white;
        border: 1px solid #dc3545;
        padding: 8px 18px; /* Padding */
        border-radius: 6px; /* Rounded corners */
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }
      #tweak-modal-bottom-close:hover {
        background-color: #c82333; /* Darker red on hover */
        border-color: #bd2130;
      }

      /* NEW: Color Picker Styles */
      .tweak-color-item {
          margin-top: 20px; /* Space above this section */
          padding-top: 15px;
          border-top: 1px solid #4a4a4a; /* Separator line */
          display: flex;
          align-items: center;
          justify-content: space-between; /* Align items */
       }
      .tweak-color-item label {
          margin-right: 10px;
          color: #e0e0e0;
          font-size: 1em;
       }
       .tweak-color-input-wrapper {
            display: flex;
            align-items: center;
       }
      .tweak-color-item input[type='color'] {
          width: 40px;
          height: 30px;
          border: 1px solid #777;
          border-radius: 4px;
          cursor: pointer;
          background-color: #555; /* Background for the picker itself */
          margin-right: 10px;
          padding: 2px; /* Small padding */
       }
       /* Optional: Style the reset button */
       .tweak-reset-button {
            background-color: #6c757d; /* Grey background (Bootstrap secondary) */
            color: white;
            border: 1px solid #6c757d;
            padding: 4px 10px; /* Smaller padding */
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease;
       }
        .tweak-reset-button:hover {
            background-color: #5a6268;
            border-color: #545b62;
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

    // Header
    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";

    // Feedback Area
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";

    // Settings Section Container
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";

    // Checkbox Container
    const checkboxContainer = document.createElement("div");

    // Define Settings and Labels
    const settings = [
      { key: settingsKeys.hideTeams, label: "Hide 'Teams' menu item" },
      { key: settingsKeys.hideKB, label: "Hide 'KB' menu item" },
      { key: settingsKeys.hideLogo, label: "Hide Logo & Announcement section" },
      { key: settingsKeys.hideProfile, label: "Hide 'Profile' button" },
      {
        key: settingsKeys.hideChatProfiles,
        label: "Hide 'Chat Profiles' button",
      },
      {
        key: settingsKeys.hidePinnedChars,
        label: "Hide 'Characters' in New Chat",
      },
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
      checkboxContainer.appendChild(itemDiv);
    });

    settingsSection.appendChild(checkboxContainer);

    // --- NEW: Create Color Picker Section ---
    const colorPickerSection = document.createElement("div");
    colorPickerSection.className = "tweak-color-item";

    const colorLabel = document.createElement("label");
    colorLabel.htmlFor = "tweak_newChatButtonColor_input"; // Match input ID
    colorLabel.textContent = "New Chat Button Color:";

    const colorInputWrapper = document.createElement("div"); // Wrapper for input + reset
    colorInputWrapper.className = "tweak-color-input-wrapper";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.id = "tweak_newChatButtonColor_input";
    // Add event listener to save color on change
    colorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.newChatButtonColor, event.target.value);
    });

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.className = "tweak-reset-button";
    resetButton.type = "button"; // Prevent form submission if wrapped in form later
    resetButton.addEventListener("click", () => {
      // Save null to clear the setting
      saveSetting(settingsKeys.newChatButtonColor, null);
      // Reset the color picker's displayed value to default
      colorInput.value = defaultNewChatButtonColor;
      // Feedback is handled within saveSetting
    });

    // Assemble color picker section
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(resetButton);
    colorPickerSection.appendChild(colorLabel);
    colorPickerSection.appendChild(colorInputWrapper);
    // --- End Color Picker Section ---

    // --- NEW: Create Workspace Icon Color Picker Section ---
    const wsIconColorPickerSection = document.createElement("div");
    wsIconColorPickerSection.className = "tweak-color-item"; // Reuse same class

    const wsIconColorLabel = document.createElement("label");
    wsIconColorLabel.htmlFor = "tweak_workspaceIconColor_input";
    wsIconColorLabel.textContent = "Workspace Icon Color:";

    const wsIconColorInputWrapper = document.createElement("div");
    wsIconColorInputWrapper.className = "tweak-color-input-wrapper"; // Reuse class

    const wsIconColorInput = document.createElement("input");
    wsIconColorInput.type = "color";
    wsIconColorInput.id = "tweak_workspaceIconColor_input";
    wsIconColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceIconColor, event.target.value);
    });

    const wsIconResetButton = document.createElement("button");
    wsIconResetButton.textContent = "Reset";
    wsIconResetButton.className = "tweak-reset-button"; // Reuse class
    wsIconResetButton.type = "button";
    wsIconResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceIconColor, null);
      wsIconColorInput.value = defaultWorkspaceIconColorVisual; // Reset picker to visual default
    });

    // Assemble workspace icon color picker section
    wsIconColorInputWrapper.appendChild(wsIconColorInput);
    wsIconColorInputWrapper.appendChild(wsIconResetButton);
    wsIconColorPickerSection.appendChild(wsIconColorLabel);
    wsIconColorPickerSection.appendChild(wsIconColorInputWrapper);
    // --- End Workspace Icon Color Picker Section ---

    // --- NEW: Create Workspace Font Color Picker Section ---
    const wsFontColorPickerSection = document.createElement("div");
    wsFontColorPickerSection.className = "tweak-color-item"; // Reuse class

    const wsFontColorLabel = document.createElement("label");
    wsFontColorLabel.htmlFor = "tweak_workspaceFontColor_input";
    wsFontColorLabel.textContent = "Workspace Font Color:";

    const wsFontColorInputWrapper = document.createElement("div");
    wsFontColorInputWrapper.className = "tweak-color-input-wrapper"; // Reuse class

    const wsFontColorInput = document.createElement("input");
    wsFontColorInput.type = "color";
    wsFontColorInput.id = "tweak_workspaceFontColor_input";
    wsFontColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceFontColor, event.target.value);
    });

    const wsFontResetButton = document.createElement("button");
    wsFontResetButton.textContent = "Reset";
    wsFontResetButton.className = "tweak-reset-button"; // Reuse class
    wsFontResetButton.type = "button";
    wsFontResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceFontColor, null);
      wsFontColorInput.value = defaultWorkspaceFontColorVisual; // Reset picker to visual default
    });

    // Assemble workspace font color picker section
    wsFontColorInputWrapper.appendChild(wsFontColorInput);
    wsFontColorInputWrapper.appendChild(wsFontResetButton);
    wsFontColorPickerSection.appendChild(wsFontColorLabel);
    wsFontColorPickerSection.appendChild(wsFontColorInputWrapper);
    // --- End Workspace Font Color Picker Section ---

    // Create Footer Container
    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";

    // NEW: Create Bottom Close Button
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));

    // NEW: Append Button to Footer
    footer.appendChild(closeButtonBottom);

    // Assemble Modal structure
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(settingsSection);
    modalElement.appendChild(colorPickerSection);
    modalElement.appendChild(wsIconColorPickerSection);
    modalElement.appendChild(wsFontColorPickerSection);
    modalElement.appendChild(footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
  }

  // Function to load current settings into the modal's elements
  function loadSettingsIntoModal() {
    if (!modalElement) return; // Ensure modal exists

    // Load checkbox states
    Object.keys(settingsKeys).forEach((key) => {
      // Only process non-color settings here
      if (
        key !== settingsKeys.newChatButtonColor &&
        key !== settingsKeys.workspaceIconColor &&
        key !== settingsKeys.workspaceFontColor
      ) {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = getSetting(key); // Default is false
        }
      }
    });

    // Load New Chat color picker state
    const newChatColorInput = document.getElementById(
      "tweak_newChatButtonColor_input"
    );
    if (newChatColorInput) {
      const storedNewChatColor = getSetting(
        settingsKeys.newChatButtonColor,
        null
      );
      newChatColorInput.value = storedNewChatColor
        ? storedNewChatColor
        : defaultNewChatButtonColor;
    }

    // Load Workspace Icon color picker state
    const wsIconColorInput = document.getElementById(
      "tweak_workspaceIconColor_input"
    );
    if (wsIconColorInput) {
      const storedWsIconColor = getSetting(
        settingsKeys.workspaceIconColor,
        null
      );
      // If a color is stored, use it. Otherwise, use the visual default grey.
      wsIconColorInput.value = storedWsIconColor
        ? storedWsIconColor
        : defaultWorkspaceIconColorVisual;
    }

    // Load Workspace Font color picker state
    const wsFontColorInput = document.getElementById(
      "tweak_workspaceFontColor_input"
    );
    if (wsFontColorInput) {
      const storedWsFontColor = getSetting(
        settingsKeys.workspaceFontColor,
        null
      );
      // If a color is stored, use it. Otherwise, use the visual default grey.
      wsFontColorInput.value = storedWsFontColor
        ? storedWsFontColor
        : defaultWorkspaceFontColorVisual;
    }

    // Clear feedback message when opening the modal
    if (feedbackElement) feedbackElement.textContent = " ";
  }

  // Function to save a setting to localStorage and update feedback
  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      //console.log(`${consolePrefix} Setting ${key} saved: ${value}`);
      // Show feedback message
      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
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
    const currentComputedDisplay =
      window.getComputedStyle(modalOverlay).display;
    const shouldShow =
      typeof forceState === "boolean"
        ? forceState
        : currentComputedDisplay === "none";

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

  console.log(
    `${consolePrefix} Initialized Typingmind UI Tweaks extension. Press Shift+Alt+T for settings.`
  );
})();
