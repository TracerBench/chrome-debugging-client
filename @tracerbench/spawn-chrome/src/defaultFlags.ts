// reduce non determinism from background networking
export const disableBackgroundNetworking = [
  // Disable several subsystems which run network requests in the background.
  "--disable-background-networking",
  // Enables the recording of metrics reports but disables reporting.
  "--metrics-recording-only",
  // Disable default component extensions with background pages
  "--disable-component-extensions-with-background-pages",
  // Disables syncing browser data to a Google Account.
  "--disable-sync",
  // Don't send hyperlink auditing pings
  "--no-pings",
  // Disables Domain Reliability Monitoring.
  "--disable-domain-reliability",
  // This feature allows chrome to prerequest resources it thinks you will request
  "--disable-features=NetworkPrediction",
  // Disables the client-side phishing detection feature.
  "--disable-client-side-phishing-detection",
  // Disable Google Translate detection
  "--disable-translate",
];

export const disableFirstRun = [
  // Skip First Run tasks, whether or not it's actually the First Run.
  "--no-first-run",
  // Disables installation of default apps on first run.
  "--disable-default-apps",
  // Disables the default browser check.
  "--no-default-browser-check",
];

export const automationFlags = [
  // Enable indication that browser is controlled by automation.
  "--enable-automation",
  // Suppresses all error dialogs when present.
  "--noerrdialogs",
  // Prevent infobars from appearing.
  "--disable-infobars",
  // linux password store
  "--password-store=basic",
  // mac password store
  "--use-mock-keychain",
];

export const defaultFlags = [
  // Disable extensions.
  "--disable-extensions",
  // Disables all experiments set on about:flags.
  "--no-experiments",
  // Disables the sandbox for all process types that are normally sandboxed.
  // allows them to log to stdout
  "--no-sandbox",
].concat(disableFirstRun, disableBackgroundNetworking, automationFlags);

export const headlessFlags = [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--mute-audio",
  "--disable-logging",
];

export default defaultFlags;
