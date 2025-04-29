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
    customPageTitle: "tweak_customPageTitle",
    showModalButton: "tweak_showModalButton",
  };

  const consolePrefix = "TypingMind Tweaks:";
  const defaultNewChatButtonColor = "#2563eb";
  const defaultWorkspaceIconColorVisual = "#9ca3af";
  const defaultWorkspaceFontColorVisual = "#d1d5db";
  let originalPageTitle = null;

  function getSetting(key, defaultValue = false) {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : JSON.parse(value);
  }

  function applyStylesBasedOnSettings() {
    const hideTeams = getSetting(settingsKeys.hideTeams);
    const hideKB = getSetting(settingsKeys.hideKB);
    const hideLogo = getSetting(settingsKeys.hideLogo);
    const hideProfile = getSetting(settingsKeys.hideProfile);
    const hideChatProfiles = getSetting(settingsKeys.hideChatProfiles);
    const hidePinnedChars = getSetting(settingsKeys.hidePinnedChars);
    const newChatColor = getSetting(settingsKeys.newChatButtonColor, null);
    const wsIconColor = getSetting(settingsKeys.workspaceIconColor, null);
    const wsFontColor = getSetting(settingsKeys.workspaceFontColor, null);
    const showModalButtonSetting = getSetting(
      settingsKeys.showModalButton,
      true
    );
    const teamsButton = document.querySelector(
      'button[data-element-id="workspace-tab-teams"]'
    );
    if (teamsButton) {
      const newDisplay = hideTeams ? "none" : "";
      if (teamsButton.style.display !== newDisplay) {
        teamsButton.style.display = newDisplay;
      }
    } else {
    }

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
          const newDisplay = hideKB ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
          return;
        }
      });
    }
    const logoImage = document.querySelector(
      'img[alt="TypingMind"][src="/logo.png"]'
    );
    let logoContainerDiv = null;
    if (
      logoImage &&
      logoImage.parentElement &&
      logoImage.parentElement.parentElement &&
      logoImage.parentElement.parentElement.tagName === "DIV"
    ) {
      logoContainerDiv = logoImage.parentElement.parentElement;
    }
    if (logoContainerDiv) {
      const newDisplay = hideLogo ? "none" : "";
      if (logoContainerDiv.style.display !== newDisplay) {
        logoContainerDiv.style.display = newDisplay;
      }
    } else {
    }
    const profileButton = document.querySelector(
      'button[data-element-id="workspace-profile-button"]'
    );
    if (profileButton) {
      const newDisplay = hideProfile ? "none" : "";
      if (profileButton.style.display !== newDisplay) {
        profileButton.style.display = newDisplay;
      }
    } else {
    }
    const chatProfileSpans = document.querySelectorAll("span");
    let chatProfileButtonFound = false;
    chatProfileSpans.forEach((span) => {
      if (span.textContent.trim() === "Chat Profiles") {
        const button = span.closest("button");
        if (button) {
          chatProfileButtonFound = true;
          const newDisplay = hideChatProfiles ? "none" : "";
          if (button.style.display !== newDisplay) {
            button.style.display = newDisplay;
          }
        }
      }
    });
    const pinnedCharsContainer = document.querySelector(
      'div[data-element-id="pinned-characters-container"]'
    );
    if (pinnedCharsContainer) {
      const newDisplay = hidePinnedChars ? "none" : "";
      if (pinnedCharsContainer.style.display !== newDisplay) {
        pinnedCharsContainer.style.display = newDisplay;
      }
    } else {
    }
    const newChatButton = document.querySelector(
      'button[data-element-id="new-chat-button-in-side-bar"]'
    );
    if (newChatButton) {
      if (newChatColor) {
        if (newChatButton.style.backgroundColor !== newChatColor) {
          newChatButton.style.backgroundColor = newChatColor;
        }
      } else {
        if (newChatButton.style.backgroundColor !== "") {
          newChatButton.style.backgroundColor = "";
        }
      }
    } else {
    }
    if (workspaceBar) {
      const icons = workspaceBar.querySelectorAll("svg");
      icons.forEach((icon) => {
        if (wsIconColor) {
          if (icon.style.color !== wsIconColor) {
            icon.style.color = wsIconColor;
          }
        } else {
          if (icon.style.color !== "") {
            icon.style.color = "";
          }
        }
      });
    } else {
    }
    if (workspaceBar) {
      const textSpans = workspaceBar.querySelectorAll("span");
      textSpans.forEach((span) => {
        if (span.textContent.trim()) {
          if (wsFontColor) {
            if (span.style.color !== wsFontColor) {
              span.style.color = wsFontColor;
            }
          } else {
            if (span.style.color !== "") {
              span.style.color = "";
            }
          }
        }
      });
    } else {
    }
    if (workspaceBar) {
      let tweaksButton = document.getElementById("tweak-modal-open-button");
      const settingsButton = workspaceBar.querySelector(
        'button[data-element-id="workspace-tab-settings"]'
      );
      const syncButton = workspaceBar.querySelector(
        'button[data-element-id="workspace-tab-cloudsync"]'
      );
      const insertReferenceButton = settingsButton;
      const styleReferenceButton = syncButton || profileButton;

      if (!tweaksButton && styleReferenceButton) {
        tweaksButton = document.createElement("button");
        tweaksButton.id = "tweak-modal-open-button";
        tweaksButton.title = "Open UI Tweaks";
        tweaksButton.dataset.elementId = "workspace-tab-tweaks";

        tweaksButton.className = styleReferenceButton.className;

        const outerSpan = document.createElement("span");
        const styleReferenceOuterSpan =
          styleReferenceButton.querySelector(":scope > span");
        if (styleReferenceOuterSpan) {
          outerSpan.className = styleReferenceOuterSpan.className;
        }

        const iconDiv = document.createElement("div");
        const styleReferenceIconDiv = styleReferenceButton.querySelector(
          ":scope > span > div"
        );
        if (styleReferenceIconDiv) {
          iconDiv.className = styleReferenceIconDiv.className;
        }
        iconDiv.style.position = "relative";

        const svgIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        const styleReferenceSvg = styleReferenceButton.querySelector("svg");
        if (styleReferenceSvg) {
          svgIcon.setAttribute(
            "class",
            styleReferenceSvg.getAttribute("class") || "w-5 h-5"
          );
          svgIcon.setAttribute(
            "width",
            styleReferenceSvg.getAttribute("width") || "18"
          );
          svgIcon.setAttribute(
            "height",
            styleReferenceSvg.getAttribute("height") || "18"
          );
        } else {
          svgIcon.setAttribute("class", "w-5 h-5");
          svgIcon.setAttribute("width", "18");
          svgIcon.setAttribute("height", "18");
        }
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        const currentWsIconColor = getSetting(
          settingsKeys.workspaceIconColor,
          null
        );
        svgIcon.style.color =
          currentWsIconColor || defaultWorkspaceIconColorVisual;
        svgIcon.setAttribute("fill", "currentColor");

        const svgPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        svgPath.setAttribute(
          "d",
          "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
        );
        svgIcon.appendChild(svgPath);
        iconDiv.appendChild(svgIcon);

        const textSpan = document.createElement("span");
        const styleReferenceTextSpan = styleReferenceButton.querySelector(
          ":scope > span > span"
        );
        if (styleReferenceTextSpan) {
          textSpan.className = styleReferenceTextSpan.className;
        }
        textSpan.textContent = "Tweaks";

        outerSpan.appendChild(iconDiv);
        outerSpan.appendChild(textSpan);
        tweaksButton.appendChild(outerSpan);

        tweaksButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModal(true);
        });

        if (
          insertReferenceButton &&
          insertReferenceButton.parentNode === workspaceBar
        ) {
          workspaceBar.insertBefore(tweaksButton, insertReferenceButton);
        } else {
          workspaceBar.appendChild(tweaksButton);
        }
      } else if (tweaksButton) {
        const svgIcon = tweaksButton.querySelector("svg");
        if (svgIcon) {
          const currentWsIconColor = getSetting(
            settingsKeys.workspaceIconColor,
            null
          );
          const newColor =
            currentWsIconColor || defaultWorkspaceIconColorVisual;
          if (svgIcon.style.color !== newColor) {
            svgIcon.style.color = newColor;
          }
        }
      }

      if (tweaksButton) {
        const newDisplay = showModalButtonSetting ? "inline-flex" : "none";
        if (tweaksButton.style.display !== newDisplay) {
          tweaksButton.style.display = newDisplay;
        }
      }
    }
  }
  function applyCustomTitle() {
    const customTitle = localStorage.getItem(settingsKeys.customPageTitle);
    if (
      customTitle &&
      typeof customTitle === "string" &&
      customTitle.trim() !== ""
    ) {
      if (document.title !== customTitle) {
        document.title = customTitle;
      }
    } else {
      if (originalPageTitle && document.title !== originalPageTitle) {
        document.title = originalPageTitle;
      }
    }
  }
  applyCustomTitle();
  let modalOverlay = null;
  let modalElement = null;
  let feedbackElement = null;
  function createSettingsModal() {
    if (document.getElementById("tweak-modal-overlay")) return;
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

      /* NEW: Text Input Styles (similar to color picker) */
      .tweak-text-item {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #4a4a4a;
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
      .tweak-text-item label {
          margin-right: 10px;
          color: #e0e0e0;
          font-size: 1em;
          white-space: nowrap; /* Prevent label wrapping */
      }
      .tweak-text-input-wrapper {
           display: flex;
           align-items: center;
           flex-grow: 1; /* Allow wrapper to take remaining space */
      }
      .tweak-text-item input[type='text'] {
          flex-grow: 1; /* Allow input to fill space */
          padding: 6px 10px;
          border: 1px solid #777;
          border-radius: 4px;
          background-color: #555;
          color: #f0f0f0;
          font-size: 0.9em;
          margin-right: 10px;
      }
       /* Reuse tweak-reset-button style for clear button */
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    modalOverlay = document.createElement("div");
    modalOverlay.id = "tweak-modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });
    modalElement = document.createElement("div");
    modalElement.id = "tweak-modal";
    const header = document.createElement("h2");
    header.textContent = "UI Tweaks";
    feedbackElement = document.createElement("p");
    feedbackElement.id = "tweak-modal-feedback";
    feedbackElement.textContent = " ";
    const settingsSection = document.createElement("div");
    settingsSection.className = "tweak-settings-section";
    const checkboxContainer = document.createElement("div");
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
      {
        key: settingsKeys.showModalButton,
        label: "Show 'Tweaks' Button in Menu",
        defaultValue: true,
      },
    ];
    settings.forEach((setting) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "tweak-checkbox-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = setting.key;
      checkbox.name = setting.key;
      checkbox.checked = getSetting(setting.key, setting.defaultValue === true);
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
    const colorPickerSection = document.createElement("div");
    colorPickerSection.className = "tweak-color-item";
    const colorLabel = document.createElement("label");
    colorLabel.htmlFor = "tweak_newChatButtonColor_input";
    colorLabel.textContent = "New Chat Button Color:";
    const colorInputWrapper = document.createElement("div");
    colorInputWrapper.className = "tweak-color-input-wrapper";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.id = "tweak_newChatButtonColor_input";
    colorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.newChatButtonColor, event.target.value);
    });
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.className = "tweak-reset-button";
    resetButton.type = "button"; // Prevent form submission if wrapped in form later
    resetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.newChatButtonColor, null);
      colorInput.value = defaultNewChatButtonColor;
    });
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(resetButton);
    colorPickerSection.appendChild(colorLabel);
    colorPickerSection.appendChild(colorInputWrapper);
    const wsIconColorPickerSection = document.createElement("div");
    wsIconColorPickerSection.className = "tweak-color-item";
    const wsIconColorLabel = document.createElement("label");
    wsIconColorLabel.htmlFor = "tweak_workspaceIconColor_input";
    wsIconColorLabel.textContent = "Menu Icon Color:";
    const wsIconColorInputWrapper = document.createElement("div");
    wsIconColorInputWrapper.className = "tweak-color-input-wrapper";
    const wsIconColorInput = document.createElement("input");
    wsIconColorInput.type = "color";
    wsIconColorInput.id = "tweak_workspaceIconColor_input";
    wsIconColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceIconColor, event.target.value);
    });
    const wsIconResetButton = document.createElement("button");
    wsIconResetButton.textContent = "Reset";
    wsIconResetButton.className = "tweak-reset-button";
    wsIconResetButton.type = "button";
    wsIconResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceIconColor, null);
      wsIconColorInput.value = defaultWorkspaceIconColorVisual;
    });
    wsIconColorInputWrapper.appendChild(wsIconColorInput);
    wsIconColorInputWrapper.appendChild(wsIconResetButton);
    wsIconColorPickerSection.appendChild(wsIconColorLabel);
    wsIconColorPickerSection.appendChild(wsIconColorInputWrapper);
    const wsFontColorPickerSection = document.createElement("div");
    wsFontColorPickerSection.className = "tweak-color-item";
    const wsFontColorLabel = document.createElement("label");
    wsFontColorLabel.htmlFor = "tweak_workspaceFontColor_input";
    wsFontColorLabel.textContent = "Menu Font Color:";
    const wsFontColorInputWrapper = document.createElement("div");
    wsFontColorInputWrapper.className = "tweak-color-input-wrapper";
    const wsFontColorInput = document.createElement("input");
    wsFontColorInput.type = "color";
    wsFontColorInput.id = "tweak_workspaceFontColor_input";
    wsFontColorInput.addEventListener("input", (event) => {
      saveSetting(settingsKeys.workspaceFontColor, event.target.value);
    });
    const wsFontResetButton = document.createElement("button");
    wsFontResetButton.textContent = "Reset";
    wsFontResetButton.className = "tweak-reset-button";
    wsFontResetButton.type = "button";
    wsFontResetButton.addEventListener("click", () => {
      saveSetting(settingsKeys.workspaceFontColor, null);
      wsFontColorInput.value = defaultWorkspaceFontColorVisual;
    });
    wsFontColorInputWrapper.appendChild(wsFontColorInput);
    wsFontColorInputWrapper.appendChild(wsFontResetButton);
    wsFontColorPickerSection.appendChild(wsFontColorLabel);
    wsFontColorPickerSection.appendChild(wsFontColorInputWrapper);
    const customTitleSection = document.createElement("div");
    customTitleSection.className = "tweak-text-item";
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "tweak_customPageTitle_input";
    titleLabel.textContent = "Custom Page Title:";
    const titleInputWrapper = document.createElement("div");
    titleInputWrapper.className = "tweak-text-input-wrapper";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "tweak_customPageTitle_input";
    titleInput.placeholder = "";
    titleInput.addEventListener("input", (event) => {
      localStorage.setItem(
        settingsKeys.customPageTitle,
        event.target.value || ""
      );
      applyCustomTitle();
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    const clearTitleButton = document.createElement("button");
    clearTitleButton.textContent = "Clear";
    clearTitleButton.className = "tweak-reset-button";
    clearTitleButton.type = "button";
    clearTitleButton.addEventListener("click", () => {
      localStorage.removeItem(settingsKeys.customPageTitle);
      titleInput.value = "";
      applyCustomTitle();
      if (feedbackElement) feedbackElement.textContent = "Settings saved.";
    });
    titleInputWrapper.appendChild(titleInput);
    titleInputWrapper.appendChild(clearTitleButton);
    customTitleSection.appendChild(titleLabel);
    customTitleSection.appendChild(titleInputWrapper);
    const footer = document.createElement("div");
    footer.className = "tweak-modal-footer";
    const closeButtonBottom = document.createElement("button");
    closeButtonBottom.id = "tweak-modal-bottom-close";
    closeButtonBottom.textContent = "Close";
    closeButtonBottom.addEventListener("click", () => toggleModal(false));
    footer.appendChild(closeButtonBottom);
    modalElement.appendChild(header);
    modalElement.appendChild(feedbackElement);
    modalElement.appendChild(settingsSection);
    modalElement.appendChild(colorPickerSection);
    modalElement.appendChild(wsIconColorPickerSection);
    modalElement.appendChild(wsFontColorPickerSection);
    modalElement.appendChild(customTitleSection);
    modalElement.appendChild(footer);
    modalOverlay.appendChild(modalElement);
    document.body.appendChild(modalOverlay);
  }
  function loadSettingsIntoModal() {
    if (!modalElement) return;
    const settingsMetadata = [
      { key: settingsKeys.hideTeams, defaultValue: false },
      { key: settingsKeys.hideKB, defaultValue: false },
      { key: settingsKeys.hideLogo, defaultValue: false },
      { key: settingsKeys.hideProfile, defaultValue: false },
      { key: settingsKeys.hideChatProfiles, defaultValue: false },
      { key: settingsKeys.hidePinnedChars, defaultValue: false },
      { key: settingsKeys.showModalButton, defaultValue: true },
    ];
    settingsMetadata.forEach(({ key, defaultValue }) => {
      if (
        key !== settingsKeys.newChatButtonColor &&
        key !== settingsKeys.workspaceIconColor &&
        key !== settingsKeys.workspaceFontColor &&
        key !== settingsKeys.customPageTitle
      ) {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = getSetting(key, defaultValue);
        } else {
          console.warn(
            `${consolePrefix} Checkbox element not found for ID: ${key}`
          );
        }
      }
    });
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
    const wsIconColorInput = document.getElementById(
      "tweak_workspaceIconColor_input"
    );
    if (wsIconColorInput) {
      const storedWsIconColor = getSetting(
        settingsKeys.workspaceIconColor,
        null
      );
      wsIconColorInput.value = storedWsIconColor
        ? storedWsIconColor
        : defaultWorkspaceIconColorVisual;
    }
    const wsFontColorInput = document.getElementById(
      "tweak_workspaceFontColor_input"
    );
    if (wsFontColorInput) {
      const storedWsFontColor = getSetting(
        settingsKeys.workspaceFontColor,
        null
      );
      wsFontColorInput.value = storedWsFontColor
        ? storedWsFontColor
        : defaultWorkspaceFontColorVisual;
    }
    const titleInput = document.getElementById("tweak_customPageTitle_input");
    if (titleInput) {
      const storedTitle =
        localStorage.getItem(settingsKeys.customPageTitle) || "";
      titleInput.value = storedTitle;
    }
    if (feedbackElement) feedbackElement.textContent = " ";
  }
  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (feedbackElement) {
        feedbackElement.textContent = "Settings saved.";
      }
      applyStylesBasedOnSettings();
    } catch (error) {
      console.error(`${consolePrefix} Error saving setting ${key}:`, error);
      if (feedbackElement) {
        feedbackElement.textContent = "Error saving settings.";
      }
    }
  }
  function toggleModal(forceState) {
    if (!modalOverlay) {
      console.warn(`${consolePrefix} Modal overlay not found.`);
      return;
    }
    const currentComputedDisplay =
      window.getComputedStyle(modalOverlay).display;
    const shouldShow =
      typeof forceState === "boolean"
        ? forceState
        : currentComputedDisplay === "none";

    if (shouldShow) {
      loadSettingsIntoModal();
      modalOverlay.style.display = "flex";
    } else {
      modalOverlay.style.display = "none";
    }
  }
  document.addEventListener("keydown", (event) => {
    // macOS: Command (event.metaKey)
    // Windows/Linux: Alt (event.altKey)
    const isMac = navigator.userAgent.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? event.metaKey : event.altKey;
    if (event.shiftKey && modifierPressed && event.key.toUpperCase() === "T") {
      event.preventDefault();
      event.stopPropagation();
      toggleModal();
    }
  });
  function initializeTweaks() {
    if (originalPageTitle === null) {
      originalPageTitle = document.title;
    }
    applyStylesBasedOnSettings();
    applyCustomTitle();
  }
  createSettingsModal();
  const observer = new MutationObserver((mutationsList) => {
    applyStylesBasedOnSettings();
    applyCustomTitle();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initializeTweaks();
  } else {
    document.addEventListener("DOMContentLoaded", initializeTweaks);
  }
  console.log(
    `${consolePrefix} Initialized Typingmind UI Tweaks extension. Press Shift+Alt+T for settings.`
  );
})();
