// reduce non determinism from background networking
export const disableBackgroundNetworking = [
  // Disable translation
  "--disable-features=TranslateUI",
  // Disable several subsystems which run network requests in the background.
  "--disable-background-networking",
  // Enables the recording of metrics reports but disables reporting.
  "--metrics-recording-only",
  // Disable default component extensions with background pages
  "--disable-component-extensions-with-background-pages",
  // Disables syncing browser data to a Google Account.
  "--disable-sync",
  "--disable-client-side-phishing-detection",
  "--disable-component-update"
];

export const disableTaskThrottling = [
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--disable-background-timer-throttling",
  "--disable-ipc-flooding-protection",
  "--disable-hang-monitor"
];

export const disableFirstRun = [
  // Skip First Run tasks, whether or not it's actually the First Run.
  "--no-first-run",
  // Disables installation of default apps on first run.
  "--disable-default-apps",
  // Disables the default browser check.
  "--no-default-browser-check"
];

export const automationFlags = [
  // Enable indication that browser is controlled by automation.
  "--enable-automation",
  // Unresponsive page dialog
  "--disable-hang-monitor",
  // Suppresses all error dialogs when present.
  "--noerrdialogs",
  // Prevents permission prompts from appearing by denying instead of showing
  // prompts.
  "--deny-permission-prompts",
  "--autoplay-policy=no-user-gesture-required",
  "--disable-popup-blocking",
  "--disable-prompt-on-repost",
  "--disable-search-geolocation-disclosure",
  // linux password store
  "--password-store=basic",
  // mac password store
  "--use-mock-keychain",
  "--force-color-profile=srgb"
];

export const defaultFlags = disableFirstRun.concat(
  automationFlags,
  disableTaskThrottling,
  disableBackgroundNetworking
);

export const headlessFlags = [
  "--headless",
  "--hide-scrollbars",
  "--mute-audio"
];

export default defaultFlags;
