/**
 * Debugging Protocol Domains
 * Generated on Wed Jul 19 2017 13:57:10 GMT-0700 (PDT)
 */
/* tslint:disable */
import { IDebuggingProtocolClient } from "../lib/types";
export class Inspector {
  private _detached: Inspector.DetachedHandler | null = null;
  private _targetCrashed: Inspector.TargetCrashedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables inspector domain notifications. */
  public enable() {
    return this._client.send<void>("Inspector.enable");
  }
  /** Disables inspector domain notifications. */
  public disable() {
    return this._client.send<void>("Inspector.disable");
  }
  /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
  get detached() {
    return this._detached;
  }
  set detached(handler) {
    if (this._detached) {
      this._client.removeListener("Inspector.detached", this._detached);
    }
    this._detached = handler;
    if (handler) {
      this._client.on("Inspector.detached", handler);
    }
  }
  /** Fired when debugging target has crashed */
  get targetCrashed() {
    return this._targetCrashed;
  }
  set targetCrashed(handler) {
    if (this._targetCrashed) {
      this._client.removeListener("Inspector.targetCrashed", this._targetCrashed);
    }
    this._targetCrashed = handler;
    if (handler) {
      this._client.on("Inspector.targetCrashed", handler);
    }
  }
}
export namespace Inspector {
  export type DetachedParameters = {
    /** The reason why connection has been terminated. */
    reason: string;
  };
  export type DetachedHandler = (params: DetachedParameters) => void;
  export type TargetCrashedHandler = () => void;
}
export class Memory {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public getDOMCounters() {
    return this._client.send<Memory.GetDOMCountersReturn>("Memory.getDOMCounters");
  }
  /** Enable/disable suppressing memory pressure notifications in all processes. */
  public setPressureNotificationsSuppressed(params: Memory.SetPressureNotificationsSuppressedParameters) {
    return this._client.send<void>("Memory.setPressureNotificationsSuppressed", params);
  }
  /** Simulate a memory pressure notification in all processes. */
  public simulatePressureNotification(params: Memory.SimulatePressureNotificationParameters) {
    return this._client.send<void>("Memory.simulatePressureNotification", params);
  }
}
export namespace Memory {
  /** Memory pressure level. */
  export type PressureLevel = "moderate" | "critical";
  export type GetDOMCountersReturn = {
    documents: number;
    nodes: number;
    jsEventListeners: number;
  };
  export type SetPressureNotificationsSuppressedParameters = {
    /** If true, memory pressure notifications will be suppressed. */
    suppressed: boolean;
  };
  export type SimulatePressureNotificationParameters = {
    /** Memory pressure level of the notification. */
    level: PressureLevel;
  };
}
/** Actions and events related to the inspected page belong to the page domain. */
export class Page {
  private _domContentEventFired: Page.DomContentEventFiredHandler | null = null;
  private _loadEventFired: Page.LoadEventFiredHandler | null = null;
  private _frameAttached: Page.FrameAttachedHandler | null = null;
  private _frameNavigated: Page.FrameNavigatedHandler | null = null;
  private _frameDetached: Page.FrameDetachedHandler | null = null;
  private _frameStartedLoading: Page.FrameStartedLoadingHandler | null = null;
  private _frameStoppedLoading: Page.FrameStoppedLoadingHandler | null = null;
  private _frameScheduledNavigation: Page.FrameScheduledNavigationHandler | null = null;
  private _frameClearedScheduledNavigation: Page.FrameClearedScheduledNavigationHandler | null = null;
  private _frameResized: Page.FrameResizedHandler | null = null;
  private _javascriptDialogOpening: Page.JavascriptDialogOpeningHandler | null = null;
  private _javascriptDialogClosed: Page.JavascriptDialogClosedHandler | null = null;
  private _screencastFrame: Page.ScreencastFrameHandler | null = null;
  private _screencastVisibilityChanged: Page.ScreencastVisibilityChangedHandler | null = null;
  private _interstitialShown: Page.InterstitialShownHandler | null = null;
  private _interstitialHidden: Page.InterstitialHiddenHandler | null = null;
  private _navigationRequested: Page.NavigationRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables page domain notifications. */
  public enable() {
    return this._client.send<void>("Page.enable");
  }
  /** Disables page domain notifications. */
  public disable() {
    return this._client.send<void>("Page.disable");
  }
  /** Deprecated, please use addScriptToEvaluateOnNewDocument instead. */
  public addScriptToEvaluateOnLoad(params: Page.AddScriptToEvaluateOnLoadParameters) {
    return this._client.send<Page.AddScriptToEvaluateOnLoadReturn>("Page.addScriptToEvaluateOnLoad", params);
  }
  /** Deprecated, please use removeScriptToEvaluateOnNewDocument instead. */
  public removeScriptToEvaluateOnLoad(params: Page.RemoveScriptToEvaluateOnLoadParameters) {
    return this._client.send<void>("Page.removeScriptToEvaluateOnLoad", params);
  }
  /** Evaluates given script in every frame upon creation (before loading frame's scripts). */
  public addScriptToEvaluateOnNewDocument(params: Page.AddScriptToEvaluateOnNewDocumentParameters) {
    return this._client.send<Page.AddScriptToEvaluateOnNewDocumentReturn>("Page.addScriptToEvaluateOnNewDocument", params);
  }
  /** Removes given script from the list. */
  public removeScriptToEvaluateOnNewDocument(params: Page.RemoveScriptToEvaluateOnNewDocumentParameters) {
    return this._client.send<void>("Page.removeScriptToEvaluateOnNewDocument", params);
  }
  /** Controls whether browser will open a new inspector window for connected pages. */
  public setAutoAttachToCreatedPages(params: Page.SetAutoAttachToCreatedPagesParameters) {
    return this._client.send<void>("Page.setAutoAttachToCreatedPages", params);
  }
  /** Reloads given page optionally ignoring the cache. */
  public reload(params: Page.ReloadParameters) {
    return this._client.send<void>("Page.reload", params);
  }
  /** Navigates current page to the given URL. */
  public navigate(params: Page.NavigateParameters) {
    return this._client.send<Page.NavigateReturn>("Page.navigate", params);
  }
  /** Force the page stop all navigations and pending resource fetches. */
  public stopLoading() {
    return this._client.send<void>("Page.stopLoading");
  }
  /** Returns navigation history for the current page. */
  public getNavigationHistory() {
    return this._client.send<Page.GetNavigationHistoryReturn>("Page.getNavigationHistory");
  }
  /** Navigates current page to the given history entry. */
  public navigateToHistoryEntry(params: Page.NavigateToHistoryEntryParameters) {
    return this._client.send<void>("Page.navigateToHistoryEntry", params);
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  public getCookies() {
    return this._client.send<Page.GetCookiesReturn>("Page.getCookies");
  }
  /** Deletes browser cookie with given name, domain and path. */
  public deleteCookie(params: Page.DeleteCookieParameters) {
    return this._client.send<void>("Page.deleteCookie", params);
  }
  /** Returns present frame / resource tree structure. */
  public getResourceTree() {
    return this._client.send<Page.GetResourceTreeReturn>("Page.getResourceTree");
  }
  /** Returns content of the given resource. */
  public getResourceContent(params: Page.GetResourceContentParameters) {
    return this._client.send<Page.GetResourceContentReturn>("Page.getResourceContent", params);
  }
  /** Searches for given string in resource content. */
  public searchInResource(params: Page.SearchInResourceParameters) {
    return this._client.send<Page.SearchInResourceReturn>("Page.searchInResource", params);
  }
  /** Sets given markup as the document's HTML. */
  public setDocumentContent(params: Page.SetDocumentContentParameters) {
    return this._client.send<void>("Page.setDocumentContent", params);
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  public setDeviceMetricsOverride(params: Page.SetDeviceMetricsOverrideParameters) {
    return this._client.send<void>("Page.setDeviceMetricsOverride", params);
  }
  /** Clears the overriden device metrics. */
  public clearDeviceMetricsOverride() {
    return this._client.send<void>("Page.clearDeviceMetricsOverride");
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  public setGeolocationOverride(params: Page.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Page.setGeolocationOverride", params);
  }
  /** Clears the overriden Geolocation Position and Error. */
  public clearGeolocationOverride() {
    return this._client.send<void>("Page.clearGeolocationOverride");
  }
  /** Overrides the Device Orientation. */
  public setDeviceOrientationOverride(params: Page.SetDeviceOrientationOverrideParameters) {
    return this._client.send<void>("Page.setDeviceOrientationOverride", params);
  }
  /** Clears the overridden Device Orientation. */
  public clearDeviceOrientationOverride() {
    return this._client.send<void>("Page.clearDeviceOrientationOverride");
  }
  /** Toggles mouse event-based touch event emulation. */
  public setTouchEmulationEnabled(params: Page.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Page.setTouchEmulationEnabled", params);
  }
  /** Capture page screenshot. */
  public captureScreenshot(params: Page.CaptureScreenshotParameters) {
    return this._client.send<Page.CaptureScreenshotReturn>("Page.captureScreenshot", params);
  }
  /** Print page as PDF. */
  public printToPDF(params: Page.PrintToPDFParameters) {
    return this._client.send<Page.PrintToPDFReturn>("Page.printToPDF", params);
  }
  /** Starts sending each frame using the <code>screencastFrame</code> event. */
  public startScreencast(params: Page.StartScreencastParameters) {
    return this._client.send<void>("Page.startScreencast", params);
  }
  /** Stops sending each frame in the <code>screencastFrame</code>. */
  public stopScreencast() {
    return this._client.send<void>("Page.stopScreencast");
  }
  /** Acknowledges that a screencast frame has been received by the frontend. */
  public screencastFrameAck(params: Page.ScreencastFrameAckParameters) {
    return this._client.send<void>("Page.screencastFrameAck", params);
  }
  /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
  public handleJavaScriptDialog(params: Page.HandleJavaScriptDialogParameters) {
    return this._client.send<void>("Page.handleJavaScriptDialog", params);
  }
  public getAppManifest() {
    return this._client.send<Page.GetAppManifestReturn>("Page.getAppManifest");
  }
  public requestAppBanner() {
    return this._client.send<void>("Page.requestAppBanner");
  }
  /** Toggles navigation throttling which allows programatic control over navigation and redirect response. */
  public setControlNavigations(params: Page.SetControlNavigationsParameters) {
    return this._client.send<void>("Page.setControlNavigations", params);
  }
  /** Should be sent in response to a navigationRequested or a redirectRequested event, telling the browser how to handle the navigation. */
  public processNavigation(params: Page.ProcessNavigationParameters) {
    return this._client.send<void>("Page.processNavigation", params);
  }
  /** Returns metrics relating to the layouting of the page, such as viewport bounds/scale. */
  public getLayoutMetrics() {
    return this._client.send<Page.GetLayoutMetricsReturn>("Page.getLayoutMetrics");
  }
  /** Creates an isolated world for the given frame. */
  public createIsolatedWorld(params: Page.CreateIsolatedWorldParameters) {
    return this._client.send<Page.CreateIsolatedWorldReturn>("Page.createIsolatedWorld", params);
  }
  get domContentEventFired() {
    return this._domContentEventFired;
  }
  set domContentEventFired(handler) {
    if (this._domContentEventFired) {
      this._client.removeListener("Page.domContentEventFired", this._domContentEventFired);
    }
    this._domContentEventFired = handler;
    if (handler) {
      this._client.on("Page.domContentEventFired", handler);
    }
  }
  get loadEventFired() {
    return this._loadEventFired;
  }
  set loadEventFired(handler) {
    if (this._loadEventFired) {
      this._client.removeListener("Page.loadEventFired", this._loadEventFired);
    }
    this._loadEventFired = handler;
    if (handler) {
      this._client.on("Page.loadEventFired", handler);
    }
  }
  /** Fired when frame has been attached to its parent. */
  get frameAttached() {
    return this._frameAttached;
  }
  set frameAttached(handler) {
    if (this._frameAttached) {
      this._client.removeListener("Page.frameAttached", this._frameAttached);
    }
    this._frameAttached = handler;
    if (handler) {
      this._client.on("Page.frameAttached", handler);
    }
  }
  /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
  get frameNavigated() {
    return this._frameNavigated;
  }
  set frameNavigated(handler) {
    if (this._frameNavigated) {
      this._client.removeListener("Page.frameNavigated", this._frameNavigated);
    }
    this._frameNavigated = handler;
    if (handler) {
      this._client.on("Page.frameNavigated", handler);
    }
  }
  /** Fired when frame has been detached from its parent. */
  get frameDetached() {
    return this._frameDetached;
  }
  set frameDetached(handler) {
    if (this._frameDetached) {
      this._client.removeListener("Page.frameDetached", this._frameDetached);
    }
    this._frameDetached = handler;
    if (handler) {
      this._client.on("Page.frameDetached", handler);
    }
  }
  /** Fired when frame has started loading. */
  get frameStartedLoading() {
    return this._frameStartedLoading;
  }
  set frameStartedLoading(handler) {
    if (this._frameStartedLoading) {
      this._client.removeListener("Page.frameStartedLoading", this._frameStartedLoading);
    }
    this._frameStartedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStartedLoading", handler);
    }
  }
  /** Fired when frame has stopped loading. */
  get frameStoppedLoading() {
    return this._frameStoppedLoading;
  }
  set frameStoppedLoading(handler) {
    if (this._frameStoppedLoading) {
      this._client.removeListener("Page.frameStoppedLoading", this._frameStoppedLoading);
    }
    this._frameStoppedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStoppedLoading", handler);
    }
  }
  /** Fired when frame schedules a potential navigation. */
  get frameScheduledNavigation() {
    return this._frameScheduledNavigation;
  }
  set frameScheduledNavigation(handler) {
    if (this._frameScheduledNavigation) {
      this._client.removeListener("Page.frameScheduledNavigation", this._frameScheduledNavigation);
    }
    this._frameScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameScheduledNavigation", handler);
    }
  }
  /** Fired when frame no longer has a scheduled navigation. */
  get frameClearedScheduledNavigation() {
    return this._frameClearedScheduledNavigation;
  }
  set frameClearedScheduledNavigation(handler) {
    if (this._frameClearedScheduledNavigation) {
      this._client.removeListener("Page.frameClearedScheduledNavigation", this._frameClearedScheduledNavigation);
    }
    this._frameClearedScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameClearedScheduledNavigation", handler);
    }
  }
  get frameResized() {
    return this._frameResized;
  }
  set frameResized(handler) {
    if (this._frameResized) {
      this._client.removeListener("Page.frameResized", this._frameResized);
    }
    this._frameResized = handler;
    if (handler) {
      this._client.on("Page.frameResized", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
  get javascriptDialogOpening() {
    return this._javascriptDialogOpening;
  }
  set javascriptDialogOpening(handler) {
    if (this._javascriptDialogOpening) {
      this._client.removeListener("Page.javascriptDialogOpening", this._javascriptDialogOpening);
    }
    this._javascriptDialogOpening = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogOpening", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
  get javascriptDialogClosed() {
    return this._javascriptDialogClosed;
  }
  set javascriptDialogClosed(handler) {
    if (this._javascriptDialogClosed) {
      this._client.removeListener("Page.javascriptDialogClosed", this._javascriptDialogClosed);
    }
    this._javascriptDialogClosed = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogClosed", handler);
    }
  }
  /** Compressed image data requested by the <code>startScreencast</code>. */
  get screencastFrame() {
    return this._screencastFrame;
  }
  set screencastFrame(handler) {
    if (this._screencastFrame) {
      this._client.removeListener("Page.screencastFrame", this._screencastFrame);
    }
    this._screencastFrame = handler;
    if (handler) {
      this._client.on("Page.screencastFrame", handler);
    }
  }
  /** Fired when the page with currently enabled screencast was shown or hidden </code>. */
  get screencastVisibilityChanged() {
    return this._screencastVisibilityChanged;
  }
  set screencastVisibilityChanged(handler) {
    if (this._screencastVisibilityChanged) {
      this._client.removeListener("Page.screencastVisibilityChanged", this._screencastVisibilityChanged);
    }
    this._screencastVisibilityChanged = handler;
    if (handler) {
      this._client.on("Page.screencastVisibilityChanged", handler);
    }
  }
  /** Fired when interstitial page was shown */
  get interstitialShown() {
    return this._interstitialShown;
  }
  set interstitialShown(handler) {
    if (this._interstitialShown) {
      this._client.removeListener("Page.interstitialShown", this._interstitialShown);
    }
    this._interstitialShown = handler;
    if (handler) {
      this._client.on("Page.interstitialShown", handler);
    }
  }
  /** Fired when interstitial page was hidden */
  get interstitialHidden() {
    return this._interstitialHidden;
  }
  set interstitialHidden(handler) {
    if (this._interstitialHidden) {
      this._client.removeListener("Page.interstitialHidden", this._interstitialHidden);
    }
    this._interstitialHidden = handler;
    if (handler) {
      this._client.on("Page.interstitialHidden", handler);
    }
  }
  /** Fired when a navigation is started if navigation throttles are enabled.  The navigation will be deferred until processNavigation is called. */
  get navigationRequested() {
    return this._navigationRequested;
  }
  set navigationRequested(handler) {
    if (this._navigationRequested) {
      this._client.removeListener("Page.navigationRequested", this._navigationRequested);
    }
    this._navigationRequested = handler;
    if (handler) {
      this._client.on("Page.navigationRequested", handler);
    }
  }
}
export namespace Page {
  /** Resource type as it was perceived by the rendering engine. */
  export type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" | "Font" | "Script" | "TextTrack" | "XHR" | "Fetch" | "EventSource" | "WebSocket" | "Manifest" | "Other";
  /** Unique frame identifier. */
  export type FrameId = string;
  /** Information about the Frame on the page. */
  export interface Frame {
    /** Frame unique identifier. */
    id: string;
    /** Parent frame identifier. */
    parentId?: string;
    /** Identifier of the loader associated with this frame. */
    loaderId: Network.LoaderId;
    /** Frame's name as specified in the tag. */
    name?: string;
    /** Frame document's URL. */
    url: string;
    /** Frame document's security origin. */
    securityOrigin: string;
    /** Frame document's mimeType as determined by the browser. */
    mimeType: string;
    /** If the frame failed to load, this contains the URL that could not be loaded. */
    unreachableUrl?: string;
  }
  /** Information about the Resource on the page. */
  export interface FrameResource {
    /** Resource URL. */
    url: string;
    /** Type of this resource. */
    type: ResourceType;
    /** Resource mimeType as determined by the browser. */
    mimeType: string;
    /** last-modified timestamp as reported by server. */
    lastModified?: Network.TimeSinceEpoch;
    /** Resource content size. */
    contentSize?: number;
    /** True if the resource failed to load. */
    failed?: boolean;
    /** True if the resource was canceled during loading. */
    canceled?: boolean;
  }
  /** Information about the Frame hierarchy along with their cached resources. */
  export interface FrameResourceTree {
    /** Frame information for this tree item. */
    frame: Frame;
    /** Child frames. */
    childFrames?: FrameResourceTree[];
    /** Information about frame resources. */
    resources: FrameResource[];
  }
  /** Unique script identifier. */
  export type ScriptIdentifier = string;
  /** Transition type. */
  export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword" | "keyword_generated" | "other";
  /** Navigation history entry. */
  export interface NavigationEntry {
    /** Unique id of the navigation history entry. */
    id: number;
    /** URL of the navigation history entry. */
    url: string;
    /** URL that the user typed in the url bar. */
    userTypedURL: string;
    /** Title of the navigation history entry. */
    title: string;
    /** Transition type. */
    transitionType: TransitionType;
  }
  /** Screencast frame metadata. */
  export interface ScreencastFrameMetadata {
    /** Top offset in DIP. */
    offsetTop: number;
    /** Page scale factor. */
    pageScaleFactor: number;
    /** Device screen width in DIP. */
    deviceWidth: number;
    /** Device screen height in DIP. */
    deviceHeight: number;
    /** Position of horizontal scroll in CSS pixels. */
    scrollOffsetX: number;
    /** Position of vertical scroll in CSS pixels. */
    scrollOffsetY: number;
    /** Frame swap timestamp. */
    timestamp?: Network.TimeSinceEpoch;
  }
  /** Javascript dialog type. */
  export type DialogType = "alert" | "confirm" | "prompt" | "beforeunload";
  /** Error while paring app manifest. */
  export interface AppManifestError {
    /** Error message. */
    message: string;
    /** If criticial, this is a non-recoverable parse error. */
    critical: number;
    /** Error line. */
    line: number;
    /** Error column. */
    column: number;
  }
  /** Proceed: allow the navigation; Cancel: cancel the navigation; CancelAndIgnore: cancels the navigation and makes the requester of the navigation acts like the request was never made. */
  export type NavigationResponse = "Proceed" | "Cancel" | "CancelAndIgnore";
  /** Layout viewport position and dimensions. */
  export interface LayoutViewport {
    /** Horizontal offset relative to the document (CSS pixels). */
    pageX: number;
    /** Vertical offset relative to the document (CSS pixels). */
    pageY: number;
    /** Width (CSS pixels), excludes scrollbar if present. */
    clientWidth: number;
    /** Height (CSS pixels), excludes scrollbar if present. */
    clientHeight: number;
  }
  /** Visual viewport position, dimensions, and scale. */
  export interface VisualViewport {
    /** Horizontal offset relative to the layout viewport (CSS pixels). */
    offsetX: number;
    /** Vertical offset relative to the layout viewport (CSS pixels). */
    offsetY: number;
    /** Horizontal offset relative to the document (CSS pixels). */
    pageX: number;
    /** Vertical offset relative to the document (CSS pixels). */
    pageY: number;
    /** Width (CSS pixels), excludes scrollbar if present. */
    clientWidth: number;
    /** Height (CSS pixels), excludes scrollbar if present. */
    clientHeight: number;
    /** Scale relative to the ideal viewport (size at width=device-width). */
    scale: number;
  }
  /** Viewport for capturing screenshot. */
  export interface Viewport {
    /** X offset in CSS pixels. */
    x: number;
    /** Y offset in CSS pixels */
    y: number;
    /** Rectangle width in CSS pixels */
    width: number;
    /** Rectangle height in CSS pixels */
    height: number;
    /** Page scale factor. */
    scale: number;
  }
  export type DomContentEventFiredParameters = {
    timestamp: Network.MonotonicTime;
  };
  export type DomContentEventFiredHandler = (params: DomContentEventFiredParameters) => void;
  export type LoadEventFiredParameters = {
    timestamp: Network.MonotonicTime;
  };
  export type LoadEventFiredHandler = (params: LoadEventFiredParameters) => void;
  export type FrameAttachedParameters = {
    /** Id of the frame that has been attached. */
    frameId: FrameId;
    /** Parent frame identifier. */
    parentFrameId: FrameId;
    /** JavaScript stack trace of when frame was attached, only set if frame initiated from script. */
    stack?: Runtime.StackTrace;
  };
  export type FrameAttachedHandler = (params: FrameAttachedParameters) => void;
  export type FrameNavigatedParameters = {
    /** Frame object. */
    frame: Frame;
  };
  export type FrameNavigatedHandler = (params: FrameNavigatedParameters) => void;
  export type FrameDetachedParameters = {
    /** Id of the frame that has been detached. */
    frameId: FrameId;
  };
  export type FrameDetachedHandler = (params: FrameDetachedParameters) => void;
  export type FrameStartedLoadingParameters = {
    /** Id of the frame that has started loading. */
    frameId: FrameId;
  };
  export type FrameStartedLoadingHandler = (params: FrameStartedLoadingParameters) => void;
  export type FrameStoppedLoadingParameters = {
    /** Id of the frame that has stopped loading. */
    frameId: FrameId;
  };
  export type FrameStoppedLoadingHandler = (params: FrameStoppedLoadingParameters) => void;
  export type FrameScheduledNavigationParameters = {
    /** Id of the frame that has scheduled a navigation. */
    frameId: FrameId;
    /** Delay (in seconds) until the navigation is scheduled to begin. The navigation is not guaranteed to start. */
    delay: number;
  };
  export type FrameScheduledNavigationHandler = (params: FrameScheduledNavigationParameters) => void;
  export type FrameClearedScheduledNavigationParameters = {
    /** Id of the frame that has cleared its scheduled navigation. */
    frameId: FrameId;
  };
  export type FrameClearedScheduledNavigationHandler = (params: FrameClearedScheduledNavigationParameters) => void;
  export type FrameResizedHandler = () => void;
  export type JavascriptDialogOpeningParameters = {
    /** Message that will be displayed by the dialog. */
    message: string;
    /** Dialog type. */
    type: DialogType;
  };
  export type JavascriptDialogOpeningHandler = (params: JavascriptDialogOpeningParameters) => void;
  export type JavascriptDialogClosedParameters = {
    /** Whether dialog was confirmed. */
    result: boolean;
  };
  export type JavascriptDialogClosedHandler = (params: JavascriptDialogClosedParameters) => void;
  export type ScreencastFrameParameters = {
    /** Base64-encoded compressed image. */
    data: string;
    /** Screencast frame metadata. */
    metadata: ScreencastFrameMetadata;
    /** Frame number. */
    sessionId: number;
  };
  export type ScreencastFrameHandler = (params: ScreencastFrameParameters) => void;
  export type ScreencastVisibilityChangedParameters = {
    /** True if the page is visible. */
    visible: boolean;
  };
  export type ScreencastVisibilityChangedHandler = (params: ScreencastVisibilityChangedParameters) => void;
  export type InterstitialShownHandler = () => void;
  export type InterstitialHiddenHandler = () => void;
  export type NavigationRequestedParameters = {
    /** Whether the navigation is taking place in the main frame or in a subframe. */
    isInMainFrame: boolean;
    /** Whether the navigation has encountered a server redirect or not. */
    isRedirect: boolean;
    navigationId: number;
    /** URL of requested navigation. */
    url: string;
  };
  export type NavigationRequestedHandler = (params: NavigationRequestedParameters) => void;
  export type AddScriptToEvaluateOnLoadParameters = {
    scriptSource: string;
  };
  export type AddScriptToEvaluateOnLoadReturn = {
    /** Identifier of the added script. */
    identifier: ScriptIdentifier;
  };
  export type RemoveScriptToEvaluateOnLoadParameters = {
    identifier: ScriptIdentifier;
  };
  export type AddScriptToEvaluateOnNewDocumentParameters = {
    source: string;
  };
  export type AddScriptToEvaluateOnNewDocumentReturn = {
    /** Identifier of the added script. */
    identifier: ScriptIdentifier;
  };
  export type RemoveScriptToEvaluateOnNewDocumentParameters = {
    identifier: ScriptIdentifier;
  };
  export type SetAutoAttachToCreatedPagesParameters = {
    /** If true, browser will open a new inspector window for every page created from this one. */
    autoAttach: boolean;
  };
  export type ReloadParameters = {
    /** If true, browser cache is ignored (as if the user pressed Shift+refresh). */
    ignoreCache?: boolean;
    /** If set, the script will be injected into all frames of the inspected page after reload. */
    scriptToEvaluateOnLoad?: string;
  };
  export type NavigateParameters = {
    /** URL to navigate the page to. */
    url: string;
    /** Referrer URL. */
    referrer?: string;
    /** Intended transition type. */
    transitionType?: TransitionType;
  };
  export type NavigateReturn = {
    /** Frame id that will be navigated. */
    frameId: FrameId;
  };
  export type GetNavigationHistoryReturn = {
    /** Index of the current navigation history entry. */
    currentIndex: number;
    /** Array of navigation history entries. */
    entries: NavigationEntry[];
  };
  export type NavigateToHistoryEntryParameters = {
    /** Unique id of the entry to navigate to. */
    entryId: number;
  };
  export type GetCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Network.Cookie[];
  };
  export type DeleteCookieParameters = {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  };
  export type GetResourceTreeReturn = {
    /** Present frame / resource tree structure. */
    frameTree: FrameResourceTree;
  };
  export type GetResourceContentParameters = {
    /** Frame id to get resource for. */
    frameId: FrameId;
    /** URL of the resource to get content for. */
    url: string;
  };
  export type GetResourceContentReturn = {
    /** Resource content. */
    content: string;
    /** True, if content was served as base64. */
    base64Encoded: boolean;
  };
  export type SearchInResourceParameters = {
    /** Frame id for resource to search in. */
    frameId: FrameId;
    /** URL of the resource to search in. */
    url: string;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type SearchInResourceReturn = {
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  };
  export type SetDocumentContentParameters = {
    /** Frame id to set HTML for. */
    frameId: FrameId;
    /** HTML content to set. */
    html: string;
  };
  export type SetDeviceMetricsOverrideParameters = {
    /** Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    width: number;
    /** Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    height: number;
    /** Overriding device scale factor value. 0 disables the override. */
    deviceScaleFactor: number;
    /** Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text autosizing and more. */
    mobile: boolean;
    /** Whether a view that exceeds the available browser window area should be scaled down to fit. */
    fitWindow?: boolean;
    /** Scale to apply to resulting view image. Ignored in |fitWindow| mode. */
    scale?: number;
    /** X offset to shift resulting view image by. Ignored in |fitWindow| mode. */
    offsetX?: number;
    /** Y offset to shift resulting view image by. Ignored in |fitWindow| mode. */
    offsetY?: number;
    /** Overriding screen width value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenWidth?: number;
    /** Overriding screen height value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenHeight?: number;
    /** Overriding view X position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionX?: number;
    /** Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionY?: number;
    /** Screen orientation override. */
    screenOrientation?: Emulation.ScreenOrientation;
  };
  export type SetGeolocationOverrideParameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type SetDeviceOrientationOverrideParameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
  export type SetTouchEmulationEnabledParameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type CaptureScreenshotParameters = {
    /** Image compression format (defaults to png). */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100] (jpeg only). */
    quality?: number;
    /** Capture the screenshot of a given region only. */
    clip?: Viewport;
    /** Capture the screenshot from the surface, rather than the view. Defaults to true. */
    fromSurface?: boolean;
  };
  export type CaptureScreenshotReturn = {
    /** Base64-encoded image data. */
    data: string;
  };
  export type PrintToPDFParameters = {
    /** Paper orientation. Defaults to false. */
    landscape?: boolean;
    /** Display header and footer. Defaults to false. */
    displayHeaderFooter?: boolean;
    /** Print background graphics. Defaults to false. */
    printBackground?: boolean;
    /** Scale of the webpage rendering. Defaults to 1. */
    scale?: number;
    /** Paper width in inches. Defaults to 8.5 inches. */
    paperWidth?: number;
    /** Paper height in inches. Defaults to 11 inches. */
    paperHeight?: number;
    /** Top margin in inches. Defaults to 1cm (~0.4 inches). */
    marginTop?: number;
    /** Bottom margin in inches. Defaults to 1cm (~0.4 inches). */
    marginBottom?: number;
    /** Left margin in inches. Defaults to 1cm (~0.4 inches). */
    marginLeft?: number;
    /** Right margin in inches. Defaults to 1cm (~0.4 inches). */
    marginRight?: number;
    /** Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages. */
    pageRanges?: string;
    /** Whether to silently ignore invalid but successfully parsed page ranges, such as '3-2'. Defaults to false. */
    ignoreInvalidPageRanges?: boolean;
  };
  export type PrintToPDFReturn = {
    /** Base64-encoded pdf data. */
    data: string;
  };
  export type StartScreencastParameters = {
    /** Image compression format. */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100]. */
    quality?: number;
    /** Maximum screenshot width. */
    maxWidth?: number;
    /** Maximum screenshot height. */
    maxHeight?: number;
    /** Send every n-th frame. */
    everyNthFrame?: number;
  };
  export type ScreencastFrameAckParameters = {
    /** Frame number. */
    sessionId: number;
  };
  export type HandleJavaScriptDialogParameters = {
    /** Whether to accept or dismiss the dialog. */
    accept: boolean;
    /** The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog. */
    promptText?: string;
  };
  export type GetAppManifestReturn = {
    /** Manifest location. */
    url: string;
    errors: AppManifestError[];
    /** Manifest content. */
    data?: string;
  };
  export type SetControlNavigationsParameters = {
    enabled: boolean;
  };
  export type ProcessNavigationParameters = {
    response: NavigationResponse;
    navigationId: number;
  };
  export type GetLayoutMetricsReturn = {
    /** Metrics relating to the layout viewport. */
    layoutViewport: LayoutViewport;
    /** Metrics relating to the visual viewport. */
    visualViewport: VisualViewport;
    /** Size of scrollable area. */
    contentSize: DOM.Rect;
  };
  export type CreateIsolatedWorldParameters = {
    /** Id of the frame in which the isolated world should be created. */
    frameId: FrameId;
    /** An optional name which is reported in the Execution Context. */
    worldName?: string;
    /** Whether or not universal access should be granted to the isolated world. This is a powerful option, use with caution. */
    grantUniveralAccess?: boolean;
  };
  export type CreateIsolatedWorldReturn = {
    /** Execution context of the isolated world. */
    executionContextId: Runtime.ExecutionContextId;
  };
}
/** This domain provides various functionality related to drawing atop the inspected page. */
export class Overlay {
  private _nodeHighlightRequested: Overlay.NodeHighlightRequestedHandler | null = null;
  private _inspectNodeRequested: Overlay.InspectNodeRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables domain notifications. */
  public enable() {
    return this._client.send<void>("Overlay.enable");
  }
  /** Disables domain notifications. */
  public disable() {
    return this._client.send<void>("Overlay.disable");
  }
  /** Requests that backend shows paint rectangles */
  public setShowPaintRects(params: Overlay.SetShowPaintRectsParameters) {
    return this._client.send<void>("Overlay.setShowPaintRects", params);
  }
  /** Requests that backend shows debug borders on layers */
  public setShowDebugBorders(params: Overlay.SetShowDebugBordersParameters) {
    return this._client.send<void>("Overlay.setShowDebugBorders", params);
  }
  /** Requests that backend shows the FPS counter */
  public setShowFPSCounter(params: Overlay.SetShowFPSCounterParameters) {
    return this._client.send<void>("Overlay.setShowFPSCounter", params);
  }
  /** Requests that backend shows scroll bottleneck rects */
  public setShowScrollBottleneckRects(params: Overlay.SetShowScrollBottleneckRectsParameters) {
    return this._client.send<void>("Overlay.setShowScrollBottleneckRects", params);
  }
  /** Paints viewport size upon main frame resize. */
  public setShowViewportSizeOnResize(params: Overlay.SetShowViewportSizeOnResizeParameters) {
    return this._client.send<void>("Overlay.setShowViewportSizeOnResize", params);
  }
  public setPausedInDebuggerMessage(params: Overlay.SetPausedInDebuggerMessageParameters) {
    return this._client.send<void>("Overlay.setPausedInDebuggerMessage", params);
  }
  public setSuspended(params: Overlay.SetSuspendedParameters) {
    return this._client.send<void>("Overlay.setSuspended", params);
  }
  /** Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspectNodeRequested' event upon element selection. */
  public setInspectMode(params: Overlay.SetInspectModeParameters) {
    return this._client.send<void>("Overlay.setInspectMode", params);
  }
  /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
  public highlightRect(params: Overlay.HighlightRectParameters) {
    return this._client.send<void>("Overlay.highlightRect", params);
  }
  /** Highlights given quad. Coordinates are absolute with respect to the main frame viewport. */
  public highlightQuad(params: Overlay.HighlightQuadParameters) {
    return this._client.send<void>("Overlay.highlightQuad", params);
  }
  /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified. */
  public highlightNode(params: Overlay.HighlightNodeParameters) {
    return this._client.send<void>("Overlay.highlightNode", params);
  }
  /** Highlights owner element of the frame with given id. */
  public highlightFrame(params: Overlay.HighlightFrameParameters) {
    return this._client.send<void>("Overlay.highlightFrame", params);
  }
  /** Hides any highlight. */
  public hideHighlight() {
    return this._client.send<void>("Overlay.hideHighlight");
  }
  /** For testing. */
  public getHighlightObjectForTest(params: Overlay.GetHighlightObjectForTestParameters) {
    return this._client.send<Overlay.GetHighlightObjectForTestReturn>("Overlay.getHighlightObjectForTest", params);
  }
  /** Fired when the node should be highlighted. This happens after call to <code>setInspectMode</code>. */
  get nodeHighlightRequested() {
    return this._nodeHighlightRequested;
  }
  set nodeHighlightRequested(handler) {
    if (this._nodeHighlightRequested) {
      this._client.removeListener("Overlay.nodeHighlightRequested", this._nodeHighlightRequested);
    }
    this._nodeHighlightRequested = handler;
    if (handler) {
      this._client.on("Overlay.nodeHighlightRequested", handler);
    }
  }
  /** Fired when the node should be inspected. This happens after call to <code>setInspectMode</code> or when user manually inspects an element. */
  get inspectNodeRequested() {
    return this._inspectNodeRequested;
  }
  set inspectNodeRequested(handler) {
    if (this._inspectNodeRequested) {
      this._client.removeListener("Overlay.inspectNodeRequested", this._inspectNodeRequested);
    }
    this._inspectNodeRequested = handler;
    if (handler) {
      this._client.on("Overlay.inspectNodeRequested", handler);
    }
  }
}
export namespace Overlay {
  /** Configuration data for the highlighting of page elements. */
  export interface HighlightConfig {
    /** Whether the node info tooltip should be shown (default: false). */
    showInfo?: boolean;
    /** Whether the rulers should be shown (default: false). */
    showRulers?: boolean;
    /** Whether the extension lines from node to the rulers should be shown (default: false). */
    showExtensionLines?: boolean;
    displayAsMaterial?: boolean;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: DOM.RGBA;
    /** The padding highlight fill color (default: transparent). */
    paddingColor?: DOM.RGBA;
    /** The border highlight fill color (default: transparent). */
    borderColor?: DOM.RGBA;
    /** The margin highlight fill color (default: transparent). */
    marginColor?: DOM.RGBA;
    /** The event target element highlight fill color (default: transparent). */
    eventTargetColor?: DOM.RGBA;
    /** The shape outside fill color (default: transparent). */
    shapeColor?: DOM.RGBA;
    /** The shape margin fill color (default: transparent). */
    shapeMarginColor?: DOM.RGBA;
    /** Selectors to highlight relevant nodes. */
    selectorList?: string;
  }
  export type InspectMode = "searchForNode" | "searchForUAShadowDOM" | "none";
  export type NodeHighlightRequestedParameters = {
    nodeId: DOM.NodeId;
  };
  export type NodeHighlightRequestedHandler = (params: NodeHighlightRequestedParameters) => void;
  export type InspectNodeRequestedParameters = {
    /** Id of the node to inspect. */
    backendNodeId: DOM.BackendNodeId;
  };
  export type InspectNodeRequestedHandler = (params: InspectNodeRequestedParameters) => void;
  export type SetShowPaintRectsParameters = {
    /** True for showing paint rectangles */
    result: boolean;
  };
  export type SetShowDebugBordersParameters = {
    /** True for showing debug borders */
    show: boolean;
  };
  export type SetShowFPSCounterParameters = {
    /** True for showing the FPS counter */
    show: boolean;
  };
  export type SetShowScrollBottleneckRectsParameters = {
    /** True for showing scroll bottleneck rects */
    show: boolean;
  };
  export type SetShowViewportSizeOnResizeParameters = {
    /** Whether to paint size or not. */
    show: boolean;
  };
  export type SetPausedInDebuggerMessageParameters = {
    /** The message to display, also triggers resume and step over controls. */
    message?: string;
  };
  export type SetSuspendedParameters = {
    /** Whether overlay should be suspended and not consume any resources until resumed. */
    suspended: boolean;
  };
  export type SetInspectModeParameters = {
    /** Set an inspection mode. */
    mode: InspectMode;
    /** A descriptor for the highlight appearance of hovered-over nodes. May be omitted if <code>enabled == false</code>. */
    highlightConfig?: HighlightConfig;
  };
  export type HighlightRectParameters = {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Rectangle width */
    width: number;
    /** Rectangle height */
    height: number;
    /** The highlight fill color (default: transparent). */
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
  };
  export type HighlightQuadParameters = {
    /** Quad to highlight */
    quad: DOM.Quad;
    /** The highlight fill color (default: transparent). */
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
  };
  export type HighlightNodeParameters = {
    /** A descriptor for the highlight appearance. */
    highlightConfig: HighlightConfig;
    /** Identifier of the node to highlight. */
    nodeId?: DOM.NodeId;
    /** Identifier of the backend node to highlight. */
    backendNodeId?: DOM.BackendNodeId;
    /** JavaScript object id of the node to be highlighted. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type HighlightFrameParameters = {
    /** Identifier of the frame to highlight. */
    frameId: Page.FrameId;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: DOM.RGBA;
    /** The content box highlight outline color (default: transparent). */
    contentOutlineColor?: DOM.RGBA;
  };
  export type GetHighlightObjectForTestParameters = {
    /** Id of the node to get highlight object for. */
    nodeId: DOM.NodeId;
  };
  export type GetHighlightObjectForTestReturn = {
    /** Highlight data for the node. */
    highlight: any;
  };
}
/** This domain emulates different environments for the page. */
export class Emulation {
  private _virtualTimeBudgetExpired: Emulation.VirtualTimeBudgetExpiredHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  public setDeviceMetricsOverride(params: Emulation.SetDeviceMetricsOverrideParameters) {
    return this._client.send<void>("Emulation.setDeviceMetricsOverride", params);
  }
  /** Clears the overriden device metrics. */
  public clearDeviceMetricsOverride() {
    return this._client.send<void>("Emulation.clearDeviceMetricsOverride");
  }
  /** Requests that page scale factor is reset to initial values. */
  public resetPageScaleFactor() {
    return this._client.send<void>("Emulation.resetPageScaleFactor");
  }
  /** Sets a specified page scale factor. */
  public setPageScaleFactor(params: Emulation.SetPageScaleFactorParameters) {
    return this._client.send<void>("Emulation.setPageScaleFactor", params);
  }
  /** Deprecated, does nothing. Please use setDeviceMetricsOverride instead. */
  public setVisibleSize(params: Emulation.SetVisibleSizeParameters) {
    return this._client.send<void>("Emulation.setVisibleSize", params);
  }
  /** Switches script execution in the page. */
  public setScriptExecutionDisabled(params: Emulation.SetScriptExecutionDisabledParameters) {
    return this._client.send<void>("Emulation.setScriptExecutionDisabled", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  public setGeolocationOverride(params: Emulation.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Emulation.setGeolocationOverride", params);
  }
  /** Clears the overriden Geolocation Position and Error. */
  public clearGeolocationOverride() {
    return this._client.send<void>("Emulation.clearGeolocationOverride");
  }
  /** Toggles mouse event-based touch event emulation. */
  public setTouchEmulationEnabled(params: Emulation.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Emulation.setTouchEmulationEnabled", params);
  }
  /** Emulates the given media for CSS media queries. */
  public setEmulatedMedia(params: Emulation.SetEmulatedMediaParameters) {
    return this._client.send<void>("Emulation.setEmulatedMedia", params);
  }
  /** Enables CPU throttling to emulate slow CPUs. */
  public setCPUThrottlingRate(params: Emulation.SetCPUThrottlingRateParameters) {
    return this._client.send<void>("Emulation.setCPUThrottlingRate", params);
  }
  /** Tells whether emulation is supported. */
  public canEmulate() {
    return this._client.send<Emulation.CanEmulateReturn>("Emulation.canEmulate");
  }
  /** Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets the current virtual time policy.  Note this supersedes any previous time budget. */
  public setVirtualTimePolicy(params: Emulation.SetVirtualTimePolicyParameters) {
    return this._client.send<void>("Emulation.setVirtualTimePolicy", params);
  }
  /** Sets or clears an override of the default background color of the frame. This override is used if the content does not specify one. */
  public setDefaultBackgroundColorOverride(params: Emulation.SetDefaultBackgroundColorOverrideParameters) {
    return this._client.send<void>("Emulation.setDefaultBackgroundColorOverride", params);
  }
  /** Notification sent after the virual time budget for the current VirtualTimePolicy has run out. */
  get virtualTimeBudgetExpired() {
    return this._virtualTimeBudgetExpired;
  }
  set virtualTimeBudgetExpired(handler) {
    if (this._virtualTimeBudgetExpired) {
      this._client.removeListener("Emulation.virtualTimeBudgetExpired", this._virtualTimeBudgetExpired);
    }
    this._virtualTimeBudgetExpired = handler;
    if (handler) {
      this._client.on("Emulation.virtualTimeBudgetExpired", handler);
    }
  }
}
export namespace Emulation {
  /** Screen orientation. */
  export interface ScreenOrientation {
    /** Orientation type. */
    type: "portraitPrimary" | "portraitSecondary" | "landscapePrimary" | "landscapeSecondary";
    /** Orientation angle. */
    angle: number;
  }
  /** advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to allow the next delayed task (if any) to run; pause: The virtual time base may not advance; pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending resource fetches. */
  export type VirtualTimePolicy = "advance" | "pause" | "pauseIfNetworkFetchesPending";
  export type VirtualTimeBudgetExpiredHandler = () => void;
  export type SetDeviceMetricsOverrideParameters = {
    /** Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    width: number;
    /** Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    height: number;
    /** Overriding device scale factor value. 0 disables the override. */
    deviceScaleFactor: number;
    /** Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text autosizing and more. */
    mobile: boolean;
    /** Whether a view that exceeds the available browser window area should be scaled down to fit. */
    fitWindow?: boolean;
    /** Scale to apply to resulting view image. Ignored in |fitWindow| mode. */
    scale?: number;
    /** Not used. */
    offsetX?: number;
    /** Not used. */
    offsetY?: number;
    /** Overriding screen width value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenWidth?: number;
    /** Overriding screen height value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenHeight?: number;
    /** Overriding view X position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionX?: number;
    /** Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionY?: number;
    /** Screen orientation override. */
    screenOrientation?: ScreenOrientation;
  };
  export type SetPageScaleFactorParameters = {
    /** Page scale factor. */
    pageScaleFactor: number;
  };
  export type SetVisibleSizeParameters = {
    /** Frame width (DIP). */
    width: number;
    /** Frame height (DIP). */
    height: number;
  };
  export type SetScriptExecutionDisabledParameters = {
    /** Whether script execution should be disabled in the page. */
    value: boolean;
  };
  export type SetGeolocationOverrideParameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type SetTouchEmulationEnabledParameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type SetEmulatedMediaParameters = {
    /** Media type to emulate. Empty string disables the override. */
    media: string;
  };
  export type SetCPUThrottlingRateParameters = {
    /** Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc). */
    rate: number;
  };
  export type CanEmulateReturn = {
    /** True if emulation is supported. */
    result: boolean;
  };
  export type SetVirtualTimePolicyParameters = {
    policy: VirtualTimePolicy;
    /** If set, after this many virtual milliseconds have elapsed virtual time will be paused and a virtualTimeBudgetExpired event is sent. */
    budget?: number;
  };
  export type SetDefaultBackgroundColorOverrideParameters = {
    /** RGBA of the default background color. If not specified, any existing override will be cleared. */
    color?: DOM.RGBA;
  };
}
/** Security */
export class Security {
  private _securityStateChanged: Security.SecurityStateChangedHandler | null = null;
  private _certificateError: Security.CertificateErrorHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables tracking security state changes. */
  public enable() {
    return this._client.send<void>("Security.enable");
  }
  /** Disables tracking security state changes. */
  public disable() {
    return this._client.send<void>("Security.disable");
  }
  /** Displays native dialog with the certificate details. */
  public showCertificateViewer() {
    return this._client.send<void>("Security.showCertificateViewer");
  }
  /** Handles a certificate error that fired a certificateError event. */
  public handleCertificateError(params: Security.HandleCertificateErrorParameters) {
    return this._client.send<void>("Security.handleCertificateError", params);
  }
  /** Enable/disable overriding certificate errors. If enabled, all certificate error events need to be handled by the DevTools client and should be answered with handleCertificateError commands. */
  public setOverrideCertificateErrors(params: Security.SetOverrideCertificateErrorsParameters) {
    return this._client.send<void>("Security.setOverrideCertificateErrors", params);
  }
  /** The security state of the page changed. */
  get securityStateChanged() {
    return this._securityStateChanged;
  }
  set securityStateChanged(handler) {
    if (this._securityStateChanged) {
      this._client.removeListener("Security.securityStateChanged", this._securityStateChanged);
    }
    this._securityStateChanged = handler;
    if (handler) {
      this._client.on("Security.securityStateChanged", handler);
    }
  }
  /** There is a certificate error. If overriding certificate errors is enabled, then it should be handled with the handleCertificateError command. Note: this event does not fire if the certificate error has been allowed internally. */
  get certificateError() {
    return this._certificateError;
  }
  set certificateError(handler) {
    if (this._certificateError) {
      this._client.removeListener("Security.certificateError", this._certificateError);
    }
    this._certificateError = handler;
    if (handler) {
      this._client.on("Security.certificateError", handler);
    }
  }
}
export namespace Security {
  /** An internal certificate ID value. */
  export type CertificateId = number;
  /** A description of mixed content (HTTP resources on HTTPS pages), as defined by https://www.w3.org/TR/mixed-content/#categories */
  export type MixedContentType = "blockable" | "optionally-blockable" | "none";
  /** The security level of a page or resource. */
  export type SecurityState = "unknown" | "neutral" | "insecure" | "warning" | "secure" | "info";
  /** An explanation of an factor contributing to the security state. */
  export interface SecurityStateExplanation {
    /** Security state representing the severity of the factor being explained. */
    securityState: SecurityState;
    /** Short phrase describing the type of factor. */
    summary: string;
    /** Full text explanation of the factor. */
    description: string;
    /** True if the page has a certificate. */
    hasCertificate: boolean;
    /** The type of mixed content described by the explanation. */
    mixedContentType: MixedContentType;
  }
  /** Information about insecure content on the page. */
  export interface InsecureContentStatus {
    /** True if the page was loaded over HTTPS and ran mixed (HTTP) content such as scripts. */
    ranMixedContent: boolean;
    /** True if the page was loaded over HTTPS and displayed mixed (HTTP) content such as images. */
    displayedMixedContent: boolean;
    /** True if the page was loaded over HTTPS and contained a form targeting an insecure url. */
    containedMixedForm: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and ran content such as scripts that were loaded with certificate errors. */
    ranContentWithCertErrors: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and displayed content such as images that were loaded with certificate errors. */
    displayedContentWithCertErrors: boolean;
    /** Security state representing a page that ran insecure content. */
    ranInsecureContentStyle: SecurityState;
    /** Security state representing a page that displayed insecure content. */
    displayedInsecureContentStyle: SecurityState;
  }
  /** The action to take when a certificate error occurs. continue will continue processing the request and cancel will cancel the request. */
  export type CertificateErrorAction = "continue" | "cancel";
  export type SecurityStateChangedParameters = {
    /** Security state. */
    securityState: SecurityState;
    /** True if the page was loaded over cryptographic transport such as HTTPS. */
    schemeIsCryptographic: boolean;
    /** List of explanations for the security state. If the overall security state is `insecure` or `warning`, at least one corresponding explanation should be included. */
    explanations: SecurityStateExplanation[];
    /** Information about insecure content on the page. */
    insecureContentStatus: InsecureContentStatus;
    /** Overrides user-visible description of the state. */
    summary?: string;
  };
  export type SecurityStateChangedHandler = (params: SecurityStateChangedParameters) => void;
  export type CertificateErrorParameters = {
    /** The ID of the event. */
    eventId: number;
    /** The type of the error. */
    errorType: string;
    /** The url that was requested. */
    requestURL: string;
  };
  export type CertificateErrorHandler = (params: CertificateErrorParameters) => void;
  export type HandleCertificateErrorParameters = {
    /** The ID of the event. */
    eventId: number;
    /** The action to take on the certificate error. */
    action: CertificateErrorAction;
  };
  export type SetOverrideCertificateErrorsParameters = {
    /** If true, certificate errors will be overridden. */
    override: boolean;
  };
}
/** Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc. */
export class Network {
  private _resourceChangedPriority: Network.ResourceChangedPriorityHandler | null = null;
  private _requestWillBeSent: Network.RequestWillBeSentHandler | null = null;
  private _requestServedFromCache: Network.RequestServedFromCacheHandler | null = null;
  private _responseReceived: Network.ResponseReceivedHandler | null = null;
  private _dataReceived: Network.DataReceivedHandler | null = null;
  private _loadingFinished: Network.LoadingFinishedHandler | null = null;
  private _loadingFailed: Network.LoadingFailedHandler | null = null;
  private _webSocketWillSendHandshakeRequest: Network.WebSocketWillSendHandshakeRequestHandler | null = null;
  private _webSocketHandshakeResponseReceived: Network.WebSocketHandshakeResponseReceivedHandler | null = null;
  private _webSocketCreated: Network.WebSocketCreatedHandler | null = null;
  private _webSocketClosed: Network.WebSocketClosedHandler | null = null;
  private _webSocketFrameReceived: Network.WebSocketFrameReceivedHandler | null = null;
  private _webSocketFrameError: Network.WebSocketFrameErrorHandler | null = null;
  private _webSocketFrameSent: Network.WebSocketFrameSentHandler | null = null;
  private _eventSourceMessageReceived: Network.EventSourceMessageReceivedHandler | null = null;
  private _requestIntercepted: Network.RequestInterceptedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables network tracking, network events will now be delivered to the client. */
  public enable(params: Network.EnableParameters) {
    return this._client.send<void>("Network.enable", params);
  }
  /** Disables network tracking, prevents network events from being sent to the client. */
  public disable() {
    return this._client.send<void>("Network.disable");
  }
  /** Allows overriding user agent with the given string. */
  public setUserAgentOverride(params: Network.SetUserAgentOverrideParameters) {
    return this._client.send<void>("Network.setUserAgentOverride", params);
  }
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  public setExtraHTTPHeaders(params: Network.SetExtraHTTPHeadersParameters) {
    return this._client.send<void>("Network.setExtraHTTPHeaders", params);
  }
  /** Returns content served for the given request. */
  public getResponseBody(params: Network.GetResponseBodyParameters) {
    return this._client.send<Network.GetResponseBodyReturn>("Network.getResponseBody", params);
  }
  /** Blocks URLs from loading. */
  public setBlockedURLs(params: Network.SetBlockedURLsParameters) {
    return this._client.send<void>("Network.setBlockedURLs", params);
  }
  /** This method sends a new XMLHttpRequest which is identical to the original one. The following parameters should be identical: method, url, async, request body, extra headers, withCredentials attribute, user, password. */
  public replayXHR(params: Network.ReplayXHRParameters) {
    return this._client.send<void>("Network.replayXHR", params);
  }
  /** Tells whether clearing browser cache is supported. */
  public canClearBrowserCache() {
    return this._client.send<Network.CanClearBrowserCacheReturn>("Network.canClearBrowserCache");
  }
  /** Clears browser cache. */
  public clearBrowserCache() {
    return this._client.send<void>("Network.clearBrowserCache");
  }
  /** Tells whether clearing browser cookies is supported. */
  public canClearBrowserCookies() {
    return this._client.send<Network.CanClearBrowserCookiesReturn>("Network.canClearBrowserCookies");
  }
  /** Clears browser cookies. */
  public clearBrowserCookies() {
    return this._client.send<void>("Network.clearBrowserCookies");
  }
  /** Returns all browser cookies for the current URL. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  public getCookies(params: Network.GetCookiesParameters) {
    return this._client.send<Network.GetCookiesReturn>("Network.getCookies", params);
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  public getAllCookies() {
    return this._client.send<Network.GetAllCookiesReturn>("Network.getAllCookies");
  }
  /** Deletes browser cookie with given name, domain and path. */
  public deleteCookie(params: Network.DeleteCookieParameters) {
    return this._client.send<void>("Network.deleteCookie", params);
  }
  /** Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist. */
  public setCookie(params: Network.SetCookieParameters) {
    return this._client.send<Network.SetCookieReturn>("Network.setCookie", params);
  }
  /** Tells whether emulation of network conditions is supported. */
  public canEmulateNetworkConditions() {
    return this._client.send<Network.CanEmulateNetworkConditionsReturn>("Network.canEmulateNetworkConditions");
  }
  /** Activates emulation of network conditions. */
  public emulateNetworkConditions(params: Network.EmulateNetworkConditionsParameters) {
    return this._client.send<void>("Network.emulateNetworkConditions", params);
  }
  /** Toggles ignoring cache for each request. If <code>true</code>, cache will not be used. */
  public setCacheDisabled(params: Network.SetCacheDisabledParameters) {
    return this._client.send<void>("Network.setCacheDisabled", params);
  }
  /** Toggles ignoring of service worker for each request. */
  public setBypassServiceWorker(params: Network.SetBypassServiceWorkerParameters) {
    return this._client.send<void>("Network.setBypassServiceWorker", params);
  }
  /** For testing. */
  public setDataSizeLimitsForTest(params: Network.SetDataSizeLimitsForTestParameters) {
    return this._client.send<void>("Network.setDataSizeLimitsForTest", params);
  }
  /** Returns the DER-encoded certificate. */
  public getCertificate(params: Network.GetCertificateParameters) {
    return this._client.send<Network.GetCertificateReturn>("Network.getCertificate", params);
  }
  public setRequestInterceptionEnabled(params: Network.SetRequestInterceptionEnabledParameters) {
    return this._client.send<void>("Network.setRequestInterceptionEnabled", params);
  }
  /** Response to Network.requestIntercepted which either modifies the request to continue with any modifications, or blocks it, or completes it with the provided response bytes. If a network fetch occurs as a result which encounters a redirect an additional Network.requestIntercepted event will be sent with the same InterceptionId. */
  public continueInterceptedRequest(params: Network.ContinueInterceptedRequestParameters) {
    return this._client.send<void>("Network.continueInterceptedRequest", params);
  }
  /** Fired when resource loading priority is changed */
  get resourceChangedPriority() {
    return this._resourceChangedPriority;
  }
  set resourceChangedPriority(handler) {
    if (this._resourceChangedPriority) {
      this._client.removeListener("Network.resourceChangedPriority", this._resourceChangedPriority);
    }
    this._resourceChangedPriority = handler;
    if (handler) {
      this._client.on("Network.resourceChangedPriority", handler);
    }
  }
  /** Fired when page is about to send HTTP request. */
  get requestWillBeSent() {
    return this._requestWillBeSent;
  }
  set requestWillBeSent(handler) {
    if (this._requestWillBeSent) {
      this._client.removeListener("Network.requestWillBeSent", this._requestWillBeSent);
    }
    this._requestWillBeSent = handler;
    if (handler) {
      this._client.on("Network.requestWillBeSent", handler);
    }
  }
  /** Fired if request ended up loading from cache. */
  get requestServedFromCache() {
    return this._requestServedFromCache;
  }
  set requestServedFromCache(handler) {
    if (this._requestServedFromCache) {
      this._client.removeListener("Network.requestServedFromCache", this._requestServedFromCache);
    }
    this._requestServedFromCache = handler;
    if (handler) {
      this._client.on("Network.requestServedFromCache", handler);
    }
  }
  /** Fired when HTTP response is available. */
  get responseReceived() {
    return this._responseReceived;
  }
  set responseReceived(handler) {
    if (this._responseReceived) {
      this._client.removeListener("Network.responseReceived", this._responseReceived);
    }
    this._responseReceived = handler;
    if (handler) {
      this._client.on("Network.responseReceived", handler);
    }
  }
  /** Fired when data chunk was received over the network. */
  get dataReceived() {
    return this._dataReceived;
  }
  set dataReceived(handler) {
    if (this._dataReceived) {
      this._client.removeListener("Network.dataReceived", this._dataReceived);
    }
    this._dataReceived = handler;
    if (handler) {
      this._client.on("Network.dataReceived", handler);
    }
  }
  /** Fired when HTTP request has finished loading. */
  get loadingFinished() {
    return this._loadingFinished;
  }
  set loadingFinished(handler) {
    if (this._loadingFinished) {
      this._client.removeListener("Network.loadingFinished", this._loadingFinished);
    }
    this._loadingFinished = handler;
    if (handler) {
      this._client.on("Network.loadingFinished", handler);
    }
  }
  /** Fired when HTTP request has failed to load. */
  get loadingFailed() {
    return this._loadingFailed;
  }
  set loadingFailed(handler) {
    if (this._loadingFailed) {
      this._client.removeListener("Network.loadingFailed", this._loadingFailed);
    }
    this._loadingFailed = handler;
    if (handler) {
      this._client.on("Network.loadingFailed", handler);
    }
  }
  /** Fired when WebSocket is about to initiate handshake. */
  get webSocketWillSendHandshakeRequest() {
    return this._webSocketWillSendHandshakeRequest;
  }
  set webSocketWillSendHandshakeRequest(handler) {
    if (this._webSocketWillSendHandshakeRequest) {
      this._client.removeListener("Network.webSocketWillSendHandshakeRequest", this._webSocketWillSendHandshakeRequest);
    }
    this._webSocketWillSendHandshakeRequest = handler;
    if (handler) {
      this._client.on("Network.webSocketWillSendHandshakeRequest", handler);
    }
  }
  /** Fired when WebSocket handshake response becomes available. */
  get webSocketHandshakeResponseReceived() {
    return this._webSocketHandshakeResponseReceived;
  }
  set webSocketHandshakeResponseReceived(handler) {
    if (this._webSocketHandshakeResponseReceived) {
      this._client.removeListener("Network.webSocketHandshakeResponseReceived", this._webSocketHandshakeResponseReceived);
    }
    this._webSocketHandshakeResponseReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketHandshakeResponseReceived", handler);
    }
  }
  /** Fired upon WebSocket creation. */
  get webSocketCreated() {
    return this._webSocketCreated;
  }
  set webSocketCreated(handler) {
    if (this._webSocketCreated) {
      this._client.removeListener("Network.webSocketCreated", this._webSocketCreated);
    }
    this._webSocketCreated = handler;
    if (handler) {
      this._client.on("Network.webSocketCreated", handler);
    }
  }
  /** Fired when WebSocket is closed. */
  get webSocketClosed() {
    return this._webSocketClosed;
  }
  set webSocketClosed(handler) {
    if (this._webSocketClosed) {
      this._client.removeListener("Network.webSocketClosed", this._webSocketClosed);
    }
    this._webSocketClosed = handler;
    if (handler) {
      this._client.on("Network.webSocketClosed", handler);
    }
  }
  /** Fired when WebSocket frame is received. */
  get webSocketFrameReceived() {
    return this._webSocketFrameReceived;
  }
  set webSocketFrameReceived(handler) {
    if (this._webSocketFrameReceived) {
      this._client.removeListener("Network.webSocketFrameReceived", this._webSocketFrameReceived);
    }
    this._webSocketFrameReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameReceived", handler);
    }
  }
  /** Fired when WebSocket frame error occurs. */
  get webSocketFrameError() {
    return this._webSocketFrameError;
  }
  set webSocketFrameError(handler) {
    if (this._webSocketFrameError) {
      this._client.removeListener("Network.webSocketFrameError", this._webSocketFrameError);
    }
    this._webSocketFrameError = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameError", handler);
    }
  }
  /** Fired when WebSocket frame is sent. */
  get webSocketFrameSent() {
    return this._webSocketFrameSent;
  }
  set webSocketFrameSent(handler) {
    if (this._webSocketFrameSent) {
      this._client.removeListener("Network.webSocketFrameSent", this._webSocketFrameSent);
    }
    this._webSocketFrameSent = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameSent", handler);
    }
  }
  /** Fired when EventSource message is received. */
  get eventSourceMessageReceived() {
    return this._eventSourceMessageReceived;
  }
  set eventSourceMessageReceived(handler) {
    if (this._eventSourceMessageReceived) {
      this._client.removeListener("Network.eventSourceMessageReceived", this._eventSourceMessageReceived);
    }
    this._eventSourceMessageReceived = handler;
    if (handler) {
      this._client.on("Network.eventSourceMessageReceived", handler);
    }
  }
  /** Details of an intercepted HTTP request, which must be either allowed, blocked, modified or mocked. */
  get requestIntercepted() {
    return this._requestIntercepted;
  }
  set requestIntercepted(handler) {
    if (this._requestIntercepted) {
      this._client.removeListener("Network.requestIntercepted", this._requestIntercepted);
    }
    this._requestIntercepted = handler;
    if (handler) {
      this._client.on("Network.requestIntercepted", handler);
    }
  }
}
export namespace Network {
  /** Unique loader identifier. */
  export type LoaderId = string;
  /** Unique request identifier. */
  export type RequestId = string;
  /** Unique intercepted request identifier. */
  export type InterceptionId = string;
  /** Network level fetch failure reason. */
  export type ErrorReason = "Failed" | "Aborted" | "TimedOut" | "AccessDenied" | "ConnectionClosed" | "ConnectionReset" | "ConnectionRefused" | "ConnectionAborted" | "ConnectionFailed" | "NameNotResolved" | "InternetDisconnected" | "AddressUnreachable";
  /** UTC time in seconds, counted from January 1, 1970. */
  export type TimeSinceEpoch = number;
  /** Monotonically increasing time in seconds since an arbitrary point in the past. */
  export type MonotonicTime = number;
  /** Request / response headers as keys / values of JSON object. */
  export type Headers = any;
  /** Loading priority of a resource request. */
  export type ConnectionType = "none" | "cellular2g" | "cellular3g" | "cellular4g" | "bluetooth" | "ethernet" | "wifi" | "wimax" | "other";
  /** Represents the cookie's 'SameSite' status: https://tools.ietf.org/html/draft-west-first-party-cookies */
  export type CookieSameSite = "Strict" | "Lax";
  /** Timing information for the request. */
  export interface ResourceTiming {
    /** Timing's requestTime is a baseline in seconds, while the other numbers are ticks in milliseconds relatively to this requestTime. */
    requestTime: number;
    /** Started resolving proxy. */
    proxyStart: number;
    /** Finished resolving proxy. */
    proxyEnd: number;
    /** Started DNS address resolve. */
    dnsStart: number;
    /** Finished DNS address resolve. */
    dnsEnd: number;
    /** Started connecting to the remote host. */
    connectStart: number;
    /** Connected to the remote host. */
    connectEnd: number;
    /** Started SSL handshake. */
    sslStart: number;
    /** Finished SSL handshake. */
    sslEnd: number;
    /** Started running ServiceWorker. */
    workerStart: number;
    /** Finished Starting ServiceWorker. */
    workerReady: number;
    /** Started sending request. */
    sendStart: number;
    /** Finished sending request. */
    sendEnd: number;
    /** Time the server started pushing request. */
    pushStart: number;
    /** Time the server finished pushing request. */
    pushEnd: number;
    /** Finished receiving response headers. */
    receiveHeadersEnd: number;
  }
  /** Loading priority of a resource request. */
  export type ResourcePriority = "VeryLow" | "Low" | "Medium" | "High" | "VeryHigh";
  /** HTTP request data. */
  export interface Request {
    /** Request URL. */
    url: string;
    /** HTTP request method. */
    method: string;
    /** HTTP request headers. */
    headers: Headers;
    /** HTTP POST request data. */
    postData?: string;
    /** The mixed content type of the request. */
    mixedContentType?: Security.MixedContentType;
    /** Priority of the resource request at the time request is sent. */
    initialPriority: ResourcePriority;
    /** The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/ */
    referrerPolicy: "unsafe-url" | "no-referrer-when-downgrade" | "no-referrer" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin";
    /** Whether is loaded via link preload. */
    isLinkPreload?: boolean;
  }
  /** Details of a signed certificate timestamp (SCT). */
  export interface SignedCertificateTimestamp {
    /** Validation status. */
    status: string;
    /** Origin. */
    origin: string;
    /** Log name / description. */
    logDescription: string;
    /** Log ID. */
    logId: string;
    /** Issuance date. */
    timestamp: TimeSinceEpoch;
    /** Hash algorithm. */
    hashAlgorithm: string;
    /** Signature algorithm. */
    signatureAlgorithm: string;
    /** Signature data. */
    signatureData: string;
  }
  /** Security details about a request. */
  export interface SecurityDetails {
    /** Protocol name (e.g. "TLS 1.2" or "QUIC"). */
    protocol: string;
    /** Key Exchange used by the connection, or the empty string if not applicable. */
    keyExchange: string;
    /** (EC)DH group used by the connection, if applicable. */
    keyExchangeGroup?: string;
    /** Cipher name. */
    cipher: string;
    /** TLS MAC. Note that AEAD ciphers do not have separate MACs. */
    mac?: string;
    /** Certificate ID value. */
    certificateId: Security.CertificateId;
    /** Certificate subject name. */
    subjectName: string;
    /** Subject Alternative Name (SAN) DNS names and IP addresses. */
    sanList: string[];
    /** Name of the issuing CA. */
    issuer: string;
    /** Certificate valid from date. */
    validFrom: TimeSinceEpoch;
    /** Certificate valid to (expiration) date */
    validTo: TimeSinceEpoch;
    /** List of signed certificate timestamps (SCTs). */
    signedCertificateTimestampList: SignedCertificateTimestamp[];
  }
  /** The reason why request was blocked. */
  export type BlockedReason = "csp" | "mixed-content" | "origin" | "inspector" | "subresource-filter" | "other";
  /** HTTP response data. */
  export interface Response {
    /** Response URL. This URL can be different from CachedResource.url in case of redirect. */
    url: string;
    /** HTTP response status code. */
    status: number;
    /** HTTP response status text. */
    statusText: string;
    /** HTTP response headers. */
    headers: Headers;
    /** HTTP response headers text. */
    headersText?: string;
    /** Resource mimeType as determined by the browser. */
    mimeType: string;
    /** Refined HTTP request headers that were actually transmitted over the network. */
    requestHeaders?: Headers;
    /** HTTP request headers text. */
    requestHeadersText?: string;
    /** Specifies whether physical connection was actually reused for this request. */
    connectionReused: boolean;
    /** Physical connection id that was actually used for this request. */
    connectionId: number;
    /** Remote IP address. */
    remoteIPAddress?: string;
    /** Remote port. */
    remotePort?: number;
    /** Specifies that the request was served from the disk cache. */
    fromDiskCache?: boolean;
    /** Specifies that the request was served from the ServiceWorker. */
    fromServiceWorker?: boolean;
    /** Total number of bytes received for this request so far. */
    encodedDataLength: number;
    /** Timing information for the given request. */
    timing?: ResourceTiming;
    /** Protocol used to fetch this request. */
    protocol?: string;
    /** Security state of the request resource. */
    securityState: Security.SecurityState;
    /** Security details for the request. */
    securityDetails?: SecurityDetails;
  }
  /** WebSocket request data. */
  export interface WebSocketRequest {
    /** HTTP request headers. */
    headers: Headers;
  }
  /** WebSocket response data. */
  export interface WebSocketResponse {
    /** HTTP response status code. */
    status: number;
    /** HTTP response status text. */
    statusText: string;
    /** HTTP response headers. */
    headers: Headers;
    /** HTTP response headers text. */
    headersText?: string;
    /** HTTP request headers. */
    requestHeaders?: Headers;
    /** HTTP request headers text. */
    requestHeadersText?: string;
  }
  /** WebSocket frame data. */
  export interface WebSocketFrame {
    /** WebSocket frame opcode. */
    opcode: number;
    /** WebSocke frame mask. */
    mask: boolean;
    /** WebSocke frame payload data. */
    payloadData: string;
  }
  /** Information about the cached resource. */
  export interface CachedResource {
    /** Resource URL. This is the url of the original network request. */
    url: string;
    /** Type of this resource. */
    type: Page.ResourceType;
    /** Cached response data. */
    response?: Response;
    /** Cached response body size. */
    bodySize: number;
  }
  /** Information about the request initiator. */
  export interface Initiator {
    /** Type of this initiator. */
    type: "parser" | "script" | "preload" | "other";
    /** Initiator JavaScript stack trace, set for Script only. */
    stack?: Runtime.StackTrace;
    /** Initiator URL, set for Parser type or for Script type (when script is importing module). */
    url?: string;
    /** Initiator line number, set for Parser type or for Script type (when script is importing module) (0-based). */
    lineNumber?: number;
  }
  /** Cookie object */
  export interface Cookie {
    /** Cookie name. */
    name: string;
    /** Cookie value. */
    value: string;
    /** Cookie domain. */
    domain: string;
    /** Cookie path. */
    path: string;
    /** Cookie expiration date as the number of seconds since the UNIX epoch. */
    expires: number;
    /** Cookie size. */
    size: number;
    /** True if cookie is http-only. */
    httpOnly: boolean;
    /** True if cookie is secure. */
    secure: boolean;
    /** True in case of session cookie. */
    session: boolean;
    /** Cookie SameSite type. */
    sameSite?: CookieSameSite;
  }
  /** Authorization challenge for HTTP status code 401 or 407. */
  export interface AuthChallenge {
    /** Source of the authentication challenge. */
    source?: "Server" | "Proxy";
    /** Origin of the challenger. */
    origin: string;
    /** The authentication scheme used, such as basic or digest */
    scheme: string;
    /** The realm of the challenge. May be empty. */
    realm: string;
  }
  /** Response to an AuthChallenge. */
  export interface AuthChallengeResponse {
    /** The decision on what to do in response to the authorization challenge.  Default means deferring to the default behavior of the net stack, which will likely either the Cancel authentication or display a popup dialog box. */
    response: "Default" | "CancelAuth" | "ProvideCredentials";
    /** The username to provide, possibly empty. Should only be set if response is ProvideCredentials. */
    username?: string;
    /** The password to provide, possibly empty. Should only be set if response is ProvideCredentials. */
    password?: string;
  }
  export type ResourceChangedPriorityParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** New priority */
    newPriority: ResourcePriority;
    /** Timestamp. */
    timestamp: MonotonicTime;
  };
  export type ResourceChangedPriorityHandler = (params: ResourceChangedPriorityParameters) => void;
  export type RequestWillBeSentParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Loader identifier. Empty string if the request is fetched form worker. */
    loaderId: LoaderId;
    /** URL of the document this request is loaded for. */
    documentURL: string;
    /** Request data. */
    request: Request;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Timestamp. */
    wallTime: TimeSinceEpoch;
    /** Request initiator. */
    initiator: Initiator;
    /** Redirect response data. */
    redirectResponse?: Response;
    /** Type of this resource. */
    type?: Page.ResourceType;
    /** Frame identifier. */
    frameId?: Page.FrameId;
  };
  export type RequestWillBeSentHandler = (params: RequestWillBeSentParameters) => void;
  export type RequestServedFromCacheParameters = {
    /** Request identifier. */
    requestId: RequestId;
  };
  export type RequestServedFromCacheHandler = (params: RequestServedFromCacheParameters) => void;
  export type ResponseReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Loader identifier. Empty string if the request is fetched form worker. */
    loaderId: LoaderId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Resource type. */
    type: Page.ResourceType;
    /** Response data. */
    response: Response;
    /** Frame identifier. */
    frameId?: Page.FrameId;
  };
  export type ResponseReceivedHandler = (params: ResponseReceivedParameters) => void;
  export type DataReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Data chunk length. */
    dataLength: number;
    /** Actual bytes received (might be less than dataLength for compressed encodings). */
    encodedDataLength: number;
  };
  export type DataReceivedHandler = (params: DataReceivedParameters) => void;
  export type LoadingFinishedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Total number of bytes received for this request. */
    encodedDataLength: number;
  };
  export type LoadingFinishedHandler = (params: LoadingFinishedParameters) => void;
  export type LoadingFailedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Resource type. */
    type: Page.ResourceType;
    /** User friendly error message. */
    errorText: string;
    /** True if loading was canceled. */
    canceled?: boolean;
    /** The reason why loading was blocked, if any. */
    blockedReason?: BlockedReason;
  };
  export type LoadingFailedHandler = (params: LoadingFailedParameters) => void;
  export type WebSocketWillSendHandshakeRequestParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** UTC Timestamp. */
    wallTime: TimeSinceEpoch;
    /** WebSocket request data. */
    request: WebSocketRequest;
  };
  export type WebSocketWillSendHandshakeRequestHandler = (params: WebSocketWillSendHandshakeRequestParameters) => void;
  export type WebSocketHandshakeResponseReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketResponse;
  };
  export type WebSocketHandshakeResponseReceivedHandler = (params: WebSocketHandshakeResponseReceivedParameters) => void;
  export type WebSocketCreatedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** WebSocket request URL. */
    url: string;
    /** Request initiator. */
    initiator?: Initiator;
  };
  export type WebSocketCreatedHandler = (params: WebSocketCreatedParameters) => void;
  export type WebSocketClosedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
  };
  export type WebSocketClosedHandler = (params: WebSocketClosedParameters) => void;
  export type WebSocketFrameReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type WebSocketFrameReceivedHandler = (params: WebSocketFrameReceivedParameters) => void;
  export type WebSocketFrameErrorParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket frame error message. */
    errorMessage: string;
  };
  export type WebSocketFrameErrorHandler = (params: WebSocketFrameErrorParameters) => void;
  export type WebSocketFrameSentParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type WebSocketFrameSentHandler = (params: WebSocketFrameSentParameters) => void;
  export type EventSourceMessageReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Message type. */
    eventName: string;
    /** Message identifier. */
    eventId: string;
    /** Message content. */
    data: string;
  };
  export type EventSourceMessageReceivedHandler = (params: EventSourceMessageReceivedParameters) => void;
  export type RequestInterceptedParameters = {
    /** Each request the page makes will have a unique id, however if any redirects are encountered while processing that fetch, they will be reported with the same id as the original fetch. Likewise if HTTP authentication is needed then the same fetch id will be used. */
    interceptionId: InterceptionId;
    request: Request;
    /** How the requested resource will be used. */
    resourceType: Page.ResourceType;
    /** HTTP response headers, only sent if a redirect was intercepted. */
    redirectHeaders?: Headers;
    /** HTTP response code, only sent if a redirect was intercepted. */
    redirectStatusCode?: number;
    /** Redirect location, only sent if a redirect was intercepted. */
    redirectUrl?: string;
    /** Details of the Authorization Challenge encountered. If this is set then continueInterceptedRequest must contain an authChallengeResponse. */
    authChallenge?: AuthChallenge;
  };
  export type RequestInterceptedHandler = (params: RequestInterceptedParameters) => void;
  export type EnableParameters = {
    /** Buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxTotalBufferSize?: number;
    /** Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxResourceBufferSize?: number;
  };
  export type SetUserAgentOverrideParameters = {
    /** User agent to use. */
    userAgent: string;
  };
  export type SetExtraHTTPHeadersParameters = {
    /** Map with extra HTTP headers. */
    headers: Headers;
  };
  export type GetResponseBodyParameters = {
    /** Identifier of the network request to get content for. */
    requestId: RequestId;
  };
  export type GetResponseBodyReturn = {
    /** Response body. */
    body: string;
    /** True, if content was sent as base64. */
    base64Encoded: boolean;
  };
  export type SetBlockedURLsParameters = {
    /** URL patterns to block. Wildcards ('*') are allowed. */
    urls: string[];
  };
  export type ReplayXHRParameters = {
    /** Identifier of XHR to replay. */
    requestId: RequestId;
  };
  export type CanClearBrowserCacheReturn = {
    /** True if browser cache can be cleared. */
    result: boolean;
  };
  export type CanClearBrowserCookiesReturn = {
    /** True if browser cookies can be cleared. */
    result: boolean;
  };
  export type GetCookiesParameters = {
    /** The list of URLs for which applicable cookies will be fetched */
    urls?: string[];
  };
  export type GetCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Cookie[];
  };
  export type GetAllCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Cookie[];
  };
  export type DeleteCookieParameters = {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  };
  export type SetCookieParameters = {
    /** The request-URI to associate with the setting of the cookie. This value can affect the default domain and path values of the created cookie. */
    url: string;
    /** The name of the cookie. */
    name: string;
    /** The value of the cookie. */
    value: string;
    /** If omitted, the cookie becomes a host-only cookie. */
    domain?: string;
    /** Defaults to the path portion of the url parameter. */
    path?: string;
    /** Defaults ot false. */
    secure?: boolean;
    /** Defaults to false. */
    httpOnly?: boolean;
    /** Defaults to browser default behavior. */
    sameSite?: CookieSameSite;
    /** If omitted, the cookie becomes a session cookie. */
    expirationDate?: TimeSinceEpoch;
  };
  export type SetCookieReturn = {
    /** True if successfully set cookie. */
    success: boolean;
  };
  export type CanEmulateNetworkConditionsReturn = {
    /** True if emulation of network conditions is supported. */
    result: boolean;
  };
  export type EmulateNetworkConditionsParameters = {
    /** True to emulate internet disconnection. */
    offline: boolean;
    /** Additional latency (ms). */
    latency: number;
    /** Maximal aggregated download throughput. */
    downloadThroughput: number;
    /** Maximal aggregated upload throughput. */
    uploadThroughput: number;
    /** Connection type if known. */
    connectionType?: ConnectionType;
  };
  export type SetCacheDisabledParameters = {
    /** Cache disabled state. */
    cacheDisabled: boolean;
  };
  export type SetBypassServiceWorkerParameters = {
    /** Bypass service worker and load from network. */
    bypass: boolean;
  };
  export type SetDataSizeLimitsForTestParameters = {
    /** Maximum total buffer size. */
    maxTotalSize: number;
    /** Maximum per-resource size. */
    maxResourceSize: number;
  };
  export type GetCertificateParameters = {
    /** Origin to get certificate for. */
    origin: string;
  };
  export type GetCertificateReturn = {
    tableNames: string[];
  };
  export type SetRequestInterceptionEnabledParameters = {
    /** Whether or not HTTP requests should be intercepted and Network.requestIntercepted events sent. */
    enabled: boolean;
  };
  export type ContinueInterceptedRequestParameters = {
    interceptionId: InterceptionId;
    /** If set this causes the request to fail with the given reason. Must not be set in response to an authChallenge. */
    errorReason?: ErrorReason;
    /** If set the requests completes using with the provided base64 encoded raw response, including HTTP status line and headers etc... Must not be set in response to an authChallenge. */
    rawResponse?: string;
    /** If set the request url will be modified in a way that's not observable by page. Must not be set in response to an authChallenge. */
    url?: string;
    /** If set this allows the request method to be overridden. Must not be set in response to an authChallenge. */
    method?: string;
    /** If set this allows postData to be set. Must not be set in response to an authChallenge. */
    postData?: string;
    /** If set this allows the request headers to be changed. Must not be set in response to an authChallenge. */
    headers?: Headers;
    /** Response to a requestIntercepted with an authChallenge. Must not be set otherwise. */
    authChallengeResponse?: AuthChallengeResponse;
  };
}
export class Database {
  private _addDatabase: Database.AddDatabaseHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables database tracking, database events will now be delivered to the client. */
  public enable() {
    return this._client.send<void>("Database.enable");
  }
  /** Disables database tracking, prevents database events from being sent to the client. */
  public disable() {
    return this._client.send<void>("Database.disable");
  }
  public getDatabaseTableNames(params: Database.GetDatabaseTableNamesParameters) {
    return this._client.send<Database.GetDatabaseTableNamesReturn>("Database.getDatabaseTableNames", params);
  }
  public executeSQL(params: Database.ExecuteSQLParameters) {
    return this._client.send<Database.ExecuteSQLReturn>("Database.executeSQL", params);
  }
  get addDatabase() {
    return this._addDatabase;
  }
  set addDatabase(handler) {
    if (this._addDatabase) {
      this._client.removeListener("Database.addDatabase", this._addDatabase);
    }
    this._addDatabase = handler;
    if (handler) {
      this._client.on("Database.addDatabase", handler);
    }
  }
}
export namespace Database {
  /** Unique identifier of Database object. */
  export type DatabaseId = string;
  /** Database object. */
  export interface Database {
    /** Database ID. */
    id: DatabaseId;
    /** Database domain. */
    domain: string;
    /** Database name. */
    name: string;
    /** Database version. */
    version: string;
  }
  /** Database error. */
  export interface Error {
    /** Error message. */
    message: string;
    /** Error code. */
    code: number;
  }
  export type AddDatabaseParameters = {
    database: Database;
  };
  export type AddDatabaseHandler = (params: AddDatabaseParameters) => void;
  export type GetDatabaseTableNamesParameters = {
    databaseId: DatabaseId;
  };
  export type GetDatabaseTableNamesReturn = {
    tableNames: string[];
  };
  export type ExecuteSQLParameters = {
    databaseId: DatabaseId;
    query: string;
  };
  export type ExecuteSQLReturn = {
    columnNames?: string[];
    values?: any[];
    sqlError?: Error;
  };
}
export class IndexedDB {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables events from backend. */
  public enable() {
    return this._client.send<void>("IndexedDB.enable");
  }
  /** Disables events from backend. */
  public disable() {
    return this._client.send<void>("IndexedDB.disable");
  }
  /** Requests database names for given security origin. */
  public requestDatabaseNames(params: IndexedDB.RequestDatabaseNamesParameters) {
    return this._client.send<IndexedDB.RequestDatabaseNamesReturn>("IndexedDB.requestDatabaseNames", params);
  }
  /** Requests database with given name in given frame. */
  public requestDatabase(params: IndexedDB.RequestDatabaseParameters) {
    return this._client.send<IndexedDB.RequestDatabaseReturn>("IndexedDB.requestDatabase", params);
  }
  /** Requests data from object store or index. */
  public requestData(params: IndexedDB.RequestDataParameters) {
    return this._client.send<IndexedDB.RequestDataReturn>("IndexedDB.requestData", params);
  }
  /** Clears all entries from an object store. */
  public clearObjectStore(params: IndexedDB.ClearObjectStoreParameters) {
    return this._client.send<IndexedDB.ClearObjectStoreReturn>("IndexedDB.clearObjectStore", params);
  }
  /** Deletes a database. */
  public deleteDatabase(params: IndexedDB.DeleteDatabaseParameters) {
    return this._client.send<IndexedDB.DeleteDatabaseReturn>("IndexedDB.deleteDatabase", params);
  }
}
export namespace IndexedDB {
  /** Database with an array of object stores. */
  export interface DatabaseWithObjectStores {
    /** Database name. */
    name: string;
    /** Database version. */
    version: number;
    /** Object stores in this database. */
    objectStores: ObjectStore[];
  }
  /** Object store. */
  export interface ObjectStore {
    /** Object store name. */
    name: string;
    /** Object store key path. */
    keyPath: KeyPath;
    /** If true, object store has auto increment flag set. */
    autoIncrement: boolean;
    /** Indexes in this object store. */
    indexes: ObjectStoreIndex[];
  }
  /** Object store index. */
  export interface ObjectStoreIndex {
    /** Index name. */
    name: string;
    /** Index key path. */
    keyPath: KeyPath;
    /** If true, index is unique. */
    unique: boolean;
    /** If true, index allows multiple entries for a key. */
    multiEntry: boolean;
  }
  /** Key. */
  export interface Key {
    /** Key type. */
    type: "number" | "string" | "date" | "array";
    /** Number value. */
    number?: number;
    /** String value. */
    string?: string;
    /** Date value. */
    date?: number;
    /** Array value. */
    array?: Key[];
  }
  /** Key range. */
  export interface KeyRange {
    /** Lower bound. */
    lower?: Key;
    /** Upper bound. */
    upper?: Key;
    /** If true lower bound is open. */
    lowerOpen: boolean;
    /** If true upper bound is open. */
    upperOpen: boolean;
  }
  /** Data entry. */
  export interface DataEntry {
    /** Key object. */
    key: Runtime.RemoteObject;
    /** Primary key object. */
    primaryKey: Runtime.RemoteObject;
    /** Value object. */
    value: Runtime.RemoteObject;
  }
  /** Key path. */
  export interface KeyPath {
    /** Key path type. */
    type: "null" | "string" | "array";
    /** String value. */
    string?: string;
    /** Array value. */
    array?: string[];
  }
  export type RequestDatabaseNamesParameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type RequestDatabaseNamesReturn = {
    /** Database names for origin. */
    databaseNames: string[];
  };
  export type RequestDatabaseParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type RequestDatabaseReturn = {
    /** Database with an array of object stores. */
    databaseWithObjectStores: DatabaseWithObjectStores;
  };
  export type RequestDataParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
    /** Index name, empty string for object store data requests. */
    indexName: string;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
    /** Key range. */
    keyRange?: KeyRange;
  };
  export type RequestDataReturn = {
    /** Array of object store data entries. */
    objectStoreDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
  export type ClearObjectStoreParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
  };
  export type ClearObjectStoreReturn = any;
  export type DeleteDatabaseParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type DeleteDatabaseReturn = any;
}
export class CacheStorage {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Requests cache names. */
  public requestCacheNames(params: CacheStorage.RequestCacheNamesParameters) {
    return this._client.send<CacheStorage.RequestCacheNamesReturn>("CacheStorage.requestCacheNames", params);
  }
  /** Requests data from cache. */
  public requestEntries(params: CacheStorage.RequestEntriesParameters) {
    return this._client.send<CacheStorage.RequestEntriesReturn>("CacheStorage.requestEntries", params);
  }
  /** Deletes a cache. */
  public deleteCache(params: CacheStorage.DeleteCacheParameters) {
    return this._client.send<void>("CacheStorage.deleteCache", params);
  }
  /** Deletes a cache entry. */
  public deleteEntry(params: CacheStorage.DeleteEntryParameters) {
    return this._client.send<void>("CacheStorage.deleteEntry", params);
  }
}
export namespace CacheStorage {
  /** Unique identifier of the Cache object. */
  export type CacheId = string;
  /** Data entry. */
  export interface DataEntry {
    /** Request url spec. */
    request: string;
    /** Response status text. */
    response: string;
    /** Number of seconds since epoch. */
    responseTime: number;
  }
  /** Cache identifier. */
  export interface Cache {
    /** An opaque unique id of the cache. */
    cacheId: CacheId;
    /** Security origin of the cache. */
    securityOrigin: string;
    /** The name of the cache. */
    cacheName: string;
  }
  export type RequestCacheNamesParameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type RequestCacheNamesReturn = {
    /** Caches for the security origin. */
    caches: Cache[];
  };
  export type RequestEntriesParameters = {
    /** ID of cache to get entries from. */
    cacheId: CacheId;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
  };
  export type RequestEntriesReturn = {
    /** Array of object store data entries. */
    cacheDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
  export type DeleteCacheParameters = {
    /** Id of cache for deletion. */
    cacheId: CacheId;
  };
  export type DeleteEntryParameters = {
    /** Id of cache where the entry will be deleted. */
    cacheId: CacheId;
    /** URL spec of the request. */
    request: string;
  };
}
/** Query and modify DOM storage. */
export class DOMStorage {
  private _domStorageItemsCleared: DOMStorage.DomStorageItemsClearedHandler | null = null;
  private _domStorageItemRemoved: DOMStorage.DomStorageItemRemovedHandler | null = null;
  private _domStorageItemAdded: DOMStorage.DomStorageItemAddedHandler | null = null;
  private _domStorageItemUpdated: DOMStorage.DomStorageItemUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables storage tracking, storage events will now be delivered to the client. */
  public enable() {
    return this._client.send<void>("DOMStorage.enable");
  }
  /** Disables storage tracking, prevents storage events from being sent to the client. */
  public disable() {
    return this._client.send<void>("DOMStorage.disable");
  }
  public clear(params: DOMStorage.ClearParameters) {
    return this._client.send<void>("DOMStorage.clear", params);
  }
  public getDOMStorageItems(params: DOMStorage.GetDOMStorageItemsParameters) {
    return this._client.send<DOMStorage.GetDOMStorageItemsReturn>("DOMStorage.getDOMStorageItems", params);
  }
  public setDOMStorageItem(params: DOMStorage.SetDOMStorageItemParameters) {
    return this._client.send<void>("DOMStorage.setDOMStorageItem", params);
  }
  public removeDOMStorageItem(params: DOMStorage.RemoveDOMStorageItemParameters) {
    return this._client.send<void>("DOMStorage.removeDOMStorageItem", params);
  }
  get domStorageItemsCleared() {
    return this._domStorageItemsCleared;
  }
  set domStorageItemsCleared(handler) {
    if (this._domStorageItemsCleared) {
      this._client.removeListener("DOMStorage.domStorageItemsCleared", this._domStorageItemsCleared);
    }
    this._domStorageItemsCleared = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemsCleared", handler);
    }
  }
  get domStorageItemRemoved() {
    return this._domStorageItemRemoved;
  }
  set domStorageItemRemoved(handler) {
    if (this._domStorageItemRemoved) {
      this._client.removeListener("DOMStorage.domStorageItemRemoved", this._domStorageItemRemoved);
    }
    this._domStorageItemRemoved = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemRemoved", handler);
    }
  }
  get domStorageItemAdded() {
    return this._domStorageItemAdded;
  }
  set domStorageItemAdded(handler) {
    if (this._domStorageItemAdded) {
      this._client.removeListener("DOMStorage.domStorageItemAdded", this._domStorageItemAdded);
    }
    this._domStorageItemAdded = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemAdded", handler);
    }
  }
  get domStorageItemUpdated() {
    return this._domStorageItemUpdated;
  }
  set domStorageItemUpdated(handler) {
    if (this._domStorageItemUpdated) {
      this._client.removeListener("DOMStorage.domStorageItemUpdated", this._domStorageItemUpdated);
    }
    this._domStorageItemUpdated = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemUpdated", handler);
    }
  }
}
export namespace DOMStorage {
  /** DOM Storage identifier. */
  export interface StorageId {
    /** Security origin for the storage. */
    securityOrigin: string;
    /** Whether the storage is local storage (not session storage). */
    isLocalStorage: boolean;
  }
  /** DOM Storage item. */
  export type Item = string[];
  export type DomStorageItemsClearedParameters = {
    storageId: StorageId;
  };
  export type DomStorageItemsClearedHandler = (params: DomStorageItemsClearedParameters) => void;
  export type DomStorageItemRemovedParameters = {
    storageId: StorageId;
    key: string;
  };
  export type DomStorageItemRemovedHandler = (params: DomStorageItemRemovedParameters) => void;
  export type DomStorageItemAddedParameters = {
    storageId: StorageId;
    key: string;
    newValue: string;
  };
  export type DomStorageItemAddedHandler = (params: DomStorageItemAddedParameters) => void;
  export type DomStorageItemUpdatedParameters = {
    storageId: StorageId;
    key: string;
    oldValue: string;
    newValue: string;
  };
  export type DomStorageItemUpdatedHandler = (params: DomStorageItemUpdatedParameters) => void;
  export type ClearParameters = {
    storageId: StorageId;
  };
  export type GetDOMStorageItemsParameters = {
    storageId: StorageId;
  };
  export type GetDOMStorageItemsReturn = {
    entries: Item[];
  };
  export type SetDOMStorageItemParameters = {
    storageId: StorageId;
    key: string;
    value: string;
  };
  export type RemoveDOMStorageItemParameters = {
    storageId: StorageId;
    key: string;
  };
}
export class ApplicationCache {
  private _applicationCacheStatusUpdated: ApplicationCache.ApplicationCacheStatusUpdatedHandler | null = null;
  private _networkStateUpdated: ApplicationCache.NetworkStateUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
  public getFramesWithManifests() {
    return this._client.send<ApplicationCache.GetFramesWithManifestsReturn>("ApplicationCache.getFramesWithManifests");
  }
  /** Enables application cache domain notifications. */
  public enable() {
    return this._client.send<void>("ApplicationCache.enable");
  }
  /** Returns manifest URL for document in the given frame. */
  public getManifestForFrame(params: ApplicationCache.GetManifestForFrameParameters) {
    return this._client.send<ApplicationCache.GetManifestForFrameReturn>("ApplicationCache.getManifestForFrame", params);
  }
  /** Returns relevant application cache data for the document in given frame. */
  public getApplicationCacheForFrame(params: ApplicationCache.GetApplicationCacheForFrameParameters) {
    return this._client.send<ApplicationCache.GetApplicationCacheForFrameReturn>("ApplicationCache.getApplicationCacheForFrame", params);
  }
  get applicationCacheStatusUpdated() {
    return this._applicationCacheStatusUpdated;
  }
  set applicationCacheStatusUpdated(handler) {
    if (this._applicationCacheStatusUpdated) {
      this._client.removeListener("ApplicationCache.applicationCacheStatusUpdated", this._applicationCacheStatusUpdated);
    }
    this._applicationCacheStatusUpdated = handler;
    if (handler) {
      this._client.on("ApplicationCache.applicationCacheStatusUpdated", handler);
    }
  }
  get networkStateUpdated() {
    return this._networkStateUpdated;
  }
  set networkStateUpdated(handler) {
    if (this._networkStateUpdated) {
      this._client.removeListener("ApplicationCache.networkStateUpdated", this._networkStateUpdated);
    }
    this._networkStateUpdated = handler;
    if (handler) {
      this._client.on("ApplicationCache.networkStateUpdated", handler);
    }
  }
}
export namespace ApplicationCache {
  /** Detailed application cache resource information. */
  export interface ApplicationCacheResource {
    /** Resource url. */
    url: string;
    /** Resource size. */
    size: number;
    /** Resource type. */
    type: string;
  }
  /** Detailed application cache information. */
  export interface ApplicationCache {
    /** Manifest URL. */
    manifestURL: string;
    /** Application cache size. */
    size: number;
    /** Application cache creation time. */
    creationTime: number;
    /** Application cache update time. */
    updateTime: number;
    /** Application cache resources. */
    resources: ApplicationCacheResource[];
  }
  /** Frame identifier - manifest URL pair. */
  export interface FrameWithManifest {
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Application cache status. */
    status: number;
  }
  export type ApplicationCacheStatusUpdatedParameters = {
    /** Identifier of the frame containing document whose application cache updated status. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Updated application cache status. */
    status: number;
  };
  export type ApplicationCacheStatusUpdatedHandler = (params: ApplicationCacheStatusUpdatedParameters) => void;
  export type NetworkStateUpdatedParameters = {
    isNowOnline: boolean;
  };
  export type NetworkStateUpdatedHandler = (params: NetworkStateUpdatedParameters) => void;
  export type GetFramesWithManifestsReturn = {
    /** Array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
    frameIds: FrameWithManifest[];
  };
  export type GetManifestForFrameParameters = {
    /** Identifier of the frame containing document whose manifest is retrieved. */
    frameId: Page.FrameId;
  };
  export type GetManifestForFrameReturn = {
    /** Manifest URL for document in the given frame. */
    manifestURL: string;
  };
  export type GetApplicationCacheForFrameParameters = {
    /** Identifier of the frame containing document whose application cache is retrieved. */
    frameId: Page.FrameId;
  };
  export type GetApplicationCacheForFrameReturn = {
    /** Relevant application cache data for the document in given frame. */
    applicationCache: ApplicationCache;
  };
}
/** This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p> */
export class DOM {
  private _documentUpdated: DOM.DocumentUpdatedHandler | null = null;
  private _setChildNodes: DOM.SetChildNodesHandler | null = null;
  private _attributeModified: DOM.AttributeModifiedHandler | null = null;
  private _attributeRemoved: DOM.AttributeRemovedHandler | null = null;
  private _inlineStyleInvalidated: DOM.InlineStyleInvalidatedHandler | null = null;
  private _characterDataModified: DOM.CharacterDataModifiedHandler | null = null;
  private _childNodeCountUpdated: DOM.ChildNodeCountUpdatedHandler | null = null;
  private _childNodeInserted: DOM.ChildNodeInsertedHandler | null = null;
  private _childNodeRemoved: DOM.ChildNodeRemovedHandler | null = null;
  private _shadowRootPushed: DOM.ShadowRootPushedHandler | null = null;
  private _shadowRootPopped: DOM.ShadowRootPoppedHandler | null = null;
  private _pseudoElementAdded: DOM.PseudoElementAddedHandler | null = null;
  private _pseudoElementRemoved: DOM.PseudoElementRemovedHandler | null = null;
  private _distributedNodesUpdated: DOM.DistributedNodesUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables DOM agent for the given page. */
  public enable() {
    return this._client.send<void>("DOM.enable");
  }
  /** Disables DOM agent for the given page. */
  public disable() {
    return this._client.send<void>("DOM.disable");
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getDocument(params: DOM.GetDocumentParameters) {
    return this._client.send<DOM.GetDocumentReturn>("DOM.getDocument", params);
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getFlattenedDocument(params: DOM.GetFlattenedDocumentParameters) {
    return this._client.send<DOM.GetFlattenedDocumentReturn>("DOM.getFlattenedDocument", params);
  }
  /** Collects class names for the node with given id and all of it's child nodes. */
  public collectClassNamesFromSubtree(params: DOM.CollectClassNamesFromSubtreeParameters) {
    return this._client.send<DOM.CollectClassNamesFromSubtreeReturn>("DOM.collectClassNamesFromSubtree", params);
  }
  /** Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth. */
  public requestChildNodes(params: DOM.RequestChildNodesParameters) {
    return this._client.send<void>("DOM.requestChildNodes", params);
  }
  /** Executes <code>querySelector</code> on a given node. */
  public querySelector(params: DOM.QuerySelectorParameters) {
    return this._client.send<DOM.QuerySelectorReturn>("DOM.querySelector", params);
  }
  /** Executes <code>querySelectorAll</code> on a given node. */
  public querySelectorAll(params: DOM.QuerySelectorAllParameters) {
    return this._client.send<DOM.QuerySelectorAllReturn>("DOM.querySelectorAll", params);
  }
  /** Sets node name for a node with given id. */
  public setNodeName(params: DOM.SetNodeNameParameters) {
    return this._client.send<DOM.SetNodeNameReturn>("DOM.setNodeName", params);
  }
  /** Sets node value for a node with given id. */
  public setNodeValue(params: DOM.SetNodeValueParameters) {
    return this._client.send<void>("DOM.setNodeValue", params);
  }
  /** Removes node with given id. */
  public removeNode(params: DOM.RemoveNodeParameters) {
    return this._client.send<void>("DOM.removeNode", params);
  }
  /** Sets attribute for an element with given id. */
  public setAttributeValue(params: DOM.SetAttributeValueParameters) {
    return this._client.send<void>("DOM.setAttributeValue", params);
  }
  /** Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs. */
  public setAttributesAsText(params: DOM.SetAttributesAsTextParameters) {
    return this._client.send<void>("DOM.setAttributesAsText", params);
  }
  /** Removes attribute with given name from an element with given id. */
  public removeAttribute(params: DOM.RemoveAttributeParameters) {
    return this._client.send<void>("DOM.removeAttribute", params);
  }
  /** Returns node's HTML markup. */
  public getOuterHTML(params: DOM.GetOuterHTMLParameters) {
    return this._client.send<DOM.GetOuterHTMLReturn>("DOM.getOuterHTML", params);
  }
  /** Sets node HTML markup, returns new node id. */
  public setOuterHTML(params: DOM.SetOuterHTMLParameters) {
    return this._client.send<void>("DOM.setOuterHTML", params);
  }
  /** Searches for a given string in the DOM tree. Use <code>getSearchResults</code> to access search results or <code>cancelSearch</code> to end this search session. */
  public performSearch(params: DOM.PerformSearchParameters) {
    return this._client.send<DOM.PerformSearchReturn>("DOM.performSearch", params);
  }
  /** Returns search results from given <code>fromIndex</code> to given <code>toIndex</code> from the sarch with the given identifier. */
  public getSearchResults(params: DOM.GetSearchResultsParameters) {
    return this._client.send<DOM.GetSearchResultsReturn>("DOM.getSearchResults", params);
  }
  /** Discards search results from the session with the given id. <code>getSearchResults</code> should no longer be called for that search. */
  public discardSearchResults(params: DOM.DiscardSearchResultsParameters) {
    return this._client.send<void>("DOM.discardSearchResults", params);
  }
  /** Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications. */
  public requestNode(params: DOM.RequestNodeParameters) {
    return this._client.send<DOM.RequestNodeReturn>("DOM.requestNode", params);
  }
  /** Highlights given rectangle. */
  public highlightRect() {
    return this._client.send<void>("DOM.highlightRect");
  }
  /** Highlights DOM node. */
  public highlightNode() {
    return this._client.send<void>("DOM.highlightNode");
  }
  /** Hides any highlight. */
  public hideHighlight() {
    return this._client.send<void>("DOM.hideHighlight");
  }
  /** Requests that the node is sent to the caller given its path. // FIXME, use XPath */
  public pushNodeByPathToFrontend(params: DOM.PushNodeByPathToFrontendParameters) {
    return this._client.send<DOM.PushNodeByPathToFrontendReturn>("DOM.pushNodeByPathToFrontend", params);
  }
  /** Requests that a batch of nodes is sent to the caller given their backend node ids. */
  public pushNodesByBackendIdsToFrontend(params: DOM.PushNodesByBackendIdsToFrontendParameters) {
    return this._client.send<DOM.PushNodesByBackendIdsToFrontendReturn>("DOM.pushNodesByBackendIdsToFrontend", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  public setInspectedNode(params: DOM.SetInspectedNodeParameters) {
    return this._client.send<void>("DOM.setInspectedNode", params);
  }
  /** Resolves the JavaScript node object for a given NodeId or BackendNodeId. */
  public resolveNode(params: DOM.ResolveNodeParameters) {
    return this._client.send<DOM.ResolveNodeReturn>("DOM.resolveNode", params);
  }
  /** Returns attributes for the specified node. */
  public getAttributes(params: DOM.GetAttributesParameters) {
    return this._client.send<DOM.GetAttributesReturn>("DOM.getAttributes", params);
  }
  /** Creates a deep copy of the specified node and places it into the target container before the given anchor. */
  public copyTo(params: DOM.CopyToParameters) {
    return this._client.send<DOM.CopyToReturn>("DOM.copyTo", params);
  }
  /** Moves node into the new container, places it before the given anchor. */
  public moveTo(params: DOM.MoveToParameters) {
    return this._client.send<DOM.MoveToReturn>("DOM.moveTo", params);
  }
  /** Undoes the last performed action. */
  public undo() {
    return this._client.send<void>("DOM.undo");
  }
  /** Re-does the last undone action. */
  public redo() {
    return this._client.send<void>("DOM.redo");
  }
  /** Marks last undoable state. */
  public markUndoableState() {
    return this._client.send<void>("DOM.markUndoableState");
  }
  /** Focuses the given element. */
  public focus(params: DOM.FocusParameters) {
    return this._client.send<void>("DOM.focus", params);
  }
  /** Sets files for the given file input element. */
  public setFileInputFiles(params: DOM.SetFileInputFilesParameters) {
    return this._client.send<void>("DOM.setFileInputFiles", params);
  }
  /** Returns boxes for the currently selected nodes. */
  public getBoxModel(params: DOM.GetBoxModelParameters) {
    return this._client.send<DOM.GetBoxModelReturn>("DOM.getBoxModel", params);
  }
  /** Returns node id at given location. */
  public getNodeForLocation(params: DOM.GetNodeForLocationParameters) {
    return this._client.send<DOM.GetNodeForLocationReturn>("DOM.getNodeForLocation", params);
  }
  /** Returns the id of the nearest ancestor that is a relayout boundary. */
  public getRelayoutBoundary(params: DOM.GetRelayoutBoundaryParameters) {
    return this._client.send<DOM.GetRelayoutBoundaryReturn>("DOM.getRelayoutBoundary", params);
  }
  /** Fired when <code>Document</code> has been totally updated. Node ids are no longer valid. */
  get documentUpdated() {
    return this._documentUpdated;
  }
  set documentUpdated(handler) {
    if (this._documentUpdated) {
      this._client.removeListener("DOM.documentUpdated", this._documentUpdated);
    }
    this._documentUpdated = handler;
    if (handler) {
      this._client.on("DOM.documentUpdated", handler);
    }
  }
  /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
  get setChildNodes() {
    return this._setChildNodes;
  }
  set setChildNodes(handler) {
    if (this._setChildNodes) {
      this._client.removeListener("DOM.setChildNodes", this._setChildNodes);
    }
    this._setChildNodes = handler;
    if (handler) {
      this._client.on("DOM.setChildNodes", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is modified. */
  get attributeModified() {
    return this._attributeModified;
  }
  set attributeModified(handler) {
    if (this._attributeModified) {
      this._client.removeListener("DOM.attributeModified", this._attributeModified);
    }
    this._attributeModified = handler;
    if (handler) {
      this._client.on("DOM.attributeModified", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is removed. */
  get attributeRemoved() {
    return this._attributeRemoved;
  }
  set attributeRemoved(handler) {
    if (this._attributeRemoved) {
      this._client.removeListener("DOM.attributeRemoved", this._attributeRemoved);
    }
    this._attributeRemoved = handler;
    if (handler) {
      this._client.on("DOM.attributeRemoved", handler);
    }
  }
  /** Fired when <code>Element</code>'s inline style is modified via a CSS property modification. */
  get inlineStyleInvalidated() {
    return this._inlineStyleInvalidated;
  }
  set inlineStyleInvalidated(handler) {
    if (this._inlineStyleInvalidated) {
      this._client.removeListener("DOM.inlineStyleInvalidated", this._inlineStyleInvalidated);
    }
    this._inlineStyleInvalidated = handler;
    if (handler) {
      this._client.on("DOM.inlineStyleInvalidated", handler);
    }
  }
  /** Mirrors <code>DOMCharacterDataModified</code> event. */
  get characterDataModified() {
    return this._characterDataModified;
  }
  set characterDataModified(handler) {
    if (this._characterDataModified) {
      this._client.removeListener("DOM.characterDataModified", this._characterDataModified);
    }
    this._characterDataModified = handler;
    if (handler) {
      this._client.on("DOM.characterDataModified", handler);
    }
  }
  /** Fired when <code>Container</code>'s child node count has changed. */
  get childNodeCountUpdated() {
    return this._childNodeCountUpdated;
  }
  set childNodeCountUpdated(handler) {
    if (this._childNodeCountUpdated) {
      this._client.removeListener("DOM.childNodeCountUpdated", this._childNodeCountUpdated);
    }
    this._childNodeCountUpdated = handler;
    if (handler) {
      this._client.on("DOM.childNodeCountUpdated", handler);
    }
  }
  /** Mirrors <code>DOMNodeInserted</code> event. */
  get childNodeInserted() {
    return this._childNodeInserted;
  }
  set childNodeInserted(handler) {
    if (this._childNodeInserted) {
      this._client.removeListener("DOM.childNodeInserted", this._childNodeInserted);
    }
    this._childNodeInserted = handler;
    if (handler) {
      this._client.on("DOM.childNodeInserted", handler);
    }
  }
  /** Mirrors <code>DOMNodeRemoved</code> event. */
  get childNodeRemoved() {
    return this._childNodeRemoved;
  }
  set childNodeRemoved(handler) {
    if (this._childNodeRemoved) {
      this._client.removeListener("DOM.childNodeRemoved", this._childNodeRemoved);
    }
    this._childNodeRemoved = handler;
    if (handler) {
      this._client.on("DOM.childNodeRemoved", handler);
    }
  }
  /** Called when shadow root is pushed into the element. */
  get shadowRootPushed() {
    return this._shadowRootPushed;
  }
  set shadowRootPushed(handler) {
    if (this._shadowRootPushed) {
      this._client.removeListener("DOM.shadowRootPushed", this._shadowRootPushed);
    }
    this._shadowRootPushed = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPushed", handler);
    }
  }
  /** Called when shadow root is popped from the element. */
  get shadowRootPopped() {
    return this._shadowRootPopped;
  }
  set shadowRootPopped(handler) {
    if (this._shadowRootPopped) {
      this._client.removeListener("DOM.shadowRootPopped", this._shadowRootPopped);
    }
    this._shadowRootPopped = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPopped", handler);
    }
  }
  /** Called when a pseudo element is added to an element. */
  get pseudoElementAdded() {
    return this._pseudoElementAdded;
  }
  set pseudoElementAdded(handler) {
    if (this._pseudoElementAdded) {
      this._client.removeListener("DOM.pseudoElementAdded", this._pseudoElementAdded);
    }
    this._pseudoElementAdded = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementAdded", handler);
    }
  }
  /** Called when a pseudo element is removed from an element. */
  get pseudoElementRemoved() {
    return this._pseudoElementRemoved;
  }
  set pseudoElementRemoved(handler) {
    if (this._pseudoElementRemoved) {
      this._client.removeListener("DOM.pseudoElementRemoved", this._pseudoElementRemoved);
    }
    this._pseudoElementRemoved = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementRemoved", handler);
    }
  }
  /** Called when distrubution is changed. */
  get distributedNodesUpdated() {
    return this._distributedNodesUpdated;
  }
  set distributedNodesUpdated(handler) {
    if (this._distributedNodesUpdated) {
      this._client.removeListener("DOM.distributedNodesUpdated", this._distributedNodesUpdated);
    }
    this._distributedNodesUpdated = handler;
    if (handler) {
      this._client.on("DOM.distributedNodesUpdated", handler);
    }
  }
}
export namespace DOM {
  /** Unique DOM node identifier. */
  export type NodeId = number;
  /** Unique DOM node identifier used to reference a node that may not have been pushed to the front-end. */
  export type BackendNodeId = number;
  /** Backend node with a friendly name. */
  export interface BackendNode {
    /** <code>Node</code>'s nodeType. */
    nodeType: number;
    /** <code>Node</code>'s nodeName. */
    nodeName: string;
    backendNodeId: BackendNodeId;
  }
  /** Pseudo element type. */
  export type PseudoType = "first-line" | "first-letter" | "before" | "after" | "backdrop" | "selection" | "first-line-inherited" | "scrollbar" | "scrollbar-thumb" | "scrollbar-button" | "scrollbar-track" | "scrollbar-track-piece" | "scrollbar-corner" | "resizer" | "input-list-button";
  /** Shadow root type. */
  export type ShadowRootType = "user-agent" | "open" | "closed";
  /** DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type. */
  export interface Node {
    /** Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client. */
    nodeId: NodeId;
    /** The id of the parent node if any. */
    parentId?: NodeId;
    /** The BackendNodeId for this node. */
    backendNodeId: BackendNodeId;
    /** <code>Node</code>'s nodeType. */
    nodeType: number;
    /** <code>Node</code>'s nodeName. */
    nodeName: string;
    /** <code>Node</code>'s localName. */
    localName: string;
    /** <code>Node</code>'s nodeValue. */
    nodeValue: string;
    /** Child count for <code>Container</code> nodes. */
    childNodeCount?: number;
    /** Child nodes of this node when requested with children. */
    children?: Node[];
    /** Attributes of the <code>Element</code> node in the form of flat array <code>[name1, value1, name2, value2]</code>. */
    attributes?: string[];
    /** Document URL that <code>Document</code> or <code>FrameOwner</code> node points to. */
    documentURL?: string;
    /** Base URL that <code>Document</code> or <code>FrameOwner</code> node uses for URL completion. */
    baseURL?: string;
    /** <code>DocumentType</code>'s publicId. */
    publicId?: string;
    /** <code>DocumentType</code>'s systemId. */
    systemId?: string;
    /** <code>DocumentType</code>'s internalSubset. */
    internalSubset?: string;
    /** <code>Document</code>'s XML version in case of XML documents. */
    xmlVersion?: string;
    /** <code>Attr</code>'s name. */
    name?: string;
    /** <code>Attr</code>'s value. */
    value?: string;
    /** Pseudo element type for this node. */
    pseudoType?: PseudoType;
    /** Shadow root type. */
    shadowRootType?: ShadowRootType;
    /** Frame ID for frame owner elements. */
    frameId?: Page.FrameId;
    /** Content document for frame owner elements. */
    contentDocument?: Node;
    /** Shadow root list for given element host. */
    shadowRoots?: Node[];
    /** Content document fragment for template elements. */
    templateContent?: Node;
    /** Pseudo elements associated with this node. */
    pseudoElements?: Node[];
    /** Import document for the HTMLImport links. */
    importedDocument?: Node;
    /** Distributed nodes for given insertion point. */
    distributedNodes?: BackendNode[];
    /** Whether the node is SVG. */
    isSVG?: boolean;
  }
  /** A structure holding an RGBA color. */
  export interface RGBA {
    /** The red component, in the [0-255] range. */
    r: number;
    /** The green component, in the [0-255] range. */
    g: number;
    /** The blue component, in the [0-255] range. */
    b: number;
    /** The alpha component, in the [0-1] range (default: 1). */
    a?: number;
  }
  /** An array of quad vertices, x immediately followed by y for each point, points clock-wise. */
  export type Quad = number[];
  /** Box model. */
  export interface BoxModel {
    /** Content box */
    content: Quad;
    /** Padding box */
    padding: Quad;
    /** Border box */
    border: Quad;
    /** Margin box */
    margin: Quad;
    /** Node width */
    width: number;
    /** Node height */
    height: number;
    /** Shape outside coordinates */
    shapeOutside?: ShapeOutsideInfo;
  }
  /** CSS Shape Outside details. */
  export interface ShapeOutsideInfo {
    /** Shape bounds */
    bounds: Quad;
    /** Shape coordinate details */
    shape: any[];
    /** Margin shape bounds */
    marginShape: any[];
  }
  /** Rectangle. */
  export interface Rect {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Rectangle width */
    width: number;
    /** Rectangle height */
    height: number;
  }
  export type DocumentUpdatedHandler = () => void;
  export type SetChildNodesParameters = {
    /** Parent node id to populate with children. */
    parentId: NodeId;
    /** Child nodes array. */
    nodes: Node[];
  };
  export type SetChildNodesHandler = (params: SetChildNodesParameters) => void;
  export type AttributeModifiedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type AttributeModifiedHandler = (params: AttributeModifiedParameters) => void;
  export type AttributeRemovedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** A ttribute name. */
    name: string;
  };
  export type AttributeRemovedHandler = (params: AttributeRemovedParameters) => void;
  export type InlineStyleInvalidatedParameters = {
    /** Ids of the nodes for which the inline styles have been invalidated. */
    nodeIds: NodeId[];
  };
  export type InlineStyleInvalidatedHandler = (params: InlineStyleInvalidatedParameters) => void;
  export type CharacterDataModifiedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New text value. */
    characterData: string;
  };
  export type CharacterDataModifiedHandler = (params: CharacterDataModifiedParameters) => void;
  export type ChildNodeCountUpdatedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New node count. */
    childNodeCount: number;
  };
  export type ChildNodeCountUpdatedHandler = (params: ChildNodeCountUpdatedParameters) => void;
  export type ChildNodeInsertedParameters = {
    /** Id of the node that has changed. */
    parentNodeId: NodeId;
    /** If of the previous siblint. */
    previousNodeId: NodeId;
    /** Inserted node data. */
    node: Node;
  };
  export type ChildNodeInsertedHandler = (params: ChildNodeInsertedParameters) => void;
  export type ChildNodeRemovedParameters = {
    /** Parent id. */
    parentNodeId: NodeId;
    /** Id of the node that has been removed. */
    nodeId: NodeId;
  };
  export type ChildNodeRemovedHandler = (params: ChildNodeRemovedParameters) => void;
  export type ShadowRootPushedParameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root. */
    root: Node;
  };
  export type ShadowRootPushedHandler = (params: ShadowRootPushedParameters) => void;
  export type ShadowRootPoppedParameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root id. */
    rootId: NodeId;
  };
  export type ShadowRootPoppedHandler = (params: ShadowRootPoppedParameters) => void;
  export type PseudoElementAddedParameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The added pseudo element. */
    pseudoElement: Node;
  };
  export type PseudoElementAddedHandler = (params: PseudoElementAddedParameters) => void;
  export type PseudoElementRemovedParameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The removed pseudo element id. */
    pseudoElementId: NodeId;
  };
  export type PseudoElementRemovedHandler = (params: PseudoElementRemovedParameters) => void;
  export type DistributedNodesUpdatedParameters = {
    /** Insertion point where distrubuted nodes were updated. */
    insertionPointId: NodeId;
    /** Distributed nodes for given insertion point. */
    distributedNodes: BackendNode[];
  };
  export type DistributedNodesUpdatedHandler = (params: DistributedNodesUpdatedParameters) => void;
  export type GetDocumentParameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). */
    pierce?: boolean;
  };
  export type GetDocumentReturn = {
    /** Resulting node. */
    root: Node;
  };
  export type GetFlattenedDocumentParameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). */
    pierce?: boolean;
  };
  export type GetFlattenedDocumentReturn = {
    /** Resulting node. */
    nodes: Node[];
  };
  export type CollectClassNamesFromSubtreeParameters = {
    /** Id of the node to collect class names. */
    nodeId: NodeId;
  };
  export type CollectClassNamesFromSubtreeReturn = {
    /** Class name list. */
    classNames: string[];
  };
  export type RequestChildNodesParameters = {
    /** Id of the node to get children for. */
    nodeId: NodeId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the sub-tree (default is false). */
    pierce?: boolean;
  };
  export type QuerySelectorParameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type QuerySelectorReturn = {
    /** Query selector result. */
    nodeId: NodeId;
  };
  export type QuerySelectorAllParameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type QuerySelectorAllReturn = {
    /** Query selector result. */
    nodeIds: NodeId[];
  };
  export type SetNodeNameParameters = {
    /** Id of the node to set name for. */
    nodeId: NodeId;
    /** New node's name. */
    name: string;
  };
  export type SetNodeNameReturn = {
    /** New node's id. */
    nodeId: NodeId;
  };
  export type SetNodeValueParameters = {
    /** Id of the node to set value for. */
    nodeId: NodeId;
    /** New node's value. */
    value: string;
  };
  export type RemoveNodeParameters = {
    /** Id of the node to remove. */
    nodeId: NodeId;
  };
  export type SetAttributeValueParameters = {
    /** Id of the element to set attribute for. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type SetAttributesAsTextParameters = {
    /** Id of the element to set attributes for. */
    nodeId: NodeId;
    /** Text with a number of attributes. Will parse this text using HTML parser. */
    text: string;
    /** Attribute name to replace with new attributes derived from text in case text parsed successfully. */
    name?: string;
  };
  export type RemoveAttributeParameters = {
    /** Id of the element to remove attribute from. */
    nodeId: NodeId;
    /** Name of the attribute to remove. */
    name: string;
  };
  export type GetOuterHTMLParameters = {
    /** Id of the node to get markup for. */
    nodeId: NodeId;
  };
  export type GetOuterHTMLReturn = {
    /** Outer HTML markup. */
    outerHTML: string;
  };
  export type SetOuterHTMLParameters = {
    /** Id of the node to set markup for. */
    nodeId: NodeId;
    /** Outer HTML markup to set. */
    outerHTML: string;
  };
  export type PerformSearchParameters = {
    /** Plain text or query selector or XPath search query. */
    query: string;
    /** True to search in user agent shadow DOM. */
    includeUserAgentShadowDOM?: boolean;
  };
  export type PerformSearchReturn = {
    /** Unique search session identifier. */
    searchId: string;
    /** Number of search results. */
    resultCount: number;
  };
  export type GetSearchResultsParameters = {
    /** Unique search session identifier. */
    searchId: string;
    /** Start index of the search result to be returned. */
    fromIndex: number;
    /** End index of the search result to be returned. */
    toIndex: number;
  };
  export type GetSearchResultsReturn = {
    /** Ids of the search result nodes. */
    nodeIds: NodeId[];
  };
  export type DiscardSearchResultsParameters = {
    /** Unique search session identifier. */
    searchId: string;
  };
  export type RequestNodeParameters = {
    /** JavaScript object id to convert into node. */
    objectId: Runtime.RemoteObjectId;
  };
  export type RequestNodeReturn = {
    /** Node id for given object. */
    nodeId: NodeId;
  };
  export type PushNodeByPathToFrontendParameters = {
    /** Path to node in the proprietary format. */
    path: string;
  };
  export type PushNodeByPathToFrontendReturn = {
    /** Id of the node for given path. */
    nodeId: NodeId;
  };
  export type PushNodesByBackendIdsToFrontendParameters = {
    /** The array of backend node ids. */
    backendNodeIds: BackendNodeId[];
  };
  export type PushNodesByBackendIdsToFrontendReturn = {
    /** The array of ids of pushed nodes that correspond to the backend ids specified in backendNodeIds. */
    nodeIds: NodeId[];
  };
  export type SetInspectedNodeParameters = {
    /** DOM node id to be accessible by means of $x command line API. */
    nodeId: NodeId;
  };
  export type ResolveNodeParameters = {
    /** Id of the node to resolve. */
    nodeId?: NodeId;
    /** Backend identifier of the node to resolve. */
    backendNodeId?: DOM.BackendNodeId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type ResolveNodeReturn = {
    /** JavaScript object wrapper for given node. */
    object: Runtime.RemoteObject;
  };
  export type GetAttributesParameters = {
    /** Id of the node to retrieve attibutes for. */
    nodeId: NodeId;
  };
  export type GetAttributesReturn = {
    /** An interleaved array of node attribute names and values. */
    attributes: string[];
  };
  export type CopyToParameters = {
    /** Id of the node to copy. */
    nodeId: NodeId;
    /** Id of the element to drop the copy into. */
    targetNodeId: NodeId;
    /** Drop the copy before this node (if absent, the copy becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: NodeId;
  };
  export type CopyToReturn = {
    /** Id of the node clone. */
    nodeId: NodeId;
  };
  export type MoveToParameters = {
    /** Id of the node to move. */
    nodeId: NodeId;
    /** Id of the element to drop the moved node into. */
    targetNodeId: NodeId;
    /** Drop node before this one (if absent, the moved node becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: NodeId;
  };
  export type MoveToReturn = {
    /** New id of the moved node. */
    nodeId: NodeId;
  };
  export type FocusParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type SetFileInputFilesParameters = {
    /** Array of file paths to set. */
    files: string[];
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetBoxModelParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetBoxModelReturn = {
    /** Box model for the node. */
    model: BoxModel;
  };
  export type GetNodeForLocationParameters = {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
    /** False to skip to the nearest non-UA shadow root ancestor (default: false). */
    includeUserAgentShadowDOM?: boolean;
  };
  export type GetNodeForLocationReturn = {
    /** Id of the node at given coordinates. */
    nodeId: NodeId;
  };
  export type GetRelayoutBoundaryParameters = {
    /** Id of the node. */
    nodeId: NodeId;
  };
  export type GetRelayoutBoundaryReturn = {
    /** Relayout boundary node id for the given node. */
    nodeId: NodeId;
  };
}
/** This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles) have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). A client can also keep track of stylesheets via the <code>styleSheetAdded</code>/<code>styleSheetRemoved</code> events and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods. */
export class CSS {
  private _mediaQueryResultChanged: CSS.MediaQueryResultChangedHandler | null = null;
  private _fontsUpdated: CSS.FontsUpdatedHandler | null = null;
  private _styleSheetChanged: CSS.StyleSheetChangedHandler | null = null;
  private _styleSheetAdded: CSS.StyleSheetAddedHandler | null = null;
  private _styleSheetRemoved: CSS.StyleSheetRemovedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received. */
  public enable() {
    return this._client.send<void>("CSS.enable");
  }
  /** Disables the CSS agent for the given page. */
  public disable() {
    return this._client.send<void>("CSS.disable");
  }
  /** Returns requested styles for a DOM node identified by <code>nodeId</code>. */
  public getMatchedStylesForNode(params: CSS.GetMatchedStylesForNodeParameters) {
    return this._client.send<CSS.GetMatchedStylesForNodeReturn>("CSS.getMatchedStylesForNode", params);
  }
  /** Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>. */
  public getInlineStylesForNode(params: CSS.GetInlineStylesForNodeParameters) {
    return this._client.send<CSS.GetInlineStylesForNodeReturn>("CSS.getInlineStylesForNode", params);
  }
  /** Returns the computed style for a DOM node identified by <code>nodeId</code>. */
  public getComputedStyleForNode(params: CSS.GetComputedStyleForNodeParameters) {
    return this._client.send<CSS.GetComputedStyleForNodeReturn>("CSS.getComputedStyleForNode", params);
  }
  /** Requests information about platform fonts which we used to render child TextNodes in the given node. */
  public getPlatformFontsForNode(params: CSS.GetPlatformFontsForNodeParameters) {
    return this._client.send<CSS.GetPlatformFontsForNodeReturn>("CSS.getPlatformFontsForNode", params);
  }
  /** Returns the current textual content and the URL for a stylesheet. */
  public getStyleSheetText(params: CSS.GetStyleSheetTextParameters) {
    return this._client.send<CSS.GetStyleSheetTextReturn>("CSS.getStyleSheetText", params);
  }
  /** Returns all class names from specified stylesheet. */
  public collectClassNames(params: CSS.CollectClassNamesParameters) {
    return this._client.send<CSS.CollectClassNamesReturn>("CSS.collectClassNames", params);
  }
  /** Sets the new stylesheet text. */
  public setStyleSheetText(params: CSS.SetStyleSheetTextParameters) {
    return this._client.send<CSS.SetStyleSheetTextReturn>("CSS.setStyleSheetText", params);
  }
  /** Modifies the rule selector. */
  public setRuleSelector(params: CSS.SetRuleSelectorParameters) {
    return this._client.send<CSS.SetRuleSelectorReturn>("CSS.setRuleSelector", params);
  }
  /** Modifies the keyframe rule key text. */
  public setKeyframeKey(params: CSS.SetKeyframeKeyParameters) {
    return this._client.send<CSS.SetKeyframeKeyReturn>("CSS.setKeyframeKey", params);
  }
  /** Applies specified style edits one after another in the given order. */
  public setStyleTexts(params: CSS.SetStyleTextsParameters) {
    return this._client.send<CSS.SetStyleTextsReturn>("CSS.setStyleTexts", params);
  }
  /** Modifies the rule selector. */
  public setMediaText(params: CSS.SetMediaTextParameters) {
    return this._client.send<CSS.SetMediaTextReturn>("CSS.setMediaText", params);
  }
  /** Creates a new special "via-inspector" stylesheet in the frame with given <code>frameId</code>. */
  public createStyleSheet(params: CSS.CreateStyleSheetParameters) {
    return this._client.send<CSS.CreateStyleSheetReturn>("CSS.createStyleSheet", params);
  }
  /** Inserts a new rule with the given <code>ruleText</code> in a stylesheet with given <code>styleSheetId</code>, at the position specified by <code>location</code>. */
  public addRule(params: CSS.AddRuleParameters) {
    return this._client.send<CSS.AddRuleReturn>("CSS.addRule", params);
  }
  /** Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser. */
  public forcePseudoState(params: CSS.ForcePseudoStateParameters) {
    return this._client.send<void>("CSS.forcePseudoState", params);
  }
  /** Returns all media queries parsed by the rendering engine. */
  public getMediaQueries() {
    return this._client.send<CSS.GetMediaQueriesReturn>("CSS.getMediaQueries");
  }
  /** Find a rule with the given active property for the given node and set the new value for this property */
  public setEffectivePropertyValueForNode(params: CSS.SetEffectivePropertyValueForNodeParameters) {
    return this._client.send<void>("CSS.setEffectivePropertyValueForNode", params);
  }
  public getBackgroundColors(params: CSS.GetBackgroundColorsParameters) {
    return this._client.send<CSS.GetBackgroundColorsReturn>("CSS.getBackgroundColors", params);
  }
  /** Enables the selector recording. */
  public startRuleUsageTracking() {
    return this._client.send<void>("CSS.startRuleUsageTracking");
  }
  /** Obtain list of rules that became used since last call to this method (or since start of coverage instrumentation) */
  public takeCoverageDelta() {
    return this._client.send<CSS.TakeCoverageDeltaReturn>("CSS.takeCoverageDelta");
  }
  /** The list of rules with an indication of whether these were used */
  public stopRuleUsageTracking() {
    return this._client.send<CSS.StopRuleUsageTrackingReturn>("CSS.stopRuleUsageTracking");
  }
  /** Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features. */
  get mediaQueryResultChanged() {
    return this._mediaQueryResultChanged;
  }
  set mediaQueryResultChanged(handler) {
    if (this._mediaQueryResultChanged) {
      this._client.removeListener("CSS.mediaQueryResultChanged", this._mediaQueryResultChanged);
    }
    this._mediaQueryResultChanged = handler;
    if (handler) {
      this._client.on("CSS.mediaQueryResultChanged", handler);
    }
  }
  /** Fires whenever a web font gets loaded. */
  get fontsUpdated() {
    return this._fontsUpdated;
  }
  set fontsUpdated(handler) {
    if (this._fontsUpdated) {
      this._client.removeListener("CSS.fontsUpdated", this._fontsUpdated);
    }
    this._fontsUpdated = handler;
    if (handler) {
      this._client.on("CSS.fontsUpdated", handler);
    }
  }
  /** Fired whenever a stylesheet is changed as a result of the client operation. */
  get styleSheetChanged() {
    return this._styleSheetChanged;
  }
  set styleSheetChanged(handler) {
    if (this._styleSheetChanged) {
      this._client.removeListener("CSS.styleSheetChanged", this._styleSheetChanged);
    }
    this._styleSheetChanged = handler;
    if (handler) {
      this._client.on("CSS.styleSheetChanged", handler);
    }
  }
  /** Fired whenever an active document stylesheet is added. */
  get styleSheetAdded() {
    return this._styleSheetAdded;
  }
  set styleSheetAdded(handler) {
    if (this._styleSheetAdded) {
      this._client.removeListener("CSS.styleSheetAdded", this._styleSheetAdded);
    }
    this._styleSheetAdded = handler;
    if (handler) {
      this._client.on("CSS.styleSheetAdded", handler);
    }
  }
  /** Fired whenever an active document stylesheet is removed. */
  get styleSheetRemoved() {
    return this._styleSheetRemoved;
  }
  set styleSheetRemoved(handler) {
    if (this._styleSheetRemoved) {
      this._client.removeListener("CSS.styleSheetRemoved", this._styleSheetRemoved);
    }
    this._styleSheetRemoved = handler;
    if (handler) {
      this._client.on("CSS.styleSheetRemoved", handler);
    }
  }
}
export namespace CSS {
  export type StyleSheetId = string;
  /** Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets. */
  export type StyleSheetOrigin = "injected" | "user-agent" | "inspector" | "regular";
  /** CSS rule collection for a single pseudo style. */
  export interface PseudoElementMatches {
    /** Pseudo element type. */
    pseudoType: DOM.PseudoType;
    /** Matches of CSS rules applicable to the pseudo style. */
    matches: RuleMatch[];
  }
  /** Inherited CSS rule collection from ancestor node. */
  export interface InheritedStyleEntry {
    /** The ancestor node's inline style, if any, in the style inheritance chain. */
    inlineStyle?: CSSStyle;
    /** Matches of CSS rules matching the ancestor node in the style inheritance chain. */
    matchedCSSRules: RuleMatch[];
  }
  /** Match data for a CSS rule. */
  export interface RuleMatch {
    /** CSS rule in the match. */
    rule: CSSRule;
    /** Matching selector indices in the rule's selectorList selectors (0-based). */
    matchingSelectors: number[];
  }
  /** Data for a simple selector (these are delimited by commas in a selector list). */
  export interface Value {
    /** Value text. */
    text: string;
    /** Value range in the underlying resource (if available). */
    range?: SourceRange;
  }
  /** Selector list data. */
  export interface SelectorList {
    /** Selectors in the list. */
    selectors: Value[];
    /** Rule selector text. */
    text: string;
  }
  /** CSS stylesheet metainformation. */
  export interface CSSStyleSheetHeader {
    /** The stylesheet identifier. */
    styleSheetId: StyleSheetId;
    /** Owner frame identifier. */
    frameId: Page.FrameId;
    /** Stylesheet resource URL. */
    sourceURL: string;
    /** URL of source map associated with the stylesheet (if any). */
    sourceMapURL?: string;
    /** Stylesheet origin. */
    origin: StyleSheetOrigin;
    /** Stylesheet title. */
    title: string;
    /** The backend id for the owner node of the stylesheet. */
    ownerNode?: DOM.BackendNodeId;
    /** Denotes whether the stylesheet is disabled. */
    disabled: boolean;
    /** Whether the sourceURL field value comes from the sourceURL comment. */
    hasSourceURL?: boolean;
    /** Whether this stylesheet is created for STYLE tag by parser. This flag is not set for document.written STYLE tags. */
    isInline: boolean;
    /** Line offset of the stylesheet within the resource (zero based). */
    startLine: number;
    /** Column offset of the stylesheet within the resource (zero based). */
    startColumn: number;
    /** Size of the content (in characters). */
    length: number;
  }
  /** CSS rule representation. */
  export interface CSSRule {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** Rule selector data. */
    selectorList: SelectorList;
    /** Parent stylesheet's origin. */
    origin: StyleSheetOrigin;
    /** Associated style declaration. */
    style: CSSStyle;
    /** Media list array (for rules involving media queries). The array enumerates media queries starting with the innermost one, going outwards. */
    media?: CSSMedia[];
  }
  /** CSS coverage information. */
  export interface RuleUsage {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId: StyleSheetId;
    /** Offset of the start of the rule (including selector) from the beginning of the stylesheet. */
    startOffset: number;
    /** Offset of the end of the rule body from the beginning of the stylesheet. */
    endOffset: number;
    /** Indicates whether the rule was actually used by some element in the page. */
    used: boolean;
  }
  /** Text range within a resource. All numbers are zero-based. */
  export interface SourceRange {
    /** Start line of range. */
    startLine: number;
    /** Start column of range (inclusive). */
    startColumn: number;
    /** End line of range */
    endLine: number;
    /** End column of range (exclusive). */
    endColumn: number;
  }
  export interface ShorthandEntry {
    /** Shorthand name. */
    name: string;
    /** Shorthand value. */
    value: string;
    /** Whether the property has "!important" annotation (implies <code>false</code> if absent). */
    important?: boolean;
  }
  export interface CSSComputedStyleProperty {
    /** Computed style property name. */
    name: string;
    /** Computed style property value. */
    value: string;
  }
  /** CSS style representation. */
  export interface CSSStyle {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** CSS properties in the style. */
    cssProperties: CSSProperty[];
    /** Computed values for all shorthands found in the style. */
    shorthandEntries: ShorthandEntry[];
    /** Style declaration text (if available). */
    cssText?: string;
    /** Style declaration range in the enclosing stylesheet (if available). */
    range?: SourceRange;
  }
  /** CSS property declaration data. */
  export interface CSSProperty {
    /** The property name. */
    name: string;
    /** The property value. */
    value: string;
    /** Whether the property has "!important" annotation (implies <code>false</code> if absent). */
    important?: boolean;
    /** Whether the property is implicit (implies <code>false</code> if absent). */
    implicit?: boolean;
    /** The full property text as specified in the style. */
    text?: string;
    /** Whether the property is understood by the browser (implies <code>true</code> if absent). */
    parsedOk?: boolean;
    /** Whether the property is disabled by the user (present for source-based properties only). */
    disabled?: boolean;
    /** The entire property range in the enclosing style declaration (if available). */
    range?: SourceRange;
  }
  /** CSS media rule descriptor. */
  export interface CSSMedia {
    /** Media query text. */
    text: string;
    /** Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline stylesheet's STYLE tag. */
    source: "mediaRule" | "importRule" | "linkedSheet" | "inlineSheet";
    /** URL of the document containing the media query description. */
    sourceURL?: string;
    /** The associated rule (@media or @import) header range in the enclosing stylesheet (if available). */
    range?: SourceRange;
    /** Identifier of the stylesheet containing this object (if exists). */
    styleSheetId?: StyleSheetId;
    /** Array of media queries. */
    mediaList?: MediaQuery[];
  }
  /** Media query descriptor. */
  export interface MediaQuery {
    /** Array of media query expressions. */
    expressions: MediaQueryExpression[];
    /** Whether the media query condition is satisfied. */
    active: boolean;
  }
  /** Media query expression descriptor. */
  export interface MediaQueryExpression {
    /** Media query expression value. */
    value: number;
    /** Media query expression units. */
    unit: string;
    /** Media query expression feature. */
    feature: string;
    /** The associated range of the value text in the enclosing stylesheet (if available). */
    valueRange?: SourceRange;
    /** Computed length of media query expression (if applicable). */
    computedLength?: number;
  }
  /** Information about amount of glyphs that were rendered with given font. */
  export interface PlatformFontUsage {
    /** Font's family name reported by platform. */
    familyName: string;
    /** Indicates if the font was downloaded or resolved locally. */
    isCustomFont: boolean;
    /** Amount of glyphs that were rendered with this font. */
    glyphCount: number;
  }
  /** CSS keyframes rule representation. */
  export interface CSSKeyframesRule {
    /** Animation name. */
    animationName: Value;
    /** List of keyframes. */
    keyframes: CSSKeyframeRule[];
  }
  /** CSS keyframe rule representation. */
  export interface CSSKeyframeRule {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** Parent stylesheet's origin. */
    origin: StyleSheetOrigin;
    /** Associated key text. */
    keyText: Value;
    /** Associated style declaration. */
    style: CSSStyle;
  }
  /** A descriptor of operation to mutate style declaration text. */
  export interface StyleDeclarationEdit {
    /** The css style sheet identifier. */
    styleSheetId: StyleSheetId;
    /** The range of the style text in the enclosing stylesheet. */
    range: SourceRange;
    /** New style text. */
    text: string;
  }
  /** Details of post layout rendered text positions. The exact layout should not be regarded as stable and may change between versions. */
  export interface InlineTextBox {
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** The starting index in characters, for this post layout textbox substring. */
    startCharacterIndex: number;
    /** The number of characters in this post layout textbox substring. */
    numCharacters: number;
  }
  export type MediaQueryResultChangedHandler = () => void;
  export type FontsUpdatedHandler = () => void;
  export type StyleSheetChangedParameters = {
    styleSheetId: StyleSheetId;
  };
  export type StyleSheetChangedHandler = (params: StyleSheetChangedParameters) => void;
  export type StyleSheetAddedParameters = {
    /** Added stylesheet metainfo. */
    header: CSSStyleSheetHeader;
  };
  export type StyleSheetAddedHandler = (params: StyleSheetAddedParameters) => void;
  export type StyleSheetRemovedParameters = {
    /** Identifier of the removed stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type StyleSheetRemovedHandler = (params: StyleSheetRemovedParameters) => void;
  export type GetMatchedStylesForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetMatchedStylesForNodeReturn = {
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSSStyle;
    /** CSS rules matching this node, from all applicable stylesheets. */
    matchedCSSRules?: RuleMatch[];
    /** Pseudo style matches for this node. */
    pseudoElements?: PseudoElementMatches[];
    /** A chain of inherited styles (from the immediate node parent up to the DOM tree root). */
    inherited?: InheritedStyleEntry[];
    /** A list of CSS keyframed animations matching this node. */
    cssKeyframesRules?: CSSKeyframesRule[];
  };
  export type GetInlineStylesForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetInlineStylesForNodeReturn = {
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSSStyle;
  };
  export type GetComputedStyleForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetComputedStyleForNodeReturn = {
    /** Computed style for the specified DOM node. */
    computedStyle: CSSComputedStyleProperty[];
  };
  export type GetPlatformFontsForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetPlatformFontsForNodeReturn = {
    /** Usage statistics for every employed platform font. */
    fonts: PlatformFontUsage[];
  };
  export type GetStyleSheetTextParameters = {
    styleSheetId: StyleSheetId;
  };
  export type GetStyleSheetTextReturn = {
    /** The stylesheet text. */
    text: string;
  };
  export type CollectClassNamesParameters = {
    styleSheetId: StyleSheetId;
  };
  export type CollectClassNamesReturn = {
    /** Class name list. */
    classNames: string[];
  };
  export type SetStyleSheetTextParameters = {
    styleSheetId: StyleSheetId;
    text: string;
  };
  export type SetStyleSheetTextReturn = {
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
  };
  export type SetRuleSelectorParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    selector: string;
  };
  export type SetRuleSelectorReturn = {
    /** The resulting selector list after modification. */
    selectorList: SelectorList;
  };
  export type SetKeyframeKeyParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    keyText: string;
  };
  export type SetKeyframeKeyReturn = {
    /** The resulting key text after modification. */
    keyText: Value;
  };
  export type SetStyleTextsParameters = {
    edits: StyleDeclarationEdit[];
  };
  export type SetStyleTextsReturn = {
    /** The resulting styles after modification. */
    styles: CSSStyle[];
  };
  export type SetMediaTextParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    text: string;
  };
  export type SetMediaTextReturn = {
    /** The resulting CSS media rule after modification. */
    media: CSSMedia;
  };
  export type CreateStyleSheetParameters = {
    /** Identifier of the frame where "via-inspector" stylesheet should be created. */
    frameId: Page.FrameId;
  };
  export type CreateStyleSheetReturn = {
    /** Identifier of the created "via-inspector" stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type AddRuleParameters = {
    /** The css style sheet identifier where a new rule should be inserted. */
    styleSheetId: StyleSheetId;
    /** The text of a new rule. */
    ruleText: string;
    /** Text position of a new rule in the target style sheet. */
    location: SourceRange;
  };
  export type AddRuleReturn = {
    /** The newly created rule. */
    rule: CSSRule;
  };
  export type ForcePseudoStateParameters = {
    /** The element id for which to force the pseudo state. */
    nodeId: DOM.NodeId;
    /** Element pseudo classes to force when computing the element's style. */
    forcedPseudoClasses: Array<"active" | "focus" | "hover" | "visited">;
  };
  export type GetMediaQueriesReturn = {
    medias: CSSMedia[];
  };
  export type SetEffectivePropertyValueForNodeParameters = {
    /** The element id for which to set property. */
    nodeId: DOM.NodeId;
    propertyName: string;
    value: string;
  };
  export type GetBackgroundColorsParameters = {
    /** Id of the node to get background colors for. */
    nodeId: DOM.NodeId;
  };
  export type GetBackgroundColorsReturn = {
    /** The range of background colors behind this element, if it contains any visible text. If no visible text is present, this will be undefined. In the case of a flat background color, this will consist of simply that color. In the case of a gradient, this will consist of each of the color stops. For anything more complicated, this will be an empty array. Images will be ignored (as if the image had failed to load). */
    backgroundColors?: string[];
  };
  export type TakeCoverageDeltaReturn = {
    coverage: RuleUsage[];
  };
  export type StopRuleUsageTrackingReturn = {
    ruleUsage: RuleUsage[];
  };
}
/** This domain facilitates obtaining document snapshots with DOM, layout, and style information. */
export class DOMSnapshot {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns a document snapshot, including the full DOM tree of the root node (including iframes, template contents, and imported documents) in a flattened array, as well as layout and white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is flattened.  */
  public getSnapshot(params: DOMSnapshot.GetSnapshotParameters) {
    return this._client.send<DOMSnapshot.GetSnapshotReturn>("DOMSnapshot.getSnapshot", params);
  }
}
export namespace DOMSnapshot {
  /** A Node in the DOM tree. */
  export interface DOMNode {
    /** <code>Node</code>'s nodeType. */
    nodeType: number;
    /** <code>Node</code>'s nodeName. */
    nodeName: string;
    /** <code>Node</code>'s nodeValue. */
    nodeValue: string;
    /** Only set for textarea elements, contains the text value. */
    textValue?: string;
    /** Only set for input elements, contains the input's associated text value. */
    inputValue?: string;
    /** Only set for radio and checkbox input elements, indicates if the element has been checked */
    inputChecked?: boolean;
    /** Only set for option elements, indicates if the element has been selected */
    optionSelected?: boolean;
    /** <code>Node</code>'s id, corresponds to DOM.Node.backendNodeId. */
    backendNodeId: DOM.BackendNodeId;
    /** The indexes of the node's child nodes in the <code>domNodes</code> array returned by <code>getSnapshot</code>, if any. */
    childNodeIndexes?: number[];
    /** Attributes of an <code>Element</code> node. */
    attributes?: NameValue[];
    /** Indexes of pseudo elements associated with this node in the <code>domNodes</code> array returned by <code>getSnapshot</code>, if any. */
    pseudoElementIndexes?: number[];
    /** The index of the node's related layout tree node in the <code>layoutTreeNodes</code> array returned by <code>getSnapshot</code>, if any. */
    layoutNodeIndex?: number;
    /** Document URL that <code>Document</code> or <code>FrameOwner</code> node points to. */
    documentURL?: string;
    /** Base URL that <code>Document</code> or <code>FrameOwner</code> node uses for URL completion. */
    baseURL?: string;
    /** Only set for documents, contains the document's content language. */
    contentLanguage?: string;
    /** <code>DocumentType</code> node's publicId. */
    publicId?: string;
    /** <code>DocumentType</code> node's systemId. */
    systemId?: string;
    /** Frame ID for frame owner elements. */
    frameId?: Page.FrameId;
    /** The index of a frame owner element's content document in the <code>domNodes</code> array returned by <code>getSnapshot</code>, if any. */
    contentDocumentIndex?: number;
    /** Index of the imported document's node of a link element in the <code>domNodes</code> array returned by <code>getSnapshot</code>, if any. */
    importedDocumentIndex?: number;
    /** Index of the content node of a template element in the <code>domNodes</code> array returned by <code>getSnapshot</code>. */
    templateContentIndex?: number;
    /** Type of a pseudo element node. */
    pseudoType?: DOM.PseudoType;
    /** Whether this DOM node responds to mouse clicks. This includes nodes that have had click event listeners attached via JavaScript as well as anchor tags that naturally navigate when clicked. */
    isClickable?: boolean;
  }
  /** Details of an element in the DOM tree with a LayoutObject. */
  export interface LayoutTreeNode {
    /** The index of the related DOM node in the <code>domNodes</code> array returned by <code>getSnapshot</code>. */
    domNodeIndex: number;
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** Contents of the LayoutText, if any. */
    layoutText?: string;
    /** The post-layout inline text nodes, if any. */
    inlineTextNodes?: CSS.InlineTextBox[];
    /** Index into the <code>computedStyles</code> array returned by <code>getSnapshot</code>. */
    styleIndex?: number;
  }
  /** A subset of the full ComputedStyle as defined by the request whitelist. */
  export interface ComputedStyle {
    /** Name/value pairs of computed style properties. */
    properties: NameValue[];
  }
  /** A name/value pair. */
  export interface NameValue {
    /** Attribute/property name. */
    name: string;
    /** Attribute/property value. */
    value: string;
  }
  export type GetSnapshotParameters = {
    /** Whitelist of computed styles to return. */
    computedStyleWhitelist: string[];
  };
  export type GetSnapshotReturn = {
    /** The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document. */
    domNodes: DOMNode[];
    /** The nodes in the layout tree. */
    layoutTreeNodes: LayoutTreeNode[];
    /** Whitelisted ComputedStyle properties for each node in the layout tree. */
    computedStyles: ComputedStyle[];
  };
}
/** Input/Output operations for streams produced by DevTools. */
export class IO {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Read a chunk of the stream */
  public read(params: IO.ReadParameters) {
    return this._client.send<IO.ReadReturn>("IO.read", params);
  }
  /** Close the stream, discard any temporary backing storage. */
  public close(params: IO.CloseParameters) {
    return this._client.send<void>("IO.close", params);
  }
}
export namespace IO {
  export type StreamHandle = string;
  export type ReadParameters = {
    /** Handle of the stream to read. */
    handle: StreamHandle;
    /** Seek to the specified offset before reading (if not specificed, proceed with offset following the last read). */
    offset?: number;
    /** Maximum number of bytes to read (left upon the agent discretion if not specified). */
    size?: number;
  };
  export type ReadReturn = {
    /** Data that were read. */
    data: string;
    /** Set if the end-of-file condition occured while reading. */
    eof: boolean;
  };
  export type CloseParameters = {
    /** Handle of the stream to close. */
    handle: StreamHandle;
  };
}
/** DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set. */
export class DOMDebugger {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Sets breakpoint on particular operation with DOM. */
  public setDOMBreakpoint(params: DOMDebugger.SetDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setDOMBreakpoint", params);
  }
  /** Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>. */
  public removeDOMBreakpoint(params: DOMDebugger.RemoveDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeDOMBreakpoint", params);
  }
  /** Sets breakpoint on particular DOM event. */
  public setEventListenerBreakpoint(params: DOMDebugger.SetEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setEventListenerBreakpoint", params);
  }
  /** Removes breakpoint on particular DOM event. */
  public removeEventListenerBreakpoint(params: DOMDebugger.RemoveEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeEventListenerBreakpoint", params);
  }
  /** Sets breakpoint on particular native event. */
  public setInstrumentationBreakpoint(params: DOMDebugger.SetInstrumentationBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setInstrumentationBreakpoint", params);
  }
  /** Removes breakpoint on particular native event. */
  public removeInstrumentationBreakpoint(params: DOMDebugger.RemoveInstrumentationBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeInstrumentationBreakpoint", params);
  }
  /** Sets breakpoint on XMLHttpRequest. */
  public setXHRBreakpoint(params: DOMDebugger.SetXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setXHRBreakpoint", params);
  }
  /** Removes breakpoint from XMLHttpRequest. */
  public removeXHRBreakpoint(params: DOMDebugger.RemoveXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeXHRBreakpoint", params);
  }
  /** Returns event listeners of the given object. */
  public getEventListeners(params: DOMDebugger.GetEventListenersParameters) {
    return this._client.send<DOMDebugger.GetEventListenersReturn>("DOMDebugger.getEventListeners", params);
  }
}
export namespace DOMDebugger {
  /** DOM breakpoint type. */
  export type DOMBreakpointType = "subtree-modified" | "attribute-modified" | "node-removed";
  /** Object event listener. */
  export interface EventListener {
    /** <code>EventListener</code>'s type. */
    type: string;
    /** <code>EventListener</code>'s useCapture. */
    useCapture: boolean;
    /** <code>EventListener</code>'s passive flag. */
    passive: boolean;
    /** <code>EventListener</code>'s once flag. */
    once: boolean;
    /** Script id of the handler code. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber: number;
    /** Event handler function value. */
    handler?: Runtime.RemoteObject;
    /** Event original handler function value. */
    originalHandler?: Runtime.RemoteObject;
    /** Node the listener is added to (if any). */
    backendNodeId?: DOM.BackendNodeId;
  }
  export type SetDOMBreakpointParameters = {
    /** Identifier of the node to set breakpoint on. */
    nodeId: DOM.NodeId;
    /** Type of the operation to stop upon. */
    type: DOMBreakpointType;
  };
  export type RemoveDOMBreakpointParameters = {
    /** Identifier of the node to remove breakpoint from. */
    nodeId: DOM.NodeId;
    /** Type of the breakpoint to remove. */
    type: DOMBreakpointType;
  };
  export type SetEventListenerBreakpointParameters = {
    /** DOM Event name to stop on (any DOM event will do). */
    eventName: string;
    /** EventTarget interface name to stop on. If equal to <code>"*"</code> or not provided, will stop on any EventTarget. */
    targetName?: string;
  };
  export type RemoveEventListenerBreakpointParameters = {
    /** Event name. */
    eventName: string;
    /** EventTarget interface name. */
    targetName?: string;
  };
  export type SetInstrumentationBreakpointParameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type RemoveInstrumentationBreakpointParameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type SetXHRBreakpointParameters = {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  };
  export type RemoveXHRBreakpointParameters = {
    /** Resource URL substring. */
    url: string;
  };
  export type GetEventListenersParameters = {
    /** Identifier of the object to return listeners for. */
    objectId: Runtime.RemoteObjectId;
    /** The maximum depth at which Node children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). Reports listeners for all contexts if pierce is enabled. */
    pierce?: boolean;
  };
  export type GetEventListenersReturn = {
    /** Array of relevant listeners. */
    listeners: EventListener[];
  };
}
/** Supports additional targets discovery and allows to attach to them. */
export class Target {
  private _targetCreated: Target.TargetCreatedHandler | null = null;
  private _targetInfoChanged: Target.TargetInfoChangedHandler | null = null;
  private _targetDestroyed: Target.TargetDestroyedHandler | null = null;
  private _attachedToTarget: Target.AttachedToTargetHandler | null = null;
  private _detachedFromTarget: Target.DetachedFromTargetHandler | null = null;
  private _receivedMessageFromTarget: Target.ReceivedMessageFromTargetHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Controls whether to discover available targets and notify via <code>targetCreated/targetInfoChanged/targetDestroyed</code> events. */
  public setDiscoverTargets(params: Target.SetDiscoverTargetsParameters) {
    return this._client.send<void>("Target.setDiscoverTargets", params);
  }
  /** Controls whether to automatically attach to new targets which are considered to be related to this one. When turned on, attaches to all existing related targets as well. When turned off, automatically detaches from all currently attached targets. */
  public setAutoAttach(params: Target.SetAutoAttachParameters) {
    return this._client.send<void>("Target.setAutoAttach", params);
  }
  public setAttachToFrames(params: Target.SetAttachToFramesParameters) {
    return this._client.send<void>("Target.setAttachToFrames", params);
  }
  /** Enables target discovery for the specified locations, when <code>setDiscoverTargets</code> was set to <code>true</code>. */
  public setRemoteLocations(params: Target.SetRemoteLocationsParameters) {
    return this._client.send<void>("Target.setRemoteLocations", params);
  }
  /** Sends protocol message to the target with given id. */
  public sendMessageToTarget(params: Target.SendMessageToTargetParameters) {
    return this._client.send<void>("Target.sendMessageToTarget", params);
  }
  /** Returns information about a target. */
  public getTargetInfo(params: Target.GetTargetInfoParameters) {
    return this._client.send<Target.GetTargetInfoReturn>("Target.getTargetInfo", params);
  }
  /** Activates (focuses) the target. */
  public activateTarget(params: Target.ActivateTargetParameters) {
    return this._client.send<void>("Target.activateTarget", params);
  }
  /** Closes the target. If the target is a page that gets closed too. */
  public closeTarget(params: Target.CloseTargetParameters) {
    return this._client.send<Target.CloseTargetReturn>("Target.closeTarget", params);
  }
  /** Attaches to the target with given id. */
  public attachToTarget(params: Target.AttachToTargetParameters) {
    return this._client.send<Target.AttachToTargetReturn>("Target.attachToTarget", params);
  }
  /** Detaches from the target with given id. */
  public detachFromTarget(params: Target.DetachFromTargetParameters) {
    return this._client.send<void>("Target.detachFromTarget", params);
  }
  /** Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than one. */
  public createBrowserContext() {
    return this._client.send<Target.CreateBrowserContextReturn>("Target.createBrowserContext");
  }
  /** Deletes a BrowserContext, will fail of any open page uses it. */
  public disposeBrowserContext(params: Target.DisposeBrowserContextParameters) {
    return this._client.send<Target.DisposeBrowserContextReturn>("Target.disposeBrowserContext", params);
  }
  /** Creates a new page. */
  public createTarget(params: Target.CreateTargetParameters) {
    return this._client.send<Target.CreateTargetReturn>("Target.createTarget", params);
  }
  /** Retrieves a list of available targets. */
  public getTargets() {
    return this._client.send<Target.GetTargetsReturn>("Target.getTargets");
  }
  /** Issued when a possible inspection target is created. */
  get targetCreated() {
    return this._targetCreated;
  }
  set targetCreated(handler) {
    if (this._targetCreated) {
      this._client.removeListener("Target.targetCreated", this._targetCreated);
    }
    this._targetCreated = handler;
    if (handler) {
      this._client.on("Target.targetCreated", handler);
    }
  }
  /** Issued when some information about a target has changed. This only happens between <code>targetCreated</code> and <code>targetDestroyed</code>. */
  get targetInfoChanged() {
    return this._targetInfoChanged;
  }
  set targetInfoChanged(handler) {
    if (this._targetInfoChanged) {
      this._client.removeListener("Target.targetInfoChanged", this._targetInfoChanged);
    }
    this._targetInfoChanged = handler;
    if (handler) {
      this._client.on("Target.targetInfoChanged", handler);
    }
  }
  /** Issued when a target is destroyed. */
  get targetDestroyed() {
    return this._targetDestroyed;
  }
  set targetDestroyed(handler) {
    if (this._targetDestroyed) {
      this._client.removeListener("Target.targetDestroyed", this._targetDestroyed);
    }
    this._targetDestroyed = handler;
    if (handler) {
      this._client.on("Target.targetDestroyed", handler);
    }
  }
  /** Issued when attached to target because of auto-attach or <code>attachToTarget</code> command. */
  get attachedToTarget() {
    return this._attachedToTarget;
  }
  set attachedToTarget(handler) {
    if (this._attachedToTarget) {
      this._client.removeListener("Target.attachedToTarget", this._attachedToTarget);
    }
    this._attachedToTarget = handler;
    if (handler) {
      this._client.on("Target.attachedToTarget", handler);
    }
  }
  /** Issued when detached from target for any reason (including <code>detachFromTarget</code> command). */
  get detachedFromTarget() {
    return this._detachedFromTarget;
  }
  set detachedFromTarget(handler) {
    if (this._detachedFromTarget) {
      this._client.removeListener("Target.detachedFromTarget", this._detachedFromTarget);
    }
    this._detachedFromTarget = handler;
    if (handler) {
      this._client.on("Target.detachedFromTarget", handler);
    }
  }
  /** Notifies about new protocol message from attached target. */
  get receivedMessageFromTarget() {
    return this._receivedMessageFromTarget;
  }
  set receivedMessageFromTarget(handler) {
    if (this._receivedMessageFromTarget) {
      this._client.removeListener("Target.receivedMessageFromTarget", this._receivedMessageFromTarget);
    }
    this._receivedMessageFromTarget = handler;
    if (handler) {
      this._client.on("Target.receivedMessageFromTarget", handler);
    }
  }
}
export namespace Target {
  export type TargetID = string;
  export type BrowserContextID = string;
  export interface TargetInfo {
    targetId: TargetID;
    type: string;
    title: string;
    url: string;
    /** Whether the target has an attached client. */
    attached: boolean;
  }
  export interface RemoteLocation {
    host: string;
    port: number;
  }
  export type TargetCreatedParameters = {
    targetInfo: TargetInfo;
  };
  export type TargetCreatedHandler = (params: TargetCreatedParameters) => void;
  export type TargetInfoChangedParameters = {
    targetInfo: TargetInfo;
  };
  export type TargetInfoChangedHandler = (params: TargetInfoChangedParameters) => void;
  export type TargetDestroyedParameters = {
    targetId: TargetID;
  };
  export type TargetDestroyedHandler = (params: TargetDestroyedParameters) => void;
  export type AttachedToTargetParameters = {
    targetInfo: TargetInfo;
    waitingForDebugger: boolean;
  };
  export type AttachedToTargetHandler = (params: AttachedToTargetParameters) => void;
  export type DetachedFromTargetParameters = {
    targetId: TargetID;
  };
  export type DetachedFromTargetHandler = (params: DetachedFromTargetParameters) => void;
  export type ReceivedMessageFromTargetParameters = {
    targetId: TargetID;
    message: string;
  };
  export type ReceivedMessageFromTargetHandler = (params: ReceivedMessageFromTargetParameters) => void;
  export type SetDiscoverTargetsParameters = {
    /** Whether to discover available targets. */
    discover: boolean;
  };
  export type SetAutoAttachParameters = {
    /** Whether to auto-attach to related targets. */
    autoAttach: boolean;
    /** Whether to pause new targets when attaching to them. Use <code>Runtime.runIfWaitingForDebugger</code> to run paused targets. */
    waitForDebuggerOnStart: boolean;
  };
  export type SetAttachToFramesParameters = {
    /** Whether to attach to frames. */
    value: boolean;
  };
  export type SetRemoteLocationsParameters = {
    /** List of remote locations. */
    locations: RemoteLocation[];
  };
  export type SendMessageToTargetParameters = {
    targetId: TargetID;
    message: string;
  };
  export type GetTargetInfoParameters = {
    targetId: TargetID;
  };
  export type GetTargetInfoReturn = {
    targetInfo: TargetInfo;
  };
  export type ActivateTargetParameters = {
    targetId: TargetID;
  };
  export type CloseTargetParameters = {
    targetId: TargetID;
  };
  export type CloseTargetReturn = {
    success: boolean;
  };
  export type AttachToTargetParameters = {
    targetId: TargetID;
  };
  export type AttachToTargetReturn = {
    /** Whether attach succeeded. */
    success: boolean;
  };
  export type DetachFromTargetParameters = {
    targetId: TargetID;
  };
  export type CreateBrowserContextReturn = {
    /** The id of the context created. */
    browserContextId: BrowserContextID;
  };
  export type DisposeBrowserContextParameters = {
    browserContextId: BrowserContextID;
  };
  export type DisposeBrowserContextReturn = {
    success: boolean;
  };
  export type CreateTargetParameters = {
    /** The initial URL the page will be navigated to. */
    url: string;
    /** Frame width in DIP (headless chrome only). */
    width?: number;
    /** Frame height in DIP (headless chrome only). */
    height?: number;
    /** The browser context to create the page in (headless chrome only). */
    browserContextId?: BrowserContextID;
  };
  export type CreateTargetReturn = {
    /** The id of the page opened. */
    targetId: TargetID;
  };
  export type GetTargetsReturn = {
    /** The list of targets. */
    targetInfos: TargetInfo[];
  };
}
export class ServiceWorker {
  private _workerRegistrationUpdated: ServiceWorker.WorkerRegistrationUpdatedHandler | null = null;
  private _workerVersionUpdated: ServiceWorker.WorkerVersionUpdatedHandler | null = null;
  private _workerErrorReported: ServiceWorker.WorkerErrorReportedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public enable() {
    return this._client.send<void>("ServiceWorker.enable");
  }
  public disable() {
    return this._client.send<void>("ServiceWorker.disable");
  }
  public unregister(params: ServiceWorker.UnregisterParameters) {
    return this._client.send<void>("ServiceWorker.unregister", params);
  }
  public updateRegistration(params: ServiceWorker.UpdateRegistrationParameters) {
    return this._client.send<void>("ServiceWorker.updateRegistration", params);
  }
  public startWorker(params: ServiceWorker.StartWorkerParameters) {
    return this._client.send<void>("ServiceWorker.startWorker", params);
  }
  public skipWaiting(params: ServiceWorker.SkipWaitingParameters) {
    return this._client.send<void>("ServiceWorker.skipWaiting", params);
  }
  public stopWorker(params: ServiceWorker.StopWorkerParameters) {
    return this._client.send<void>("ServiceWorker.stopWorker", params);
  }
  public inspectWorker(params: ServiceWorker.InspectWorkerParameters) {
    return this._client.send<void>("ServiceWorker.inspectWorker", params);
  }
  public setForceUpdateOnPageLoad(params: ServiceWorker.SetForceUpdateOnPageLoadParameters) {
    return this._client.send<void>("ServiceWorker.setForceUpdateOnPageLoad", params);
  }
  public deliverPushMessage(params: ServiceWorker.DeliverPushMessageParameters) {
    return this._client.send<void>("ServiceWorker.deliverPushMessage", params);
  }
  public dispatchSyncEvent(params: ServiceWorker.DispatchSyncEventParameters) {
    return this._client.send<void>("ServiceWorker.dispatchSyncEvent", params);
  }
  get workerRegistrationUpdated() {
    return this._workerRegistrationUpdated;
  }
  set workerRegistrationUpdated(handler) {
    if (this._workerRegistrationUpdated) {
      this._client.removeListener("ServiceWorker.workerRegistrationUpdated", this._workerRegistrationUpdated);
    }
    this._workerRegistrationUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerRegistrationUpdated", handler);
    }
  }
  get workerVersionUpdated() {
    return this._workerVersionUpdated;
  }
  set workerVersionUpdated(handler) {
    if (this._workerVersionUpdated) {
      this._client.removeListener("ServiceWorker.workerVersionUpdated", this._workerVersionUpdated);
    }
    this._workerVersionUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerVersionUpdated", handler);
    }
  }
  get workerErrorReported() {
    return this._workerErrorReported;
  }
  set workerErrorReported(handler) {
    if (this._workerErrorReported) {
      this._client.removeListener("ServiceWorker.workerErrorReported", this._workerErrorReported);
    }
    this._workerErrorReported = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerErrorReported", handler);
    }
  }
}
export namespace ServiceWorker {
  /** ServiceWorker registration. */
  export interface ServiceWorkerRegistration {
    registrationId: string;
    scopeURL: string;
    isDeleted: boolean;
  }
  export type ServiceWorkerVersionRunningStatus = "stopped" | "starting" | "running" | "stopping";
  export type ServiceWorkerVersionStatus = "new" | "installing" | "installed" | "activating" | "activated" | "redundant";
  /** ServiceWorker version. */
  export interface ServiceWorkerVersion {
    versionId: string;
    registrationId: string;
    scriptURL: string;
    runningStatus: ServiceWorkerVersionRunningStatus;
    status: ServiceWorkerVersionStatus;
    /** The Last-Modified header value of the main script. */
    scriptLastModified?: number;
    /** The time at which the response headers of the main script were received from the server.  For cached script it is the last time the cache entry was validated. */
    scriptResponseTime?: number;
    controlledClients?: Target.TargetID[];
    targetId?: Target.TargetID;
  }
  /** ServiceWorker error message. */
  export interface ServiceWorkerErrorMessage {
    errorMessage: string;
    registrationId: string;
    versionId: string;
    sourceURL: string;
    lineNumber: number;
    columnNumber: number;
  }
  export type WorkerRegistrationUpdatedParameters = {
    registrations: ServiceWorkerRegistration[];
  };
  export type WorkerRegistrationUpdatedHandler = (params: WorkerRegistrationUpdatedParameters) => void;
  export type WorkerVersionUpdatedParameters = {
    versions: ServiceWorkerVersion[];
  };
  export type WorkerVersionUpdatedHandler = (params: WorkerVersionUpdatedParameters) => void;
  export type WorkerErrorReportedParameters = {
    errorMessage: ServiceWorkerErrorMessage;
  };
  export type WorkerErrorReportedHandler = (params: WorkerErrorReportedParameters) => void;
  export type UnregisterParameters = {
    scopeURL: string;
  };
  export type UpdateRegistrationParameters = {
    scopeURL: string;
  };
  export type StartWorkerParameters = {
    scopeURL: string;
  };
  export type SkipWaitingParameters = {
    scopeURL: string;
  };
  export type StopWorkerParameters = {
    versionId: string;
  };
  export type InspectWorkerParameters = {
    versionId: string;
  };
  export type SetForceUpdateOnPageLoadParameters = {
    forceUpdateOnPageLoad: boolean;
  };
  export type DeliverPushMessageParameters = {
    origin: string;
    registrationId: string;
    data: string;
  };
  export type DispatchSyncEventParameters = {
    origin: string;
    registrationId: string;
    tag: string;
    lastChance: boolean;
  };
}
export class Input {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Ignores input events (useful while auditing page). */
  public setIgnoreInputEvents(params: Input.SetIgnoreInputEventsParameters) {
    return this._client.send<void>("Input.setIgnoreInputEvents", params);
  }
  /** Dispatches a key event to the page. */
  public dispatchKeyEvent(params: Input.DispatchKeyEventParameters) {
    return this._client.send<void>("Input.dispatchKeyEvent", params);
  }
  /** Dispatches a mouse event to the page. */
  public dispatchMouseEvent(params: Input.DispatchMouseEventParameters) {
    return this._client.send<void>("Input.dispatchMouseEvent", params);
  }
  /** Dispatches a touch event to the page. */
  public dispatchTouchEvent(params: Input.DispatchTouchEventParameters) {
    return this._client.send<void>("Input.dispatchTouchEvent", params);
  }
  /** Emulates touch event from the mouse event parameters. */
  public emulateTouchFromMouseEvent(params: Input.EmulateTouchFromMouseEventParameters) {
    return this._client.send<void>("Input.emulateTouchFromMouseEvent", params);
  }
  /** Synthesizes a pinch gesture over a time period by issuing appropriate touch events. */
  public synthesizePinchGesture(params: Input.SynthesizePinchGestureParameters) {
    return this._client.send<void>("Input.synthesizePinchGesture", params);
  }
  /** Synthesizes a scroll gesture over a time period by issuing appropriate touch events. */
  public synthesizeScrollGesture(params: Input.SynthesizeScrollGestureParameters) {
    return this._client.send<void>("Input.synthesizeScrollGesture", params);
  }
  /** Synthesizes a tap gesture over a time period by issuing appropriate touch events. */
  public synthesizeTapGesture(params: Input.SynthesizeTapGestureParameters) {
    return this._client.send<void>("Input.synthesizeTapGesture", params);
  }
}
export namespace Input {
  export interface TouchPoint {
    /** State of the touch point. */
    state: "touchPressed" | "touchReleased" | "touchMoved" | "touchStationary" | "touchCancelled";
    /** X coordinate of the event relative to the main frame's viewport. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** X radius of the touch area (default: 1). */
    radiusX?: number;
    /** Y radius of the touch area (default: 1). */
    radiusY?: number;
    /** Rotation angle (default: 0.0). */
    rotationAngle?: number;
    /** Force (default: 1.0). */
    force?: number;
    /** Identifier used to track touch sources between events, must be unique within an event. */
    id?: number;
  }
  export type GestureSourceType = "default" | "touch" | "mouse";
  /** UTC time in seconds, counted from January 1, 1970. */
  export type TimeSinceEpoch = number;
  export type SetIgnoreInputEventsParameters = {
    /** Ignores input events processing when set to true. */
    ignore: boolean;
  };
  export type DispatchKeyEventParameters = {
    /** Type of the key event. */
    type: "keyDown" | "keyUp" | "rawKeyDown" | "char";
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
    /** Text as generated by processing a virtual key code with a keyboard layout. Not needed for for <code>keyUp</code> and <code>rawKeyDown</code> events (default: "") */
    text?: string;
    /** Text that would have been generated by the keyboard if no modifiers were pressed (except for shift). Useful for shortcut (accelerator) key handling (default: ""). */
    unmodifiedText?: string;
    /** Unique key identifier (e.g., 'U+0041') (default: ""). */
    keyIdentifier?: string;
    /** Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: ""). */
    code?: string;
    /** Unique DOM defined string value describing the meaning of the key in the context of active modifiers, keyboard layout, etc (e.g., 'AltGr') (default: ""). */
    key?: string;
    /** Windows virtual key code (default: 0). */
    windowsVirtualKeyCode?: number;
    /** Native virtual key code (default: 0). */
    nativeVirtualKeyCode?: number;
    /** Whether the event was generated from auto repeat (default: false). */
    autoRepeat?: boolean;
    /** Whether the event was generated from the keypad (default: false). */
    isKeypad?: boolean;
    /** Whether the event was a system key event (default: false). */
    isSystemKey?: boolean;
  };
  export type DispatchMouseEventParameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved";
    /** X coordinate of the event relative to the main frame's viewport in CSS pixels. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
    /** Mouse button (default: "none"). */
    button?: "none" | "left" | "middle" | "right";
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
  };
  export type DispatchTouchEventParameters = {
    /** Type of the touch event. */
    type: "touchStart" | "touchEnd" | "touchMove";
    /** Touch points. */
    touchPoints: TouchPoint[];
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
  };
  export type EmulateTouchFromMouseEventParameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved" | "mouseWheel";
    /** X coordinate of the mouse pointer in DIP. */
    x: number;
    /** Y coordinate of the mouse pointer in DIP. */
    y: number;
    /** Time at which the event occurred. */
    timestamp: TimeSinceEpoch;
    /** Mouse button. */
    button: "none" | "left" | "middle" | "right";
    /** X delta in DIP for mouse wheel event (default: 0). */
    deltaX?: number;
    /** Y delta in DIP for mouse wheel event (default: 0). */
    deltaY?: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
  };
  export type SynthesizePinchGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out). */
    scaleFactor: number;
    /** Relative pointer speed in pixels per second (default: 800). */
    relativeSpeed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
  export type SynthesizeScrollGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** The distance to scroll along the X axis (positive to scroll left). */
    xDistance?: number;
    /** The distance to scroll along the Y axis (positive to scroll up). */
    yDistance?: number;
    /** The number of additional pixels to scroll back along the X axis, in addition to the given distance. */
    xOverscroll?: number;
    /** The number of additional pixels to scroll back along the Y axis, in addition to the given distance. */
    yOverscroll?: number;
    /** Prevent fling (default: true). */
    preventFling?: boolean;
    /** Swipe speed in pixels per second (default: 800). */
    speed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
    /** The number of times to repeat the gesture (default: 0). */
    repeatCount?: number;
    /** The number of milliseconds delay between each repeat. (default: 250). */
    repeatDelayMs?: number;
    /** The name of the interaction markers to generate, if not empty (default: ""). */
    interactionMarkerName?: string;
  };
  export type SynthesizeTapGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Duration between touchdown and touchup events in ms (default: 50). */
    duration?: number;
    /** Number of times to perform the tap (e.g. 2 for double tap, default: 1). */
    tapCount?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
}
export class LayerTree {
  private _layerTreeDidChange: LayerTree.LayerTreeDidChangeHandler | null = null;
  private _layerPainted: LayerTree.LayerPaintedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables compositing tree inspection. */
  public enable() {
    return this._client.send<void>("LayerTree.enable");
  }
  /** Disables compositing tree inspection. */
  public disable() {
    return this._client.send<void>("LayerTree.disable");
  }
  /** Provides the reasons why the given layer was composited. */
  public compositingReasons(params: LayerTree.CompositingReasonsParameters) {
    return this._client.send<LayerTree.CompositingReasonsReturn>("LayerTree.compositingReasons", params);
  }
  /** Returns the layer snapshot identifier. */
  public makeSnapshot(params: LayerTree.MakeSnapshotParameters) {
    return this._client.send<LayerTree.MakeSnapshotReturn>("LayerTree.makeSnapshot", params);
  }
  /** Returns the snapshot identifier. */
  public loadSnapshot(params: LayerTree.LoadSnapshotParameters) {
    return this._client.send<LayerTree.LoadSnapshotReturn>("LayerTree.loadSnapshot", params);
  }
  /** Releases layer snapshot captured by the back-end. */
  public releaseSnapshot(params: LayerTree.ReleaseSnapshotParameters) {
    return this._client.send<void>("LayerTree.releaseSnapshot", params);
  }
  public profileSnapshot(params: LayerTree.ProfileSnapshotParameters) {
    return this._client.send<LayerTree.ProfileSnapshotReturn>("LayerTree.profileSnapshot", params);
  }
  /** Replays the layer snapshot and returns the resulting bitmap. */
  public replaySnapshot(params: LayerTree.ReplaySnapshotParameters) {
    return this._client.send<LayerTree.ReplaySnapshotReturn>("LayerTree.replaySnapshot", params);
  }
  /** Replays the layer snapshot and returns canvas log. */
  public snapshotCommandLog(params: LayerTree.SnapshotCommandLogParameters) {
    return this._client.send<LayerTree.SnapshotCommandLogReturn>("LayerTree.snapshotCommandLog", params);
  }
  get layerTreeDidChange() {
    return this._layerTreeDidChange;
  }
  set layerTreeDidChange(handler) {
    if (this._layerTreeDidChange) {
      this._client.removeListener("LayerTree.layerTreeDidChange", this._layerTreeDidChange);
    }
    this._layerTreeDidChange = handler;
    if (handler) {
      this._client.on("LayerTree.layerTreeDidChange", handler);
    }
  }
  get layerPainted() {
    return this._layerPainted;
  }
  set layerPainted(handler) {
    if (this._layerPainted) {
      this._client.removeListener("LayerTree.layerPainted", this._layerPainted);
    }
    this._layerPainted = handler;
    if (handler) {
      this._client.on("LayerTree.layerPainted", handler);
    }
  }
}
export namespace LayerTree {
  /** Unique Layer identifier. */
  export type LayerId = string;
  /** Unique snapshot identifier. */
  export type SnapshotId = string;
  /** Rectangle where scrolling happens on the main thread. */
  export interface ScrollRect {
    /** Rectangle itself. */
    rect: DOM.Rect;
    /** Reason for rectangle to force scrolling on the main thread */
    type: "RepaintsOnScroll" | "TouchEventHandler" | "WheelEventHandler";
  }
  /** Serialized fragment of layer picture along with its offset within the layer. */
  export interface PictureTile {
    /** Offset from owning layer left boundary */
    x: number;
    /** Offset from owning layer top boundary */
    y: number;
    /** Base64-encoded snapshot data. */
    picture: string;
  }
  /** Information about a compositing layer. */
  export interface Layer {
    /** The unique id for this layer. */
    layerId: LayerId;
    /** The id of parent (not present for root). */
    parentLayerId?: LayerId;
    /** The backend id for the node associated with this layer. */
    backendNodeId?: DOM.BackendNodeId;
    /** Offset from parent layer, X coordinate. */
    offsetX: number;
    /** Offset from parent layer, Y coordinate. */
    offsetY: number;
    /** Layer width. */
    width: number;
    /** Layer height. */
    height: number;
    /** Transformation matrix for layer, default is identity matrix */
    transform?: number[];
    /** Transform anchor point X, absent if no transform specified */
    anchorX?: number;
    /** Transform anchor point Y, absent if no transform specified */
    anchorY?: number;
    /** Transform anchor point Z, absent if no transform specified */
    anchorZ?: number;
    /** Indicates how many time this layer has painted. */
    paintCount: number;
    /** Indicates whether this layer hosts any content, rather than being used for transform/scrolling purposes only. */
    drawsContent: boolean;
    /** Set if layer is not visible. */
    invisible?: boolean;
    /** Rectangles scrolling on main thread only. */
    scrollRects?: ScrollRect[];
  }
  /** Array of timings, one per paint step. */
  export type PaintProfile = number[];
  export type LayerTreeDidChangeParameters = {
    /** Layer tree, absent if not in the comspositing mode. */
    layers?: Layer[];
  };
  export type LayerTreeDidChangeHandler = (params: LayerTreeDidChangeParameters) => void;
  export type LayerPaintedParameters = {
    /** The id of the painted layer. */
    layerId: LayerId;
    /** Clip rectangle. */
    clip: DOM.Rect;
  };
  export type LayerPaintedHandler = (params: LayerPaintedParameters) => void;
  export type CompositingReasonsParameters = {
    /** The id of the layer for which we want to get the reasons it was composited. */
    layerId: LayerId;
  };
  export type CompositingReasonsReturn = {
    /** A list of strings specifying reasons for the given layer to become composited. */
    compositingReasons: string[];
  };
  export type MakeSnapshotParameters = {
    /** The id of the layer. */
    layerId: LayerId;
  };
  export type MakeSnapshotReturn = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type LoadSnapshotParameters = {
    /** An array of tiles composing the snapshot. */
    tiles: PictureTile[];
  };
  export type LoadSnapshotReturn = {
    /** The id of the snapshot. */
    snapshotId: SnapshotId;
  };
  export type ReleaseSnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type ProfileSnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The maximum number of times to replay the snapshot (1, if not specified). */
    minRepeatCount?: number;
    /** The minimum duration (in seconds) to replay the snapshot. */
    minDuration?: number;
    /** The clip rectangle to apply when replaying the snapshot. */
    clipRect?: DOM.Rect;
  };
  export type ProfileSnapshotReturn = {
    /** The array of paint profiles, one per run. */
    timings: PaintProfile[];
  };
  export type ReplaySnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The first step to replay from (replay from the very start if not specified). */
    fromStep?: number;
    /** The last step to replay to (replay till the end if not specified). */
    toStep?: number;
    /** The scale to apply while replaying (defaults to 1). */
    scale?: number;
  };
  export type ReplaySnapshotReturn = {
    /** A data: URL for resulting image. */
    dataURL: string;
  };
  export type SnapshotCommandLogParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type SnapshotCommandLogReturn = {
    /** The array of canvas function calls. */
    commandLog: any[];
  };
}
export class DeviceOrientation {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Overrides the Device Orientation. */
  public setDeviceOrientationOverride(params: DeviceOrientation.SetDeviceOrientationOverrideParameters) {
    return this._client.send<void>("DeviceOrientation.setDeviceOrientationOverride", params);
  }
  /** Clears the overridden Device Orientation. */
  public clearDeviceOrientationOverride() {
    return this._client.send<void>("DeviceOrientation.clearDeviceOrientationOverride");
  }
}
export namespace DeviceOrientation {
  export type SetDeviceOrientationOverrideParameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
}
export class Tracing {
  private _dataCollected: Tracing.DataCollectedHandler | null = null;
  private _tracingComplete: Tracing.TracingCompleteHandler | null = null;
  private _bufferUsage: Tracing.BufferUsageHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Start trace events collection. */
  public start(params: Tracing.StartParameters) {
    return this._client.send<void>("Tracing.start", params);
  }
  /** Stop trace events collection. */
  public end() {
    return this._client.send<void>("Tracing.end");
  }
  /** Gets supported tracing categories. */
  public getCategories() {
    return this._client.send<Tracing.GetCategoriesReturn>("Tracing.getCategories");
  }
  /** Request a global memory dump. */
  public requestMemoryDump() {
    return this._client.send<Tracing.RequestMemoryDumpReturn>("Tracing.requestMemoryDump");
  }
  /** Record a clock sync marker in the trace. */
  public recordClockSyncMarker(params: Tracing.RecordClockSyncMarkerParameters) {
    return this._client.send<void>("Tracing.recordClockSyncMarker", params);
  }
  /** Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event. */
  get dataCollected() {
    return this._dataCollected;
  }
  set dataCollected(handler) {
    if (this._dataCollected) {
      this._client.removeListener("Tracing.dataCollected", this._dataCollected);
    }
    this._dataCollected = handler;
    if (handler) {
      this._client.on("Tracing.dataCollected", handler);
    }
  }
  /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events. */
  get tracingComplete() {
    return this._tracingComplete;
  }
  set tracingComplete(handler) {
    if (this._tracingComplete) {
      this._client.removeListener("Tracing.tracingComplete", this._tracingComplete);
    }
    this._tracingComplete = handler;
    if (handler) {
      this._client.on("Tracing.tracingComplete", handler);
    }
  }
  get bufferUsage() {
    return this._bufferUsage;
  }
  set bufferUsage(handler) {
    if (this._bufferUsage) {
      this._client.removeListener("Tracing.bufferUsage", this._bufferUsage);
    }
    this._bufferUsage = handler;
    if (handler) {
      this._client.on("Tracing.bufferUsage", handler);
    }
  }
}
export namespace Tracing {
  /** Configuration for memory dump. Used only when "memory-infra" category is enabled. */
  export type MemoryDumpConfig = any;
  export interface TraceConfig {
    /** Controls how the trace buffer stores data. */
    recordMode?: "recordUntilFull" | "recordContinuously" | "recordAsMuchAsPossible" | "echoToConsole";
    /** Turns on JavaScript stack sampling. */
    enableSampling?: boolean;
    /** Turns on system tracing. */
    enableSystrace?: boolean;
    /** Turns on argument filter. */
    enableArgumentFilter?: boolean;
    /** Included category filters. */
    includedCategories?: string[];
    /** Excluded category filters. */
    excludedCategories?: string[];
    /** Configuration to synthesize the delays in tracing. */
    syntheticDelays?: string[];
    /** Configuration for memory dump triggers. Used only when "memory-infra" category is enabled. */
    memoryDumpConfig?: MemoryDumpConfig;
  }
  export type DataCollectedParameters = {
    value: any[];
  };
  export type DataCollectedHandler = (params: DataCollectedParameters) => void;
  export type TracingCompleteParameters = {
    /** A handle of the stream that holds resulting trace data. */
    stream?: IO.StreamHandle;
  };
  export type TracingCompleteHandler = (params: TracingCompleteParameters) => void;
  export type BufferUsageParameters = {
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    percentFull?: number;
    /** An approximate number of events in the trace log. */
    eventCount?: number;
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    value?: number;
  };
  export type BufferUsageHandler = (params: BufferUsageParameters) => void;
  export type StartParameters = {
    /** Category/tag filter */
    categories?: string;
    /** Tracing options */
    options?: string;
    /** If set, the agent will issue bufferUsage events at this interval, specified in milliseconds */
    bufferUsageReportingInterval?: number;
    /** Whether to report trace events as series of dataCollected events or to save trace to a stream (defaults to <code>ReportEvents</code>). */
    transferMode?: "ReportEvents" | "ReturnAsStream";
    traceConfig?: TraceConfig;
  };
  export type GetCategoriesReturn = {
    /** A list of supported tracing categories. */
    categories: string[];
  };
  export type RequestMemoryDumpReturn = {
    /** GUID of the resulting global memory dump. */
    dumpGuid: string;
    /** True iff the global memory dump succeeded. */
    success: boolean;
  };
  export type RecordClockSyncMarkerParameters = {
    /** The ID of this clock sync marker */
    syncId: string;
  };
}
export class Animation {
  private _animationCreated: Animation.AnimationCreatedHandler | null = null;
  private _animationStarted: Animation.AnimationStartedHandler | null = null;
  private _animationCanceled: Animation.AnimationCanceledHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables animation domain notifications. */
  public enable() {
    return this._client.send<void>("Animation.enable");
  }
  /** Disables animation domain notifications. */
  public disable() {
    return this._client.send<void>("Animation.disable");
  }
  /** Gets the playback rate of the document timeline. */
  public getPlaybackRate() {
    return this._client.send<Animation.GetPlaybackRateReturn>("Animation.getPlaybackRate");
  }
  /** Sets the playback rate of the document timeline. */
  public setPlaybackRate(params: Animation.SetPlaybackRateParameters) {
    return this._client.send<void>("Animation.setPlaybackRate", params);
  }
  /** Returns the current time of the an animation. */
  public getCurrentTime(params: Animation.GetCurrentTimeParameters) {
    return this._client.send<Animation.GetCurrentTimeReturn>("Animation.getCurrentTime", params);
  }
  /** Sets the paused state of a set of animations. */
  public setPaused(params: Animation.SetPausedParameters) {
    return this._client.send<void>("Animation.setPaused", params);
  }
  /** Sets the timing of an animation node. */
  public setTiming(params: Animation.SetTimingParameters) {
    return this._client.send<void>("Animation.setTiming", params);
  }
  /** Seek a set of animations to a particular time within each animation. */
  public seekAnimations(params: Animation.SeekAnimationsParameters) {
    return this._client.send<void>("Animation.seekAnimations", params);
  }
  /** Releases a set of animations to no longer be manipulated. */
  public releaseAnimations(params: Animation.ReleaseAnimationsParameters) {
    return this._client.send<void>("Animation.releaseAnimations", params);
  }
  /** Gets the remote object of the Animation. */
  public resolveAnimation(params: Animation.ResolveAnimationParameters) {
    return this._client.send<Animation.ResolveAnimationReturn>("Animation.resolveAnimation", params);
  }
  /** Event for each animation that has been created. */
  get animationCreated() {
    return this._animationCreated;
  }
  set animationCreated(handler) {
    if (this._animationCreated) {
      this._client.removeListener("Animation.animationCreated", this._animationCreated);
    }
    this._animationCreated = handler;
    if (handler) {
      this._client.on("Animation.animationCreated", handler);
    }
  }
  /** Event for animation that has been started. */
  get animationStarted() {
    return this._animationStarted;
  }
  set animationStarted(handler) {
    if (this._animationStarted) {
      this._client.removeListener("Animation.animationStarted", this._animationStarted);
    }
    this._animationStarted = handler;
    if (handler) {
      this._client.on("Animation.animationStarted", handler);
    }
  }
  /** Event for when an animation has been cancelled. */
  get animationCanceled() {
    return this._animationCanceled;
  }
  set animationCanceled(handler) {
    if (this._animationCanceled) {
      this._client.removeListener("Animation.animationCanceled", this._animationCanceled);
    }
    this._animationCanceled = handler;
    if (handler) {
      this._client.on("Animation.animationCanceled", handler);
    }
  }
}
export namespace Animation {
  /** Animation instance. */
  export interface Animation {
    /** <code>Animation</code>'s id. */
    id: string;
    /** <code>Animation</code>'s name. */
    name: string;
    /** <code>Animation</code>'s internal paused state. */
    pausedState: boolean;
    /** <code>Animation</code>'s play state. */
    playState: string;
    /** <code>Animation</code>'s playback rate. */
    playbackRate: number;
    /** <code>Animation</code>'s start time. */
    startTime: number;
    /** <code>Animation</code>'s current time. */
    currentTime: number;
    /** <code>Animation</code>'s source animation node. */
    source: AnimationEffect;
    /** Animation type of <code>Animation</code>. */
    type: "CSSTransition" | "CSSAnimation" | "WebAnimation";
    /** A unique ID for <code>Animation</code> representing the sources that triggered this CSS animation/transition. */
    cssId?: string;
  }
  /** AnimationEffect instance */
  export interface AnimationEffect {
    /** <code>AnimationEffect</code>'s delay. */
    delay: number;
    /** <code>AnimationEffect</code>'s end delay. */
    endDelay: number;
    /** <code>AnimationEffect</code>'s iteration start. */
    iterationStart: number;
    /** <code>AnimationEffect</code>'s iterations. */
    iterations: number;
    /** <code>AnimationEffect</code>'s iteration duration. */
    duration: number;
    /** <code>AnimationEffect</code>'s playback direction. */
    direction: string;
    /** <code>AnimationEffect</code>'s fill mode. */
    fill: string;
    /** <code>AnimationEffect</code>'s target node. */
    backendNodeId: DOM.BackendNodeId;
    /** <code>AnimationEffect</code>'s keyframes. */
    keyframesRule?: KeyframesRule;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
  /** Keyframes Rule */
  export interface KeyframesRule {
    /** CSS keyframed animation's name. */
    name?: string;
    /** List of animation keyframes. */
    keyframes: KeyframeStyle[];
  }
  /** Keyframe Style */
  export interface KeyframeStyle {
    /** Keyframe's time offset. */
    offset: string;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
  export type AnimationCreatedParameters = {
    /** Id of the animation that was created. */
    id: string;
  };
  export type AnimationCreatedHandler = (params: AnimationCreatedParameters) => void;
  export type AnimationStartedParameters = {
    /** Animation that was started. */
    animation: Animation;
  };
  export type AnimationStartedHandler = (params: AnimationStartedParameters) => void;
  export type AnimationCanceledParameters = {
    /** Id of the animation that was cancelled. */
    id: string;
  };
  export type AnimationCanceledHandler = (params: AnimationCanceledParameters) => void;
  export type GetPlaybackRateReturn = {
    /** Playback rate for animations on page. */
    playbackRate: number;
  };
  export type SetPlaybackRateParameters = {
    /** Playback rate for animations on page */
    playbackRate: number;
  };
  export type GetCurrentTimeParameters = {
    /** Id of animation. */
    id: string;
  };
  export type GetCurrentTimeReturn = {
    /** Current time of the page. */
    currentTime: number;
  };
  export type SetPausedParameters = {
    /** Animations to set the pause state of. */
    animations: string[];
    /** Paused state to set to. */
    paused: boolean;
  };
  export type SetTimingParameters = {
    /** Animation id. */
    animationId: string;
    /** Duration of the animation. */
    duration: number;
    /** Delay of the animation. */
    delay: number;
  };
  export type SeekAnimationsParameters = {
    /** List of animation ids to seek. */
    animations: string[];
    /** Set the current time of each animation. */
    currentTime: number;
  };
  export type ReleaseAnimationsParameters = {
    /** List of animation ids to seek. */
    animations: string[];
  };
  export type ResolveAnimationParameters = {
    /** Animation id. */
    animationId: string;
  };
  export type ResolveAnimationReturn = {
    /** Corresponding remote object. */
    remoteObject: Runtime.RemoteObject;
  };
}
export class Accessibility {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists. */
  public getPartialAXTree(params: Accessibility.GetPartialAXTreeParameters) {
    return this._client.send<Accessibility.GetPartialAXTreeReturn>("Accessibility.getPartialAXTree", params);
  }
}
export namespace Accessibility {
  /** Unique accessibility node identifier. */
  export type AXNodeId = string;
  /** Enum of possible property types. */
  export type AXValueType = "boolean" | "tristate" | "booleanOrUndefined" | "idref" | "idrefList" | "integer" | "node" | "nodeList" | "number" | "string" | "computedString" | "token" | "tokenList" | "domRelation" | "role" | "internalRole" | "valueUndefined";
  /** Enum of possible property sources. */
  export type AXValueSourceType = "attribute" | "implicit" | "style" | "contents" | "placeholder" | "relatedElement";
  /** Enum of possible native property sources (as a subtype of a particular AXValueSourceType). */
  export type AXValueNativeSourceType = "figcaption" | "label" | "labelfor" | "labelwrapped" | "legend" | "tablecaption" | "title" | "other";
  /** A single source for a computed AX property. */
  export interface AXValueSource {
    /** What type of source this is. */
    type: AXValueSourceType;
    /** The value of this property source. */
    value?: AXValue;
    /** The name of the relevant attribute, if any. */
    attribute?: string;
    /** The value of the relevant attribute, if any. */
    attributeValue?: AXValue;
    /** Whether this source is superseded by a higher priority source. */
    superseded?: boolean;
    /** The native markup source for this value, e.g. a <label> element. */
    nativeSource?: AXValueNativeSourceType;
    /** The value, such as a node or node list, of the native source. */
    nativeSourceValue?: AXValue;
    /** Whether the value for this property is invalid. */
    invalid?: boolean;
    /** Reason for the value being invalid, if it is. */
    invalidReason?: string;
  }
  export interface AXRelatedNode {
    /** The BackendNodeId of the related DOM node. */
    backendDOMNodeId: DOM.BackendNodeId;
    /** The IDRef value provided, if any. */
    idref?: string;
    /** The text alternative of this node in the current context. */
    text?: string;
  }
  export interface AXProperty {
    /** The name of this property. */
    name: string;
    /** The value of this property. */
    value: AXValue;
  }
  /** A single computed AX property. */
  export interface AXValue {
    /** The type of this value. */
    type: AXValueType;
    /** The computed value of this property. */
    value?: any;
    /** One or more related nodes, if applicable. */
    relatedNodes?: AXRelatedNode[];
    /** The sources which contributed to the computation of this property. */
    sources?: AXValueSource[];
  }
  /** States which apply to every AX node. */
  export type AXGlobalStates = "disabled" | "hidden" | "hiddenRoot" | "invalid" | "keyshortcuts" | "roledescription";
  /** Attributes which apply to nodes in live regions. */
  export type AXLiveRegionAttributes = "live" | "atomic" | "relevant" | "busy" | "root";
  /** Attributes which apply to widgets. */
  export type AXWidgetAttributes = "autocomplete" | "haspopup" | "level" | "multiselectable" | "orientation" | "multiline" | "readonly" | "required" | "valuemin" | "valuemax" | "valuetext";
  /** States which apply to widgets. */
  export type AXWidgetStates = "checked" | "expanded" | "modal" | "pressed" | "selected";
  /** Relationships between elements other than parent/child/sibling. */
  export type AXRelationshipAttributes = "activedescendant" | "controls" | "describedby" | "details" | "errormessage" | "flowto" | "labelledby" | "owns";
  /** A node in the accessibility tree. */
  export interface AXNode {
    /** Unique identifier for this node. */
    nodeId: AXNodeId;
    /** Whether this node is ignored for accessibility */
    ignored: boolean;
    /** Collection of reasons why this node is hidden. */
    ignoredReasons?: AXProperty[];
    /** This <code>Node</code>'s role, whether explicit or implicit. */
    role?: AXValue;
    /** The accessible name for this <code>Node</code>. */
    name?: AXValue;
    /** The accessible description for this <code>Node</code>. */
    description?: AXValue;
    /** The value for this <code>Node</code>. */
    value?: AXValue;
    /** All other properties */
    properties?: AXProperty[];
    /** IDs for each of this node's child nodes. */
    childIds?: AXNodeId[];
    /** The backend ID for the associated DOM node, if any. */
    backendDOMNodeId?: DOM.BackendNodeId;
  }
  export type GetPartialAXTreeParameters = {
    /** ID of node to get the partial accessibility tree for. */
    nodeId: DOM.NodeId;
    /** Whether to fetch this nodes ancestors, siblings and children. Defaults to true. */
    fetchRelatives?: boolean;
  };
  export type GetPartialAXTreeReturn = {
    /** The <code>Accessibility.AXNode</code> for this DOM node, if it exists, plus its ancestors, siblings and children, if requested. */
    nodes: AXNode[];
  };
}
export class Storage {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears storage for origin. */
  public clearDataForOrigin(params: Storage.ClearDataForOriginParameters) {
    return this._client.send<void>("Storage.clearDataForOrigin", params);
  }
  /** Returns usage and quota in bytes. */
  public getUsageAndQuota(params: Storage.GetUsageAndQuotaParameters) {
    return this._client.send<Storage.GetUsageAndQuotaReturn>("Storage.getUsageAndQuota", params);
  }
}
export namespace Storage {
  /** Enum of possible storage types. */
  export type StorageType = "appcache" | "cookies" | "file_systems" | "indexeddb" | "local_storage" | "shader_cache" | "websql" | "service_workers" | "cache_storage" | "all" | "other";
  /** Usage for a storage type. */
  export interface UsageForType {
    /** Name of storage type. */
    storageType: StorageType;
    /** Storage usage (bytes). */
    usage: number;
  }
  export type ClearDataForOriginParameters = {
    /** Security origin. */
    origin: string;
    /** Comma separated origin names. */
    storageTypes: string;
  };
  export type GetUsageAndQuotaParameters = {
    /** Security origin. */
    origin: string;
  };
  export type GetUsageAndQuotaReturn = {
    /** Storage usage (bytes). */
    usage: number;
    /** Storage quota (bytes). */
    quota: number;
    /** Storage usage per type (bytes). */
    usageBreakdown: UsageForType[];
  };
}
/** Provides access to log entries. */
export class Log {
  private _entryAdded: Log.EntryAddedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables log domain, sends the entries collected so far to the client by means of the <code>entryAdded</code> notification. */
  public enable() {
    return this._client.send<void>("Log.enable");
  }
  /** Disables log domain, prevents further log entries from being reported to the client. */
  public disable() {
    return this._client.send<void>("Log.disable");
  }
  /** Clears the log. */
  public clear() {
    return this._client.send<void>("Log.clear");
  }
  /** start violation reporting. */
  public startViolationsReport(params: Log.StartViolationsReportParameters) {
    return this._client.send<void>("Log.startViolationsReport", params);
  }
  /** Stop violation reporting. */
  public stopViolationsReport() {
    return this._client.send<void>("Log.stopViolationsReport");
  }
  /** Issued when new message was logged. */
  get entryAdded() {
    return this._entryAdded;
  }
  set entryAdded(handler) {
    if (this._entryAdded) {
      this._client.removeListener("Log.entryAdded", this._entryAdded);
    }
    this._entryAdded = handler;
    if (handler) {
      this._client.on("Log.entryAdded", handler);
    }
  }
}
export namespace Log {
  /** Log entry. */
  export interface LogEntry {
    /** Log entry source. */
    source: "xml" | "javascript" | "network" | "storage" | "appcache" | "rendering" | "security" | "deprecation" | "worker" | "violation" | "intervention" | "other";
    /** Log entry severity. */
    level: "verbose" | "info" | "warning" | "error";
    /** Logged text. */
    text: string;
    /** Timestamp when this entry was added. */
    timestamp: Runtime.Timestamp;
    /** URL of the resource if known. */
    url?: string;
    /** Line number in the resource. */
    lineNumber?: number;
    /** JavaScript stack trace. */
    stackTrace?: Runtime.StackTrace;
    /** Identifier of the network request associated with this entry. */
    networkRequestId?: Network.RequestId;
    /** Identifier of the worker associated with this entry. */
    workerId?: string;
  }
  /** Violation configuration setting. */
  export interface ViolationSetting {
    /** Violation type. */
    name: "longTask" | "longLayout" | "blockedEvent" | "blockedParser" | "discouragedAPIUse" | "handler" | "recurringHandler";
    /** Time threshold to trigger upon. */
    threshold: number;
  }
  export type EntryAddedParameters = {
    /** The entry. */
    entry: LogEntry;
  };
  export type EntryAddedHandler = (params: EntryAddedParameters) => void;
  export type StartViolationsReportParameters = {
    /** Configuration for violations. */
    config: ViolationSetting[];
  };
}
/** The SystemInfo domain defines methods and events for querying low-level system information. */
export class SystemInfo {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns information about the system. */
  public getInfo() {
    return this._client.send<SystemInfo.GetInfoReturn>("SystemInfo.getInfo");
  }
}
export namespace SystemInfo {
  /** Describes a single graphics processor (GPU). */
  export interface GPUDevice {
    /** PCI ID of the GPU vendor, if available; 0 otherwise. */
    vendorId: number;
    /** PCI ID of the GPU device, if available; 0 otherwise. */
    deviceId: number;
    /** String description of the GPU vendor, if the PCI ID is not available. */
    vendorString: string;
    /** String description of the GPU device, if the PCI ID is not available. */
    deviceString: string;
  }
  /** Provides information about the GPU(s) on the system. */
  export interface GPUInfo {
    /** The graphics devices on the system. Element 0 is the primary GPU. */
    devices: GPUDevice[];
    /** An optional dictionary of additional GPU related attributes. */
    auxAttributes?: any;
    /** An optional dictionary of graphics features and their status. */
    featureStatus?: any;
    /** An optional array of GPU driver bug workarounds. */
    driverBugWorkarounds: string[];
  }
  export type GetInfoReturn = {
    /** Information about the GPUs on the system. */
    gpu: GPUInfo;
    /** A platform-dependent description of the model of the machine. On Mac OS, this is, for example, 'MacBookPro'. Will be the empty string if not supported. */
    modelName: string;
    /** A platform-dependent description of the version of the machine. On Mac OS, this is, for example, '10.1'. Will be the empty string if not supported. */
    modelVersion: string;
    /** The command line string used to launch the browser. Will be the empty string if not supported. */
    commandLine: string;
  };
}
/** The Tethering domain defines methods and events for browser port binding. */
export class Tethering {
  private _accepted: Tethering.AcceptedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Request browser port binding. */
  public bind(params: Tethering.BindParameters) {
    return this._client.send<void>("Tethering.bind", params);
  }
  /** Request browser port unbinding. */
  public unbind(params: Tethering.UnbindParameters) {
    return this._client.send<void>("Tethering.unbind", params);
  }
  /** Informs that port was successfully bound and got a specified connection id. */
  get accepted() {
    return this._accepted;
  }
  set accepted(handler) {
    if (this._accepted) {
      this._client.removeListener("Tethering.accepted", this._accepted);
    }
    this._accepted = handler;
    if (handler) {
      this._client.on("Tethering.accepted", handler);
    }
  }
}
export namespace Tethering {
  export type AcceptedParameters = {
    /** Port number that was successfully bound. */
    port: number;
    /** Connection id to be used. */
    connectionId: string;
  };
  export type AcceptedHandler = (params: AcceptedParameters) => void;
  export type BindParameters = {
    /** Port number to bind. */
    port: number;
  };
  export type UnbindParameters = {
    /** Port number to unbind. */
    port: number;
  };
}
/** The Browser domain defines methods and events for browser managing. */
export class Browser {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Get the browser window that contains the devtools target. */
  public getWindowForTarget(params: Browser.GetWindowForTargetParameters) {
    return this._client.send<Browser.GetWindowForTargetReturn>("Browser.getWindowForTarget", params);
  }
  /** Set position and/or size of the browser window. */
  public setWindowBounds(params: Browser.SetWindowBoundsParameters) {
    return this._client.send<void>("Browser.setWindowBounds", params);
  }
  /** Get position and size of the browser window. */
  public getWindowBounds(params: Browser.GetWindowBoundsParameters) {
    return this._client.send<Browser.GetWindowBoundsReturn>("Browser.getWindowBounds", params);
  }
}
export namespace Browser {
  export type WindowID = number;
  /** The state of the browser window. */
  export type WindowState = "normal" | "minimized" | "maximized" | "fullscreen";
  /** Browser window bounds information */
  export interface Bounds {
    /** The offset from the left edge of the screen to the window in pixels. */
    left?: number;
    /** The offset from the top edge of the screen to the window in pixels. */
    top?: number;
    /** The window width in pixels. */
    width?: number;
    /** The window height in pixels. */
    height?: number;
    /** The window state. Default to normal. */
    windowState?: WindowState;
  }
  export type GetWindowForTargetParameters = {
    /** Devtools agent host id. */
    targetId: Target.TargetID;
  };
  export type GetWindowForTargetReturn = {
    /** Browser window id. */
    windowId: WindowID;
    /** Bounds information of the window. When window state is 'minimized', the restored window position and size are returned. */
    bounds: Bounds;
  };
  export type SetWindowBoundsParameters = {
    /** Browser window id. */
    windowId: WindowID;
    /** New window bounds. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined with 'left', 'top', 'width' or 'height'. Leaves unspecified fields unchanged. */
    bounds: Bounds;
  };
  export type GetWindowBoundsParameters = {
    /** Browser window id. */
    windowId: WindowID;
  };
  export type GetWindowBoundsReturn = {
    /** Bounds information of the window. When window state is 'minimized', the restored window position and size are returned. */
    bounds: Bounds;
  };
}
/** Provides information about the protocol schema. */
export class Schema {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns supported domains. */
  public getDomains() {
    return this._client.send<Schema.GetDomainsReturn>("Schema.getDomains");
  }
}
export namespace Schema {
  /** Description of the protocol domain. */
  export interface Domain {
    /** Domain name. */
    name: string;
    /** Domain version. */
    version: string;
  }
  export type GetDomainsReturn = {
    /** List of supported domains. */
    domains: Domain[];
  };
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group. */
export class Runtime {
  private _executionContextCreated: Runtime.ExecutionContextCreatedHandler | null = null;
  private _executionContextDestroyed: Runtime.ExecutionContextDestroyedHandler | null = null;
  private _executionContextsCleared: Runtime.ExecutionContextsClearedHandler | null = null;
  private _exceptionThrown: Runtime.ExceptionThrownHandler | null = null;
  private _exceptionRevoked: Runtime.ExceptionRevokedHandler | null = null;
  private _consoleAPICalled: Runtime.ConsoleAPICalledHandler | null = null;
  private _inspectRequested: Runtime.InspectRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Evaluates expression on global object. */
  public evaluate(params: Runtime.EvaluateParameters) {
    return this._client.send<Runtime.EvaluateReturn>("Runtime.evaluate", params);
  }
  /** Add handler to promise with given promise object id. */
  public awaitPromise(params: Runtime.AwaitPromiseParameters) {
    return this._client.send<Runtime.AwaitPromiseReturn>("Runtime.awaitPromise", params);
  }
  /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
  public callFunctionOn(params: Runtime.CallFunctionOnParameters) {
    return this._client.send<Runtime.CallFunctionOnReturn>("Runtime.callFunctionOn", params);
  }
  /** Returns properties of a given object. Object group of the result is inherited from the target object. */
  public getProperties(params: Runtime.GetPropertiesParameters) {
    return this._client.send<Runtime.GetPropertiesReturn>("Runtime.getProperties", params);
  }
  /** Releases remote object with given id. */
  public releaseObject(params: Runtime.ReleaseObjectParameters) {
    return this._client.send<void>("Runtime.releaseObject", params);
  }
  /** Releases all remote objects that belong to a given group. */
  public releaseObjectGroup(params: Runtime.ReleaseObjectGroupParameters) {
    return this._client.send<void>("Runtime.releaseObjectGroup", params);
  }
  /** Tells inspected instance to run if it was waiting for debugger to attach. */
  public runIfWaitingForDebugger() {
    return this._client.send<void>("Runtime.runIfWaitingForDebugger");
  }
  /** Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
  public enable() {
    return this._client.send<void>("Runtime.enable");
  }
  /** Disables reporting of execution contexts creation. */
  public disable() {
    return this._client.send<void>("Runtime.disable");
  }
  /** Discards collected exceptions and console API calls. */
  public discardConsoleEntries() {
    return this._client.send<void>("Runtime.discardConsoleEntries");
  }
  public setCustomObjectFormatterEnabled(params: Runtime.SetCustomObjectFormatterEnabledParameters) {
    return this._client.send<void>("Runtime.setCustomObjectFormatterEnabled", params);
  }
  /** Compiles expression. */
  public compileScript(params: Runtime.CompileScriptParameters) {
    return this._client.send<Runtime.CompileScriptReturn>("Runtime.compileScript", params);
  }
  /** Runs script with given id in a given context. */
  public runScript(params: Runtime.RunScriptParameters) {
    return this._client.send<Runtime.RunScriptReturn>("Runtime.runScript", params);
  }
  /** Issued when new execution context is created. */
  get executionContextCreated() {
    return this._executionContextCreated;
  }
  set executionContextCreated(handler) {
    if (this._executionContextCreated) {
      this._client.removeListener("Runtime.executionContextCreated", this._executionContextCreated);
    }
    this._executionContextCreated = handler;
    if (handler) {
      this._client.on("Runtime.executionContextCreated", handler);
    }
  }
  /** Issued when execution context is destroyed. */
  get executionContextDestroyed() {
    return this._executionContextDestroyed;
  }
  set executionContextDestroyed(handler) {
    if (this._executionContextDestroyed) {
      this._client.removeListener("Runtime.executionContextDestroyed", this._executionContextDestroyed);
    }
    this._executionContextDestroyed = handler;
    if (handler) {
      this._client.on("Runtime.executionContextDestroyed", handler);
    }
  }
  /** Issued when all executionContexts were cleared in browser */
  get executionContextsCleared() {
    return this._executionContextsCleared;
  }
  set executionContextsCleared(handler) {
    if (this._executionContextsCleared) {
      this._client.removeListener("Runtime.executionContextsCleared", this._executionContextsCleared);
    }
    this._executionContextsCleared = handler;
    if (handler) {
      this._client.on("Runtime.executionContextsCleared", handler);
    }
  }
  /** Issued when exception was thrown and unhandled. */
  get exceptionThrown() {
    return this._exceptionThrown;
  }
  set exceptionThrown(handler) {
    if (this._exceptionThrown) {
      this._client.removeListener("Runtime.exceptionThrown", this._exceptionThrown);
    }
    this._exceptionThrown = handler;
    if (handler) {
      this._client.on("Runtime.exceptionThrown", handler);
    }
  }
  /** Issued when unhandled exception was revoked. */
  get exceptionRevoked() {
    return this._exceptionRevoked;
  }
  set exceptionRevoked(handler) {
    if (this._exceptionRevoked) {
      this._client.removeListener("Runtime.exceptionRevoked", this._exceptionRevoked);
    }
    this._exceptionRevoked = handler;
    if (handler) {
      this._client.on("Runtime.exceptionRevoked", handler);
    }
  }
  /** Issued when console API was called. */
  get consoleAPICalled() {
    return this._consoleAPICalled;
  }
  set consoleAPICalled(handler) {
    if (this._consoleAPICalled) {
      this._client.removeListener("Runtime.consoleAPICalled", this._consoleAPICalled);
    }
    this._consoleAPICalled = handler;
    if (handler) {
      this._client.on("Runtime.consoleAPICalled", handler);
    }
  }
  /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
  get inspectRequested() {
    return this._inspectRequested;
  }
  set inspectRequested(handler) {
    if (this._inspectRequested) {
      this._client.removeListener("Runtime.inspectRequested", this._inspectRequested);
    }
    this._inspectRequested = handler;
    if (handler) {
      this._client.on("Runtime.inspectRequested", handler);
    }
  }
}
export namespace Runtime {
  /** Unique script identifier. */
  export type ScriptId = string;
  /** Unique object identifier. */
  export type RemoteObjectId = string;
  /** Primitive value which cannot be JSON-stringified. */
  export type UnserializableValue = "Infinity" | "NaN" | "-Infinity" | "-0";
  /** Mirror object referencing original JavaScript object. */
  export interface RemoteObject {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error" | "proxy" | "promise" | "typedarray";
    /** Object class (constructor) name. Specified for <code>object</code> type values only. */
    className?: string;
    /** Remote object value in case of primitive values or JSON values (if it was requested). */
    value?: any;
    /** Primitive value which can not be JSON-stringified does not have <code>value</code>, but gets this property. */
    unserializableValue?: UnserializableValue;
    /** String representation of the object. */
    description?: string;
    /** Unique object identifier (for non-primitive values). */
    objectId?: RemoteObjectId;
    /** Preview containing abbreviated property values. Specified for <code>object</code> type values only. */
    preview?: ObjectPreview;
    customPreview?: CustomPreview;
  }
  export interface CustomPreview {
    header: string;
    hasBody: boolean;
    formatterObjectId: RemoteObjectId;
    bindRemoteObjectFunctionId: RemoteObjectId;
    configObjectId?: RemoteObjectId;
  }
  /** Object containing abbreviated remote object value. */
  export interface ObjectPreview {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error";
    /** String representation of the object. */
    description?: string;
    /** True iff some of the properties or entries of the original object did not fit. */
    overflow: boolean;
    /** List of the properties. */
    properties: PropertyPreview[];
    /** List of the entries. Specified for <code>map</code> and <code>set</code> subtype values only. */
    entries?: EntryPreview[];
  }
  export interface PropertyPreview {
    /** Property name. */
    name: string;
    /** Object type. Accessor means that the property itself is an accessor property. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "accessor";
    /** User-friendly property value string. */
    value?: string;
    /** Nested value preview. */
    valuePreview?: ObjectPreview;
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error";
  }
  export interface EntryPreview {
    /** Preview of the key. Specified for map-like collection entries. */
    key?: ObjectPreview;
    /** Preview of the value. */
    value: ObjectPreview;
  }
  /** Object property descriptor. */
  export interface PropertyDescriptor {
    /** Property name or symbol description. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
    /** True if the value associated with the property may be changed (data descriptors only). */
    writable?: boolean;
    /** A function which serves as a getter for the property, or <code>undefined</code> if there is no getter (accessor descriptors only). */
    get?: RemoteObject;
    /** A function which serves as a setter for the property, or <code>undefined</code> if there is no setter (accessor descriptors only). */
    set?: RemoteObject;
    /** True if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. */
    configurable: boolean;
    /** True if this property shows up during enumeration of the properties on the corresponding object. */
    enumerable: boolean;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
    /** True if the property is owned for the object. */
    isOwn?: boolean;
    /** Property symbol object, if the property is of the <code>symbol</code> type. */
    symbol?: RemoteObject;
  }
  /** Object internal property descriptor. This property isn't normally visible in JavaScript code. */
  export interface InternalPropertyDescriptor {
    /** Conventional property name. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
  }
  /** Represents function call argument. Either remote object id <code>objectId</code>, primitive <code>value</code>, unserializable primitive value or neither of (for undefined) them should be specified. */
  export interface CallArgument {
    /** Primitive value. */
    value?: any;
    /** Primitive value which can not be JSON-stringified. */
    unserializableValue?: UnserializableValue;
    /** Remote object handle. */
    objectId?: RemoteObjectId;
  }
  /** Id of an execution context. */
  export type ExecutionContextId = number;
  /** Description of an isolated world. */
  export interface ExecutionContextDescription {
    /** Unique id of the execution context. It can be used to specify in which execution context script evaluation should be performed. */
    id: ExecutionContextId;
    /** Execution context origin. */
    origin: string;
    /** Human readable name describing given context. */
    name: string;
    /** Embedder-specific auxiliary data. */
    auxData?: any;
  }
  /** Detailed information about exception (or error) that was thrown during script compilation or execution. */
  export interface ExceptionDetails {
    /** Exception id. */
    exceptionId: number;
    /** Exception text, which should be used together with exception object when available. */
    text: string;
    /** Line number of the exception location (0-based). */
    lineNumber: number;
    /** Column number of the exception location (0-based). */
    columnNumber: number;
    /** Script ID of the exception location. */
    scriptId?: ScriptId;
    /** URL of the exception location, to be used when the script was not reported. */
    url?: string;
    /** JavaScript stack trace if available. */
    stackTrace?: StackTrace;
    /** Exception object if available. */
    exception?: RemoteObject;
    /** Identifier of the context where exception happened. */
    executionContextId?: ExecutionContextId;
  }
  /** Number of milliseconds since epoch. */
  export type Timestamp = number;
  /** Stack entry for runtime errors and assertions. */
  export interface CallFrame {
    /** JavaScript function name. */
    functionName: string;
    /** JavaScript script id. */
    scriptId: ScriptId;
    /** JavaScript script name or url. */
    url: string;
    /** JavaScript script line number (0-based). */
    lineNumber: number;
    /** JavaScript script column number (0-based). */
    columnNumber: number;
  }
  /** Call frames for assertions or error messages. */
  export interface StackTrace {
    /** String label of this stack trace. For async traces this may be a name of the function that initiated the async call. */
    description?: string;
    /** JavaScript function name. */
    callFrames: CallFrame[];
    /** Asynchronous JavaScript stack trace that preceded this stack, if available. */
    parent?: StackTrace;
    /** Creation frame of the Promise which produced the next synchronous trace when resolved, if available. */
    promiseCreationFrame?: CallFrame;
  }
  export type ExecutionContextCreatedParameters = {
    /** A newly created execution context. */
    context: ExecutionContextDescription;
  };
  export type ExecutionContextCreatedHandler = (params: ExecutionContextCreatedParameters) => void;
  export type ExecutionContextDestroyedParameters = {
    /** Id of the destroyed context */
    executionContextId: ExecutionContextId;
  };
  export type ExecutionContextDestroyedHandler = (params: ExecutionContextDestroyedParameters) => void;
  export type ExecutionContextsClearedHandler = () => void;
  export type ExceptionThrownParameters = {
    /** Timestamp of the exception. */
    timestamp: Timestamp;
    exceptionDetails: ExceptionDetails;
  };
  export type ExceptionThrownHandler = (params: ExceptionThrownParameters) => void;
  export type ExceptionRevokedParameters = {
    /** Reason describing why exception was revoked. */
    reason: string;
    /** The id of revoked exception, as reported in <code>exceptionUnhandled</code>. */
    exceptionId: number;
  };
  export type ExceptionRevokedHandler = (params: ExceptionRevokedParameters) => void;
  export type ConsoleAPICalledParameters = {
    /** Type of the call. */
    type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
    /** Call arguments. */
    args: RemoteObject[];
    /** Identifier of the context where the call was made. */
    executionContextId: ExecutionContextId;
    /** Call timestamp. */
    timestamp: Timestamp;
    /** Stack trace captured when the call was made. */
    stackTrace?: StackTrace;
    /** Console context descriptor for calls on non-default console context (not console.*): 'anonymous#unique-logger-id' for call on unnamed context, 'name#unique-logger-id' for call on named context. */
    context?: string;
  };
  export type ConsoleAPICalledHandler = (params: ConsoleAPICalledParameters) => void;
  export type InspectRequestedParameters = {
    object: RemoteObject;
    hints: any;
  };
  export type InspectRequestedHandler = (params: InspectRequestedParameters) => void;
  export type EvaluateParameters = {
    /** Expression to evaluate. */
    expression: string;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Specifies in which execution context to perform evaluation. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    contextId?: ExecutionContextId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type EvaluateReturn = {
    /** Evaluation result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type AwaitPromiseParameters = {
    /** Identifier of the promise. */
    promiseObjectId: RemoteObjectId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  };
  export type AwaitPromiseReturn = {
    /** Promise result. Will contain rejected value if promise was rejected. */
    result: RemoteObject;
    /** Exception details if stack strace is available. */
    exceptionDetails?: ExceptionDetails;
  };
  export type CallFunctionOnParameters = {
    /** Identifier of the object to call function on. */
    objectId: RemoteObjectId;
    /** Declaration of the function to call. */
    functionDeclaration: string;
    /** Call arguments. All call arguments must belong to the same JavaScript world as the target object. */
    arguments?: CallArgument[];
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type CallFunctionOnReturn = {
    /** Call result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type GetPropertiesParameters = {
    /** Identifier of the object to return properties for. */
    objectId: RemoteObjectId;
    /** If true, returns properties belonging only to the element itself, not to its prototype chain. */
    ownProperties?: boolean;
    /** If true, returns accessor properties (with getter/setter) only; internal properties are not returned either. */
    accessorPropertiesOnly?: boolean;
    /** Whether preview should be generated for the results. */
    generatePreview?: boolean;
  };
  export type GetPropertiesReturn = {
    /** Object properties. */
    result: PropertyDescriptor[];
    /** Internal object properties (only of the element itself). */
    internalProperties?: InternalPropertyDescriptor[];
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type ReleaseObjectParameters = {
    /** Identifier of the object to release. */
    objectId: RemoteObjectId;
  };
  export type ReleaseObjectGroupParameters = {
    /** Symbolic object group name. */
    objectGroup: string;
  };
  export type SetCustomObjectFormatterEnabledParameters = {
    enabled: boolean;
  };
  export type CompileScriptParameters = {
    /** Expression to compile. */
    expression: string;
    /** Source url to be set for the script. */
    sourceURL: string;
    /** Specifies whether the compiled script should be persisted. */
    persistScript: boolean;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
  };
  export type CompileScriptReturn = {
    /** Id of the script. */
    scriptId?: ScriptId;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type RunScriptParameters = {
    /** Id of the script to run. */
    scriptId: ScriptId;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type RunScriptReturn = {
    /** Run result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
}
/** Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc. */
export class Debugger {
  private _scriptParsed: Debugger.ScriptParsedHandler | null = null;
  private _scriptFailedToParse: Debugger.ScriptFailedToParseHandler | null = null;
  private _breakpointResolved: Debugger.BreakpointResolvedHandler | null = null;
  private _paused: Debugger.PausedHandler | null = null;
  private _resumed: Debugger.ResumedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received. */
  public enable() {
    return this._client.send<void>("Debugger.enable");
  }
  /** Disables debugger for given page. */
  public disable() {
    return this._client.send<void>("Debugger.disable");
  }
  /** Activates / deactivates all breakpoints on the page. */
  public setBreakpointsActive(params: Debugger.SetBreakpointsActiveParameters) {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  public setSkipAllPauses(params: Debugger.SetSkipAllPausesParameters) {
    return this._client.send<void>("Debugger.setSkipAllPauses", params);
  }
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads. */
  public setBreakpointByUrl(params: Debugger.SetBreakpointByUrlParameters) {
    return this._client.send<Debugger.SetBreakpointByUrlReturn>("Debugger.setBreakpointByUrl", params);
  }
  /** Sets JavaScript breakpoint at a given location. */
  public setBreakpoint(params: Debugger.SetBreakpointParameters) {
    return this._client.send<Debugger.SetBreakpointReturn>("Debugger.setBreakpoint", params);
  }
  /** Removes JavaScript breakpoint. */
  public removeBreakpoint(params: Debugger.RemoveBreakpointParameters) {
    return this._client.send<void>("Debugger.removeBreakpoint", params);
  }
  /** Returns possible locations for breakpoint. scriptId in start and end range locations should be the same. */
  public getPossibleBreakpoints(params: Debugger.GetPossibleBreakpointsParameters) {
    return this._client.send<Debugger.GetPossibleBreakpointsReturn>("Debugger.getPossibleBreakpoints", params);
  }
  /** Continues execution until specific location is reached. */
  public continueToLocation(params: Debugger.ContinueToLocationParameters) {
    return this._client.send<void>("Debugger.continueToLocation", params);
  }
  /** Steps over the statement. */
  public stepOver() {
    return this._client.send<void>("Debugger.stepOver");
  }
  /** Steps into the function call. */
  public stepInto() {
    return this._client.send<void>("Debugger.stepInto");
  }
  /** Steps out of the function call. */
  public stepOut() {
    return this._client.send<void>("Debugger.stepOut");
  }
  /** Stops on the next JavaScript statement. */
  public pause() {
    return this._client.send<void>("Debugger.pause");
  }
  /** Steps into next scheduled async task if any is scheduled before next pause. Returns success when async task is actually scheduled, returns error if no task were scheduled or another scheduleStepIntoAsync was called. */
  public scheduleStepIntoAsync() {
    return this._client.send<void>("Debugger.scheduleStepIntoAsync");
  }
  /** Resumes JavaScript execution. */
  public resume() {
    return this._client.send<void>("Debugger.resume");
  }
  /** Searches for given string in script content. */
  public searchInContent(params: Debugger.SearchInContentParameters) {
    return this._client.send<Debugger.SearchInContentReturn>("Debugger.searchInContent", params);
  }
  /** Edits JavaScript source live. */
  public setScriptSource(params: Debugger.SetScriptSourceParameters) {
    return this._client.send<Debugger.SetScriptSourceReturn>("Debugger.setScriptSource", params);
  }
  /** Restarts particular call frame from the beginning. */
  public restartFrame(params: Debugger.RestartFrameParameters) {
    return this._client.send<Debugger.RestartFrameReturn>("Debugger.restartFrame", params);
  }
  /** Returns source for the script with given id. */
  public getScriptSource(params: Debugger.GetScriptSourceParameters) {
    return this._client.send<Debugger.GetScriptSourceReturn>("Debugger.getScriptSource", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>. */
  public setPauseOnExceptions(params: Debugger.SetPauseOnExceptionsParameters) {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
  }
  /** Evaluates expression on a given call frame. */
  public evaluateOnCallFrame(params: Debugger.EvaluateOnCallFrameParameters) {
    return this._client.send<Debugger.EvaluateOnCallFrameReturn>("Debugger.evaluateOnCallFrame", params);
  }
  /** Changes value of variable in a callframe. Object-based scopes are not supported and must be mutated manually. */
  public setVariableValue(params: Debugger.SetVariableValueParameters) {
    return this._client.send<void>("Debugger.setVariableValue", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Debugger.SetAsyncCallStackDepthParameters) {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
  }
  /** Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in scripts with url matching one of the patterns. VM will try to leave blackboxed script by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
  public setBlackboxPatterns(params: Debugger.SetBlackboxPatternsParameters) {
    return this._client.send<void>("Debugger.setBlackboxPatterns", params);
  }
  /** Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. Positions array contains positions where blackbox state is changed. First interval isn't blackboxed. Array should be sorted. */
  public setBlackboxedRanges(params: Debugger.SetBlackboxedRangesParameters) {
    return this._client.send<void>("Debugger.setBlackboxedRanges", params);
  }
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
  get scriptParsed() {
    return this._scriptParsed;
  }
  set scriptParsed(handler) {
    if (this._scriptParsed) {
      this._client.removeListener("Debugger.scriptParsed", this._scriptParsed);
    }
    this._scriptParsed = handler;
    if (handler) {
      this._client.on("Debugger.scriptParsed", handler);
    }
  }
  /** Fired when virtual machine fails to parse the script. */
  get scriptFailedToParse() {
    return this._scriptFailedToParse;
  }
  set scriptFailedToParse(handler) {
    if (this._scriptFailedToParse) {
      this._client.removeListener("Debugger.scriptFailedToParse", this._scriptFailedToParse);
    }
    this._scriptFailedToParse = handler;
    if (handler) {
      this._client.on("Debugger.scriptFailedToParse", handler);
    }
  }
  /** Fired when breakpoint is resolved to an actual script and location. */
  get breakpointResolved() {
    return this._breakpointResolved;
  }
  set breakpointResolved(handler) {
    if (this._breakpointResolved) {
      this._client.removeListener("Debugger.breakpointResolved", this._breakpointResolved);
    }
    this._breakpointResolved = handler;
    if (handler) {
      this._client.on("Debugger.breakpointResolved", handler);
    }
  }
  /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
  get paused() {
    return this._paused;
  }
  set paused(handler) {
    if (this._paused) {
      this._client.removeListener("Debugger.paused", this._paused);
    }
    this._paused = handler;
    if (handler) {
      this._client.on("Debugger.paused", handler);
    }
  }
  /** Fired when the virtual machine resumed execution. */
  get resumed() {
    return this._resumed;
  }
  set resumed(handler) {
    if (this._resumed) {
      this._client.removeListener("Debugger.resumed", this._resumed);
    }
    this._resumed = handler;
    if (handler) {
      this._client.on("Debugger.resumed", handler);
    }
  }
}
export namespace Debugger {
  /** Breakpoint identifier. */
  export type BreakpointId = string;
  /** Call frame identifier. */
  export type CallFrameId = string;
  /** Location in the source code. */
  export interface Location {
    /** Script identifier as reported in the <code>Debugger.scriptParsed</code>. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
  }
  /** Location in the source code. */
  export interface ScriptPosition {
    lineNumber: number;
    columnNumber: number;
  }
  /** JavaScript call frame. Array of call frames form the call stack. */
  export interface CallFrame {
    /** Call frame identifier. This identifier is only valid while the virtual machine is paused. */
    callFrameId: CallFrameId;
    /** Name of the JavaScript function called on this call frame. */
    functionName: string;
    /** Location in the source code. */
    functionLocation?: Location;
    /** Location in the source code. */
    location: Location;
    /** Scope chain for this call frame. */
    scopeChain: Scope[];
    /** <code>this</code> object for this call frame. */
    this: Runtime.RemoteObject;
    /** The value being returned, if the function is at return point. */
    returnValue?: Runtime.RemoteObject;
  }
  /** Scope description. */
  export interface Scope {
    /** Scope type. */
    type: "global" | "local" | "with" | "closure" | "catch" | "block" | "script" | "eval" | "module";
    /** Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties. */
    object: Runtime.RemoteObject;
    name?: string;
    /** Location in the source code where scope starts */
    startLocation?: Location;
    /** Location in the source code where scope ends */
    endLocation?: Location;
  }
  /** Search match for resource. */
  export interface SearchMatch {
    /** Line number in resource content. */
    lineNumber: number;
    /** Line with match content. */
    lineContent: string;
  }
  export interface BreakLocation {
    /** Script identifier as reported in the <code>Debugger.scriptParsed</code>. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
    type?: "debuggerStatement" | "call" | "return";
  }
  export type ScriptParsedParameters = {
    /** Identifier of the script parsed. */
    scriptId: Runtime.ScriptId;
    /** URL or name of the script parsed (if any). */
    url: string;
    /** Line offset of the script within the resource with given URL (for script tags). */
    startLine: number;
    /** Column offset of the script within the resource with given URL. */
    startColumn: number;
    /** Last line of the script. */
    endLine: number;
    /** Length of the last line of the script. */
    endColumn: number;
    /** Specifies script creation context. */
    executionContextId: Runtime.ExecutionContextId;
    /** Content hash of the script. */
    hash: string;
    /** Embedder-specific auxiliary data. */
    executionContextAuxData?: any;
    /** True, if this script is generated as a result of the live edit operation. */
    isLiveEdit?: boolean;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type ScriptParsedHandler = (params: ScriptParsedParameters) => void;
  export type ScriptFailedToParseParameters = {
    /** Identifier of the script parsed. */
    scriptId: Runtime.ScriptId;
    /** URL or name of the script parsed (if any). */
    url: string;
    /** Line offset of the script within the resource with given URL (for script tags). */
    startLine: number;
    /** Column offset of the script within the resource with given URL. */
    startColumn: number;
    /** Last line of the script. */
    endLine: number;
    /** Length of the last line of the script. */
    endColumn: number;
    /** Specifies script creation context. */
    executionContextId: Runtime.ExecutionContextId;
    /** Content hash of the script. */
    hash: string;
    /** Embedder-specific auxiliary data. */
    executionContextAuxData?: any;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type ScriptFailedToParseHandler = (params: ScriptFailedToParseParameters) => void;
  export type BreakpointResolvedParameters = {
    /** Breakpoint unique identifier. */
    breakpointId: BreakpointId;
    /** Actual breakpoint location. */
    location: Location;
  };
  export type BreakpointResolvedHandler = (params: BreakpointResolvedParameters) => void;
  export type PausedParameters = {
    /** Call stack the virtual machine stopped on. */
    callFrames: CallFrame[];
    /** Pause reason. */
    reason: "XHR" | "DOM" | "EventListener" | "exception" | "assert" | "debugCommand" | "promiseRejection" | "OOM" | "other" | "ambiguous";
    /** Object containing break-specific auxiliary properties. */
    data?: any;
    /** Hit breakpoints IDs */
    hitBreakpoints?: string[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type PausedHandler = (params: PausedParameters) => void;
  export type ResumedHandler = () => void;
  export type SetBreakpointsActiveParameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type SetSkipAllPausesParameters = {
    /** New value for skip pauses state. */
    skip: boolean;
  };
  export type SetBreakpointByUrlParameters = {
    /** Line number to set breakpoint at. */
    lineNumber: number;
    /** URL of the resources to set breakpoint on. */
    url?: string;
    /** Regex pattern for the URLs of the resources to set breakpoints on. Either <code>url</code> or <code>urlRegex</code> must be specified. */
    urlRegex?: string;
    /** Offset in the line to set breakpoint at. */
    columnNumber?: number;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointByUrlReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** List of the locations this breakpoint resolved into upon addition. */
    locations: Location[];
  };
  export type SetBreakpointParameters = {
    /** Location to set breakpoint in. */
    location: Location;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** Location this breakpoint resolved into. */
    actualLocation: Location;
  };
  export type RemoveBreakpointParameters = {
    breakpointId: BreakpointId;
  };
  export type GetPossibleBreakpointsParameters = {
    /** Start of range to search possible breakpoint locations in. */
    start: Location;
    /** End of range to search possible breakpoint locations in (excluding). When not specified, end of scripts is used as end of range. */
    end?: Location;
    /** Only consider locations which are in the same (non-nested) function as start. */
    restrictToFunction?: boolean;
  };
  export type GetPossibleBreakpointsReturn = {
    /** List of the possible breakpoint locations. */
    locations: BreakLocation[];
  };
  export type ContinueToLocationParameters = {
    /** Location to continue to. */
    location: Location;
    targetCallFrames?: "any" | "current";
  };
  export type SearchInContentParameters = {
    /** Id of the script to search in. */
    scriptId: Runtime.ScriptId;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type SearchInContentReturn = {
    /** List of search matches. */
    result: SearchMatch[];
  };
  export type SetScriptSourceParameters = {
    /** Id of the script to edit. */
    scriptId: Runtime.ScriptId;
    /** New content of the script. */
    scriptSource: string;
    /**  If true the change will not actually be applied. Dry run may be used to get result description without actually modifying the code. */
    dryRun?: boolean;
  };
  export type SetScriptSourceReturn = {
    /** New stack trace in case editing has happened while VM was stopped. */
    callFrames?: CallFrame[];
    /** Whether current call stack  was modified after applying the changes. */
    stackChanged?: boolean;
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
    /** Exception details if any. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type RestartFrameParameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
  };
  export type RestartFrameReturn = {
    /** New stack trace. */
    callFrames: CallFrame[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type GetScriptSourceParameters = {
    /** Id of the script to get source for. */
    scriptId: Runtime.ScriptId;
  };
  export type GetScriptSourceReturn = {
    /** Script source. */
    scriptSource: string;
  };
  export type SetPauseOnExceptionsParameters = {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
  };
  export type EvaluateOnCallFrameParameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
    /** Expression to evaluate. */
    expression: string;
    /** String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>). */
    objectGroup?: string;
    /** Specifies whether command line API should be available to the evaluated expression, defaults to false. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether to throw an exception if side effect cannot be ruled out during evaluation. */
    throwOnSideEffect?: boolean;
  };
  export type EvaluateOnCallFrameReturn = {
    /** Object wrapper for the evaluation result. */
    result: Runtime.RemoteObject;
    /** Exception details. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type SetVariableValueParameters = {
    /** 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch' scope types are allowed. Other scopes could be manipulated manually. */
    scopeNumber: number;
    /** Variable name. */
    variableName: string;
    /** New variable value. */
    newValue: Runtime.CallArgument;
    /** Id of callframe that holds variable. */
    callFrameId: CallFrameId;
  };
  export type SetAsyncCallStackDepthParameters = {
    /** Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default). */
    maxDepth: number;
  };
  export type SetBlackboxPatternsParameters = {
    /** Array of regexps that will be used to check script url for blackbox state. */
    patterns: string[];
  };
  export type SetBlackboxedRangesParameters = {
    /** Id of the script. */
    scriptId: Runtime.ScriptId;
    positions: ScriptPosition[];
  };
}
/** This domain is deprecated - use Runtime or Log instead. */
export class Console {
  private _messageAdded: Console.MessageAddedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification. */
  public enable() {
    return this._client.send<void>("Console.enable");
  }
  /** Disables console domain, prevents further console messages from being reported to the client. */
  public disable() {
    return this._client.send<void>("Console.disable");
  }
  /** Does nothing. */
  public clearMessages() {
    return this._client.send<void>("Console.clearMessages");
  }
  /** Issued when new console message is added. */
  get messageAdded() {
    return this._messageAdded;
  }
  set messageAdded(handler) {
    if (this._messageAdded) {
      this._client.removeListener("Console.messageAdded", this._messageAdded);
    }
    this._messageAdded = handler;
    if (handler) {
      this._client.on("Console.messageAdded", handler);
    }
  }
}
export namespace Console {
  /** Console message. */
  export interface ConsoleMessage {
    /** Message source. */
    source: "xml" | "javascript" | "network" | "console-api" | "storage" | "appcache" | "rendering" | "security" | "other" | "deprecation" | "worker";
    /** Message severity. */
    level: "log" | "warning" | "error" | "debug" | "info";
    /** Message text. */
    text: string;
    /** URL of the message origin. */
    url?: string;
    /** Line number in the resource that generated this message (1-based). */
    line?: number;
    /** Column number in the resource that generated this message (1-based). */
    column?: number;
  }
  export type MessageAddedParameters = {
    /** Console message that has been added. */
    message: ConsoleMessage;
  };
  export type MessageAddedHandler = (params: MessageAddedParameters) => void;
}
export class Profiler {
  private _consoleProfileStarted: Profiler.ConsoleProfileStartedHandler | null = null;
  private _consoleProfileFinished: Profiler.ConsoleProfileFinishedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public enable() {
    return this._client.send<void>("Profiler.enable");
  }
  public disable() {
    return this._client.send<void>("Profiler.disable");
  }
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  public setSamplingInterval(params: Profiler.SetSamplingIntervalParameters) {
    return this._client.send<void>("Profiler.setSamplingInterval", params);
  }
  public start() {
    return this._client.send<void>("Profiler.start");
  }
  public stop() {
    return this._client.send<Profiler.StopReturn>("Profiler.stop");
  }
  /** Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code coverage may be incomplete. Enabling prevents running optimized code and resets execution counters. */
  public startPreciseCoverage(params: Profiler.StartPreciseCoverageParameters) {
    return this._client.send<void>("Profiler.startPreciseCoverage", params);
  }
  /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows executing optimized code. */
  public stopPreciseCoverage() {
    return this._client.send<void>("Profiler.stopPreciseCoverage");
  }
  /** Collect coverage data for the current isolate, and resets execution counters. Precise code coverage needs to have started. */
  public takePreciseCoverage() {
    return this._client.send<Profiler.TakePreciseCoverageReturn>("Profiler.takePreciseCoverage");
  }
  /** Collect coverage data for the current isolate. The coverage data may be incomplete due to garbage collection. */
  public getBestEffortCoverage() {
    return this._client.send<Profiler.GetBestEffortCoverageReturn>("Profiler.getBestEffortCoverage");
  }
  /** Sent when new profile recording is started using console.profile() call. */
  get consoleProfileStarted() {
    return this._consoleProfileStarted;
  }
  set consoleProfileStarted(handler) {
    if (this._consoleProfileStarted) {
      this._client.removeListener("Profiler.consoleProfileStarted", this._consoleProfileStarted);
    }
    this._consoleProfileStarted = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileStarted", handler);
    }
  }
  get consoleProfileFinished() {
    return this._consoleProfileFinished;
  }
  set consoleProfileFinished(handler) {
    if (this._consoleProfileFinished) {
      this._client.removeListener("Profiler.consoleProfileFinished", this._consoleProfileFinished);
    }
    this._consoleProfileFinished = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileFinished", handler);
    }
  }
}
export namespace Profiler {
  /** Profile node. Holds callsite information, execution statistics and child nodes. */
  export interface ProfileNode {
    /** Unique id of the node. */
    id: number;
    /** Function location. */
    callFrame: Runtime.CallFrame;
    /** Number of samples where this node was on top of the call stack. */
    hitCount?: number;
    /** Child node ids. */
    children?: number[];
    /** The reason of being not optimized. The function may be deoptimized or marked as don't optimize. */
    deoptReason?: string;
    /** An array of source position ticks. */
    positionTicks?: PositionTickInfo[];
  }
  /** Profile. */
  export interface Profile {
    /** The list of profile nodes. First item is the root node. */
    nodes: ProfileNode[];
    /** Profiling start timestamp in microseconds. */
    startTime: number;
    /** Profiling end timestamp in microseconds. */
    endTime: number;
    /** Ids of samples top nodes. */
    samples?: number[];
    /** Time intervals between adjacent samples in microseconds. The first delta is relative to the profile startTime. */
    timeDeltas?: number[];
  }
  /** Specifies a number of samples attributed to a certain source position. */
  export interface PositionTickInfo {
    /** Source line number (1-based). */
    line: number;
    /** Number of samples attributed to the source line. */
    ticks: number;
  }
  /** Coverage data for a source range. */
  export interface CoverageRange {
    /** JavaScript script source offset for the range start. */
    startOffset: number;
    /** JavaScript script source offset for the range end. */
    endOffset: number;
    /** Collected execution count of the source range. */
    count: number;
  }
  /** Coverage data for a JavaScript function. */
  export interface FunctionCoverage {
    /** JavaScript function name. */
    functionName: string;
    /** Source ranges inside the function with coverage data. */
    ranges: CoverageRange[];
    /** Whether coverage data for this function has block granularity. */
    isBlockCoverage: boolean;
  }
  /** Coverage data for a JavaScript script. */
  export interface ScriptCoverage {
    /** JavaScript script id. */
    scriptId: Runtime.ScriptId;
    /** JavaScript script name or url. */
    url: string;
    /** Functions contained in the script that has coverage data. */
    functions: FunctionCoverage[];
  }
  export type ConsoleProfileStartedParameters = {
    id: string;
    /** Location of console.profile(). */
    location: Debugger.Location;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileStartedHandler = (params: ConsoleProfileStartedParameters) => void;
  export type ConsoleProfileFinishedParameters = {
    id: string;
    /** Location of console.profileEnd(). */
    location: Debugger.Location;
    profile: Profile;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileFinishedHandler = (params: ConsoleProfileFinishedParameters) => void;
  export type SetSamplingIntervalParameters = {
    /** New sampling interval in microseconds. */
    interval: number;
  };
  export type StopReturn = {
    /** Recorded profile. */
    profile: Profile;
  };
  export type StartPreciseCoverageParameters = {
    /** Collect accurate call counts beyond simple 'covered' or 'not covered'. */
    callCount?: boolean;
  };
  export type TakePreciseCoverageReturn = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
  export type GetBestEffortCoverageReturn = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
}
export class HeapProfiler {
  private _addHeapSnapshotChunk: HeapProfiler.AddHeapSnapshotChunkHandler | null = null;
  private _resetProfiles: HeapProfiler.ResetProfilesHandler | null = null;
  private _reportHeapSnapshotProgress: HeapProfiler.ReportHeapSnapshotProgressHandler | null = null;
  private _lastSeenObjectId: HeapProfiler.LastSeenObjectIdHandler | null = null;
  private _heapStatsUpdate: HeapProfiler.HeapStatsUpdateHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public enable() {
    return this._client.send<void>("HeapProfiler.enable");
  }
  public disable() {
    return this._client.send<void>("HeapProfiler.disable");
  }
  public startTrackingHeapObjects(params: HeapProfiler.StartTrackingHeapObjectsParameters) {
    return this._client.send<void>("HeapProfiler.startTrackingHeapObjects", params);
  }
  public stopTrackingHeapObjects(params: HeapProfiler.StopTrackingHeapObjectsParameters) {
    return this._client.send<void>("HeapProfiler.stopTrackingHeapObjects", params);
  }
  public takeHeapSnapshot(params: HeapProfiler.TakeHeapSnapshotParameters) {
    return this._client.send<void>("HeapProfiler.takeHeapSnapshot", params);
  }
  public collectGarbage() {
    return this._client.send<void>("HeapProfiler.collectGarbage");
  }
  public getObjectByHeapObjectId(params: HeapProfiler.GetObjectByHeapObjectIdParameters) {
    return this._client.send<HeapProfiler.GetObjectByHeapObjectIdReturn>("HeapProfiler.getObjectByHeapObjectId", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  public addInspectedHeapObject(params: HeapProfiler.AddInspectedHeapObjectParameters) {
    return this._client.send<void>("HeapProfiler.addInspectedHeapObject", params);
  }
  public getHeapObjectId(params: HeapProfiler.GetHeapObjectIdParameters) {
    return this._client.send<HeapProfiler.GetHeapObjectIdReturn>("HeapProfiler.getHeapObjectId", params);
  }
  public startSampling(params: HeapProfiler.StartSamplingParameters) {
    return this._client.send<void>("HeapProfiler.startSampling", params);
  }
  public stopSampling() {
    return this._client.send<HeapProfiler.StopSamplingReturn>("HeapProfiler.stopSampling");
  }
  get addHeapSnapshotChunk() {
    return this._addHeapSnapshotChunk;
  }
  set addHeapSnapshotChunk(handler) {
    if (this._addHeapSnapshotChunk) {
      this._client.removeListener("HeapProfiler.addHeapSnapshotChunk", this._addHeapSnapshotChunk);
    }
    this._addHeapSnapshotChunk = handler;
    if (handler) {
      this._client.on("HeapProfiler.addHeapSnapshotChunk", handler);
    }
  }
  get resetProfiles() {
    return this._resetProfiles;
  }
  set resetProfiles(handler) {
    if (this._resetProfiles) {
      this._client.removeListener("HeapProfiler.resetProfiles", this._resetProfiles);
    }
    this._resetProfiles = handler;
    if (handler) {
      this._client.on("HeapProfiler.resetProfiles", handler);
    }
  }
  get reportHeapSnapshotProgress() {
    return this._reportHeapSnapshotProgress;
  }
  set reportHeapSnapshotProgress(handler) {
    if (this._reportHeapSnapshotProgress) {
      this._client.removeListener("HeapProfiler.reportHeapSnapshotProgress", this._reportHeapSnapshotProgress);
    }
    this._reportHeapSnapshotProgress = handler;
    if (handler) {
      this._client.on("HeapProfiler.reportHeapSnapshotProgress", handler);
    }
  }
  /** If heap objects tracking has been started then backend regularly sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
  get lastSeenObjectId() {
    return this._lastSeenObjectId;
  }
  set lastSeenObjectId(handler) {
    if (this._lastSeenObjectId) {
      this._client.removeListener("HeapProfiler.lastSeenObjectId", this._lastSeenObjectId);
    }
    this._lastSeenObjectId = handler;
    if (handler) {
      this._client.on("HeapProfiler.lastSeenObjectId", handler);
    }
  }
  /** If heap objects tracking has been started then backend may send update for one or more fragments */
  get heapStatsUpdate() {
    return this._heapStatsUpdate;
  }
  set heapStatsUpdate(handler) {
    if (this._heapStatsUpdate) {
      this._client.removeListener("HeapProfiler.heapStatsUpdate", this._heapStatsUpdate);
    }
    this._heapStatsUpdate = handler;
    if (handler) {
      this._client.on("HeapProfiler.heapStatsUpdate", handler);
    }
  }
}
export namespace HeapProfiler {
  /** Heap snapshot object id. */
  export type HeapSnapshotObjectId = string;
  /** Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes. */
  export interface SamplingHeapProfileNode {
    /** Function location. */
    callFrame: Runtime.CallFrame;
    /** Allocations size in bytes for the node excluding children. */
    selfSize: number;
    /** Child nodes. */
    children: SamplingHeapProfileNode[];
  }
  /** Profile. */
  export interface SamplingHeapProfile {
    head: SamplingHeapProfileNode;
  }
  export type AddHeapSnapshotChunkParameters = {
    chunk: string;
  };
  export type AddHeapSnapshotChunkHandler = (params: AddHeapSnapshotChunkParameters) => void;
  export type ResetProfilesHandler = () => void;
  export type ReportHeapSnapshotProgressParameters = {
    done: number;
    total: number;
    finished?: boolean;
  };
  export type ReportHeapSnapshotProgressHandler = (params: ReportHeapSnapshotProgressParameters) => void;
  export type LastSeenObjectIdParameters = {
    lastSeenObjectId: number;
    timestamp: number;
  };
  export type LastSeenObjectIdHandler = (params: LastSeenObjectIdParameters) => void;
  export type HeapStatsUpdateParameters = {
    /** An array of triplets. Each triplet describes a fragment. The first integer is the fragment index, the second integer is a total count of objects for the fragment, the third integer is a total size of the objects for the fragment. */
    statsUpdate: number[];
  };
  export type HeapStatsUpdateHandler = (params: HeapStatsUpdateParameters) => void;
  export type StartTrackingHeapObjectsParameters = {
    trackAllocations?: boolean;
  };
  export type StopTrackingHeapObjectsParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken when the tracking is stopped. */
    reportProgress?: boolean;
  };
  export type TakeHeapSnapshotParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken. */
    reportProgress?: boolean;
  };
  export type GetObjectByHeapObjectIdParameters = {
    objectId: HeapSnapshotObjectId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type GetObjectByHeapObjectIdReturn = {
    /** Evaluation result. */
    result: Runtime.RemoteObject;
  };
  export type AddInspectedHeapObjectParameters = {
    /** Heap snapshot object id to be accessible by means of $x command line API. */
    heapObjectId: HeapSnapshotObjectId;
  };
  export type GetHeapObjectIdParameters = {
    /** Identifier of the object to get heap object id for. */
    objectId: Runtime.RemoteObjectId;
  };
  export type GetHeapObjectIdReturn = {
    /** Id of the heap snapshot object corresponding to the passed remote object id. */
    heapSnapshotObjectId: HeapSnapshotObjectId;
  };
  export type StartSamplingParameters = {
    /** Average sample interval in bytes. Poisson distribution is used for the intervals. The default value is 32768 bytes. */
    samplingInterval?: number;
  };
  export type StopSamplingReturn = {
    /** Recorded sampling heap profile. */
    profile: SamplingHeapProfile;
  };
}
