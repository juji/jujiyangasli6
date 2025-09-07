const state = {
  headerShown: false,
  manualChange: false,
};

export function setHeaderShown(shown: boolean, manual = false) {
  state.headerShown = shown;
  state.manualChange = manual;
  document.documentElement.style.setProperty(
    "--header-transform-y",
    shown ? "0%" : "-100%",
  );
}

export function getHeaderShown() {
  return state.headerShown;
}

export function getManualChange() {
  return state.manualChange;
}

export function getHeaderHeight() {
  return (
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")
        .replace("px", ""),
    ) || 60
  );
}
