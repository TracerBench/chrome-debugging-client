/**
 * Debugging Protocol 1.2 Domains
 * Generated on Sat May 06 2017 14:09:02 GMT-0700 (PDT)
 */
/* tslint:disable */
import { IDebuggingProtocolClient } from "../lib/types";
/** Provides information about the protocol schema. */
export class Schema {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns supported domains. */
  public getDomains(): Promise<Schema.GetDomainsReturn> {
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
  export type GetDomainsParameters = any;
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
  public evaluate(params: Runtime.EvaluateParameters): Promise<Runtime.EvaluateReturn> {
    return this._client.send<Runtime.EvaluateReturn>("Runtime.evaluate", params);
  }
  /** Add handler to promise with given promise object id. */
  public awaitPromise(params: Runtime.AwaitPromiseParameters): Promise<Runtime.AwaitPromiseReturn> {
    return this._client.send<Runtime.AwaitPromiseReturn>("Runtime.awaitPromise", params);
  }
  /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
  public callFunctionOn(params: Runtime.CallFunctionOnParameters): Promise<Runtime.CallFunctionOnReturn> {
    return this._client.send<Runtime.CallFunctionOnReturn>("Runtime.callFunctionOn", params);
  }
  /** Returns properties of a given object. Object group of the result is inherited from the target object. */
  public getProperties(params: Runtime.GetPropertiesParameters): Promise<Runtime.GetPropertiesReturn> {
    return this._client.send<Runtime.GetPropertiesReturn>("Runtime.getProperties", params);
  }
  /** Releases remote object with given id. */
  public releaseObject(params: Runtime.ReleaseObjectParameters): Promise<void> {
    return this._client.send<void>("Runtime.releaseObject", params);
  }
  /** Releases all remote objects that belong to a given group. */
  public releaseObjectGroup(params: Runtime.ReleaseObjectGroupParameters): Promise<void> {
    return this._client.send<void>("Runtime.releaseObjectGroup", params);
  }
  /** Tells inspected instance to run if it was waiting for debugger to attach. */
  public runIfWaitingForDebugger(): Promise<void> {
    return this._client.send<void>("Runtime.runIfWaitingForDebugger");
  }
  /** Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
  public enable(): Promise<void> {
    return this._client.send<void>("Runtime.enable");
  }
  /** Disables reporting of execution contexts creation. */
  public disable(): Promise<void> {
    return this._client.send<void>("Runtime.disable");
  }
  /** Discards collected exceptions and console API calls. */
  public discardConsoleEntries(): Promise<void> {
    return this._client.send<void>("Runtime.discardConsoleEntries");
  }
  public setCustomObjectFormatterEnabled(params: Runtime.SetCustomObjectFormatterEnabledParameters): Promise<void> {
    return this._client.send<void>("Runtime.setCustomObjectFormatterEnabled", params);
  }
  /** Compiles expression. */
  public compileScript(params: Runtime.CompileScriptParameters): Promise<Runtime.CompileScriptReturn> {
    return this._client.send<Runtime.CompileScriptReturn>("Runtime.compileScript", params);
  }
  /** Runs script with given id in a given context. */
  public runScript(params: Runtime.RunScriptParameters): Promise<Runtime.RunScriptReturn> {
    return this._client.send<Runtime.RunScriptReturn>("Runtime.runScript", params);
  }
  /** Issued when new execution context is created. */
  get executionContextCreated(): Runtime.ExecutionContextCreatedHandler | null {
    return this._executionContextCreated;
  }
  set executionContextCreated(handler: Runtime.ExecutionContextCreatedHandler | null) {
    if (this._executionContextCreated) {
      this._client.removeListener("Runtime.executionContextCreated", this._executionContextCreated);
    }
    this._executionContextCreated = handler;
    if (handler) {
      this._client.on("Runtime.executionContextCreated", handler);
    }
  }
  /** Issued when execution context is destroyed. */
  get executionContextDestroyed(): Runtime.ExecutionContextDestroyedHandler | null {
    return this._executionContextDestroyed;
  }
  set executionContextDestroyed(handler: Runtime.ExecutionContextDestroyedHandler | null) {
    if (this._executionContextDestroyed) {
      this._client.removeListener("Runtime.executionContextDestroyed", this._executionContextDestroyed);
    }
    this._executionContextDestroyed = handler;
    if (handler) {
      this._client.on("Runtime.executionContextDestroyed", handler);
    }
  }
  /** Issued when all executionContexts were cleared in browser */
  get executionContextsCleared(): Runtime.ExecutionContextsClearedHandler | null {
    return this._executionContextsCleared;
  }
  set executionContextsCleared(handler: Runtime.ExecutionContextsClearedHandler | null) {
    if (this._executionContextsCleared) {
      this._client.removeListener("Runtime.executionContextsCleared", this._executionContextsCleared);
    }
    this._executionContextsCleared = handler;
    if (handler) {
      this._client.on("Runtime.executionContextsCleared", handler);
    }
  }
  /** Issued when exception was thrown and unhandled. */
  get exceptionThrown(): Runtime.ExceptionThrownHandler | null {
    return this._exceptionThrown;
  }
  set exceptionThrown(handler: Runtime.ExceptionThrownHandler | null) {
    if (this._exceptionThrown) {
      this._client.removeListener("Runtime.exceptionThrown", this._exceptionThrown);
    }
    this._exceptionThrown = handler;
    if (handler) {
      this._client.on("Runtime.exceptionThrown", handler);
    }
  }
  /** Issued when unhandled exception was revoked. */
  get exceptionRevoked(): Runtime.ExceptionRevokedHandler | null {
    return this._exceptionRevoked;
  }
  set exceptionRevoked(handler: Runtime.ExceptionRevokedHandler | null) {
    if (this._exceptionRevoked) {
      this._client.removeListener("Runtime.exceptionRevoked", this._exceptionRevoked);
    }
    this._exceptionRevoked = handler;
    if (handler) {
      this._client.on("Runtime.exceptionRevoked", handler);
    }
  }
  /** Issued when console API was called. */
  get consoleAPICalled(): Runtime.ConsoleAPICalledHandler | null {
    return this._consoleAPICalled;
  }
  set consoleAPICalled(handler: Runtime.ConsoleAPICalledHandler | null) {
    if (this._consoleAPICalled) {
      this._client.removeListener("Runtime.consoleAPICalled", this._consoleAPICalled);
    }
    this._consoleAPICalled = handler;
    if (handler) {
      this._client.on("Runtime.consoleAPICalled", handler);
    }
  }
  /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
  get inspectRequested(): Runtime.InspectRequestedHandler | null {
    return this._inspectRequested;
  }
  set inspectRequested(handler: Runtime.InspectRequestedHandler | null) {
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
  export type ReleaseObjectReturn = any;
  export type ReleaseObjectGroupParameters = {
    /** Symbolic object group name. */
    objectGroup: string;
  };
  export type ReleaseObjectGroupReturn = any;
  export type RunIfWaitingForDebuggerParameters = any;
  export type RunIfWaitingForDebuggerReturn = any;
  export type EnableParameters = any;
  export type EnableReturn = any;
  export type DisableParameters = any;
  export type DisableReturn = any;
  export type DiscardConsoleEntriesParameters = any;
  export type DiscardConsoleEntriesReturn = any;
  export type SetCustomObjectFormatterEnabledParameters = {
    enabled: boolean;
  };
  export type SetCustomObjectFormatterEnabledReturn = any;
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
  public enable(): Promise<void> {
    return this._client.send<void>("Debugger.enable");
  }
  /** Disables debugger for given page. */
  public disable(): Promise<void> {
    return this._client.send<void>("Debugger.disable");
  }
  /** Activates / deactivates all breakpoints on the page. */
  public setBreakpointsActive(params: Debugger.SetBreakpointsActiveParameters): Promise<void> {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  public setSkipAllPauses(params: Debugger.SetSkipAllPausesParameters): Promise<void> {
    return this._client.send<void>("Debugger.setSkipAllPauses", params);
  }
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads. */
  public setBreakpointByUrl(params: Debugger.SetBreakpointByUrlParameters): Promise<Debugger.SetBreakpointByUrlReturn> {
    return this._client.send<Debugger.SetBreakpointByUrlReturn>("Debugger.setBreakpointByUrl", params);
  }
  /** Sets JavaScript breakpoint at a given location. */
  public setBreakpoint(params: Debugger.SetBreakpointParameters): Promise<Debugger.SetBreakpointReturn> {
    return this._client.send<Debugger.SetBreakpointReturn>("Debugger.setBreakpoint", params);
  }
  /** Removes JavaScript breakpoint. */
  public removeBreakpoint(params: Debugger.RemoveBreakpointParameters): Promise<void> {
    return this._client.send<void>("Debugger.removeBreakpoint", params);
  }
  /** Returns possible locations for breakpoint. scriptId in start and end range locations should be the same. */
  public getPossibleBreakpoints(params: Debugger.GetPossibleBreakpointsParameters): Promise<Debugger.GetPossibleBreakpointsReturn> {
    return this._client.send<Debugger.GetPossibleBreakpointsReturn>("Debugger.getPossibleBreakpoints", params);
  }
  /** Continues execution until specific location is reached. */
  public continueToLocation(params: Debugger.ContinueToLocationParameters): Promise<void> {
    return this._client.send<void>("Debugger.continueToLocation", params);
  }
  /** Steps over the statement. */
  public stepOver(): Promise<void> {
    return this._client.send<void>("Debugger.stepOver");
  }
  /** Steps into the function call. */
  public stepInto(): Promise<void> {
    return this._client.send<void>("Debugger.stepInto");
  }
  /** Steps out of the function call. */
  public stepOut(): Promise<void> {
    return this._client.send<void>("Debugger.stepOut");
  }
  /** Stops on the next JavaScript statement. */
  public pause(): Promise<void> {
    return this._client.send<void>("Debugger.pause");
  }
  /** Steps into next scheduled async task if any is scheduled before next pause. Returns success when async task is actually scheduled, returns error if no task were scheduled or another scheduleStepIntoAsync was called. */
  public scheduleStepIntoAsync(): Promise<void> {
    return this._client.send<void>("Debugger.scheduleStepIntoAsync");
  }
  /** Resumes JavaScript execution. */
  public resume(): Promise<void> {
    return this._client.send<void>("Debugger.resume");
  }
  /** Searches for given string in script content. */
  public searchInContent(params: Debugger.SearchInContentParameters): Promise<Debugger.SearchInContentReturn> {
    return this._client.send<Debugger.SearchInContentReturn>("Debugger.searchInContent", params);
  }
  /** Edits JavaScript source live. */
  public setScriptSource(params: Debugger.SetScriptSourceParameters): Promise<Debugger.SetScriptSourceReturn> {
    return this._client.send<Debugger.SetScriptSourceReturn>("Debugger.setScriptSource", params);
  }
  /** Restarts particular call frame from the beginning. */
  public restartFrame(params: Debugger.RestartFrameParameters): Promise<Debugger.RestartFrameReturn> {
    return this._client.send<Debugger.RestartFrameReturn>("Debugger.restartFrame", params);
  }
  /** Returns source for the script with given id. */
  public getScriptSource(params: Debugger.GetScriptSourceParameters): Promise<Debugger.GetScriptSourceReturn> {
    return this._client.send<Debugger.GetScriptSourceReturn>("Debugger.getScriptSource", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>. */
  public setPauseOnExceptions(params: Debugger.SetPauseOnExceptionsParameters): Promise<void> {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
  }
  /** Evaluates expression on a given call frame. */
  public evaluateOnCallFrame(params: Debugger.EvaluateOnCallFrameParameters): Promise<Debugger.EvaluateOnCallFrameReturn> {
    return this._client.send<Debugger.EvaluateOnCallFrameReturn>("Debugger.evaluateOnCallFrame", params);
  }
  /** Changes value of variable in a callframe. Object-based scopes are not supported and must be mutated manually. */
  public setVariableValue(params: Debugger.SetVariableValueParameters): Promise<void> {
    return this._client.send<void>("Debugger.setVariableValue", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Debugger.SetAsyncCallStackDepthParameters): Promise<void> {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
  }
  /** Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in scripts with url matching one of the patterns. VM will try to leave blackboxed script by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
  public setBlackboxPatterns(params: Debugger.SetBlackboxPatternsParameters): Promise<void> {
    return this._client.send<void>("Debugger.setBlackboxPatterns", params);
  }
  /** Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. Positions array contains positions where blackbox state is changed. First interval isn't blackboxed. Array should be sorted. */
  public setBlackboxedRanges(params: Debugger.SetBlackboxedRangesParameters): Promise<void> {
    return this._client.send<void>("Debugger.setBlackboxedRanges", params);
  }
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
  get scriptParsed(): Debugger.ScriptParsedHandler | null {
    return this._scriptParsed;
  }
  set scriptParsed(handler: Debugger.ScriptParsedHandler | null) {
    if (this._scriptParsed) {
      this._client.removeListener("Debugger.scriptParsed", this._scriptParsed);
    }
    this._scriptParsed = handler;
    if (handler) {
      this._client.on("Debugger.scriptParsed", handler);
    }
  }
  /** Fired when virtual machine fails to parse the script. */
  get scriptFailedToParse(): Debugger.ScriptFailedToParseHandler | null {
    return this._scriptFailedToParse;
  }
  set scriptFailedToParse(handler: Debugger.ScriptFailedToParseHandler | null) {
    if (this._scriptFailedToParse) {
      this._client.removeListener("Debugger.scriptFailedToParse", this._scriptFailedToParse);
    }
    this._scriptFailedToParse = handler;
    if (handler) {
      this._client.on("Debugger.scriptFailedToParse", handler);
    }
  }
  /** Fired when breakpoint is resolved to an actual script and location. */
  get breakpointResolved(): Debugger.BreakpointResolvedHandler | null {
    return this._breakpointResolved;
  }
  set breakpointResolved(handler: Debugger.BreakpointResolvedHandler | null) {
    if (this._breakpointResolved) {
      this._client.removeListener("Debugger.breakpointResolved", this._breakpointResolved);
    }
    this._breakpointResolved = handler;
    if (handler) {
      this._client.on("Debugger.breakpointResolved", handler);
    }
  }
  /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
  get paused(): Debugger.PausedHandler | null {
    return this._paused;
  }
  set paused(handler: Debugger.PausedHandler | null) {
    if (this._paused) {
      this._client.removeListener("Debugger.paused", this._paused);
    }
    this._paused = handler;
    if (handler) {
      this._client.on("Debugger.paused", handler);
    }
  }
  /** Fired when the virtual machine resumed execution. */
  get resumed(): Debugger.ResumedHandler | null {
    return this._resumed;
  }
  set resumed(handler: Debugger.ResumedHandler | null) {
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
  export type EnableParameters = any;
  export type EnableReturn = any;
  export type DisableParameters = any;
  export type DisableReturn = any;
  export type SetBreakpointsActiveParameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type SetBreakpointsActiveReturn = any;
  export type SetSkipAllPausesParameters = {
    /** New value for skip pauses state. */
    skip: boolean;
  };
  export type SetSkipAllPausesReturn = any;
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
  export type RemoveBreakpointReturn = any;
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
  };
  export type ContinueToLocationReturn = any;
  export type StepOverParameters = any;
  export type StepOverReturn = any;
  export type StepIntoParameters = any;
  export type StepIntoReturn = any;
  export type StepOutParameters = any;
  export type StepOutReturn = any;
  export type PauseParameters = any;
  export type PauseReturn = any;
  export type ScheduleStepIntoAsyncParameters = any;
  export type ScheduleStepIntoAsyncReturn = any;
  export type ResumeParameters = any;
  export type ResumeReturn = any;
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
  export type SetPauseOnExceptionsReturn = any;
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
  export type SetVariableValueReturn = any;
  export type SetAsyncCallStackDepthParameters = {
    /** Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default). */
    maxDepth: number;
  };
  export type SetAsyncCallStackDepthReturn = any;
  export type SetBlackboxPatternsParameters = {
    /** Array of regexps that will be used to check script url for blackbox state. */
    patterns: string[];
  };
  export type SetBlackboxPatternsReturn = any;
  export type SetBlackboxedRangesParameters = {
    /** Id of the script. */
    scriptId: Runtime.ScriptId;
    positions: ScriptPosition[];
  };
  export type SetBlackboxedRangesReturn = any;
}
/** This domain is deprecated - use Runtime or Log instead. */
export class Console {
  private _messageAdded: Console.MessageAddedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification. */
  public enable(): Promise<void> {
    return this._client.send<void>("Console.enable");
  }
  /** Disables console domain, prevents further console messages from being reported to the client. */
  public disable(): Promise<void> {
    return this._client.send<void>("Console.disable");
  }
  /** Does nothing. */
  public clearMessages(): Promise<void> {
    return this._client.send<void>("Console.clearMessages");
  }
  /** Issued when new console message is added. */
  get messageAdded(): Console.MessageAddedHandler | null {
    return this._messageAdded;
  }
  set messageAdded(handler: Console.MessageAddedHandler | null) {
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
  export type EnableParameters = any;
  export type EnableReturn = any;
  export type DisableParameters = any;
  export type DisableReturn = any;
  export type ClearMessagesParameters = any;
  export type ClearMessagesReturn = any;
}
export class Profiler {
  private _consoleProfileStarted: Profiler.ConsoleProfileStartedHandler | null = null;
  private _consoleProfileFinished: Profiler.ConsoleProfileFinishedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public enable(): Promise<void> {
    return this._client.send<void>("Profiler.enable");
  }
  public disable(): Promise<void> {
    return this._client.send<void>("Profiler.disable");
  }
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  public setSamplingInterval(params: Profiler.SetSamplingIntervalParameters): Promise<void> {
    return this._client.send<void>("Profiler.setSamplingInterval", params);
  }
  public start(): Promise<void> {
    return this._client.send<void>("Profiler.start");
  }
  public stop(): Promise<Profiler.StopReturn> {
    return this._client.send<Profiler.StopReturn>("Profiler.stop");
  }
  /** Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code coverage may be incomplete. Enabling prevents running optimized code and resets execution counters. */
  public startPreciseCoverage(params: Profiler.StartPreciseCoverageParameters): Promise<void> {
    return this._client.send<void>("Profiler.startPreciseCoverage", params);
  }
  /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows executing optimized code. */
  public stopPreciseCoverage(): Promise<void> {
    return this._client.send<void>("Profiler.stopPreciseCoverage");
  }
  /** Collect coverage data for the current isolate, and resets execution counters. Precise code coverage needs to have started. */
  public takePreciseCoverage(): Promise<Profiler.TakePreciseCoverageReturn> {
    return this._client.send<Profiler.TakePreciseCoverageReturn>("Profiler.takePreciseCoverage");
  }
  /** Collect coverage data for the current isolate. The coverage data may be incomplete due to garbage collection. */
  public getBestEffortCoverage(): Promise<Profiler.GetBestEffortCoverageReturn> {
    return this._client.send<Profiler.GetBestEffortCoverageReturn>("Profiler.getBestEffortCoverage");
  }
  /** Sent when new profile recording is started using console.profile() call. */
  get consoleProfileStarted(): Profiler.ConsoleProfileStartedHandler | null {
    return this._consoleProfileStarted;
  }
  set consoleProfileStarted(handler: Profiler.ConsoleProfileStartedHandler | null) {
    if (this._consoleProfileStarted) {
      this._client.removeListener("Profiler.consoleProfileStarted", this._consoleProfileStarted);
    }
    this._consoleProfileStarted = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileStarted", handler);
    }
  }
  get consoleProfileFinished(): Profiler.ConsoleProfileFinishedHandler | null {
    return this._consoleProfileFinished;
  }
  set consoleProfileFinished(handler: Profiler.ConsoleProfileFinishedHandler | null) {
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
  export type EnableParameters = any;
  export type EnableReturn = any;
  export type DisableParameters = any;
  export type DisableReturn = any;
  export type SetSamplingIntervalParameters = {
    /** New sampling interval in microseconds. */
    interval: number;
  };
  export type SetSamplingIntervalReturn = any;
  export type StartParameters = any;
  export type StartReturn = any;
  export type StopParameters = any;
  export type StopReturn = {
    /** Recorded profile. */
    profile: Profile;
  };
  export type StartPreciseCoverageParameters = {
    /** Collect accurate call counts beyond simple 'covered' or 'not covered'. */
    callCount?: boolean;
  };
  export type StartPreciseCoverageReturn = any;
  export type StopPreciseCoverageParameters = any;
  export type StopPreciseCoverageReturn = any;
  export type TakePreciseCoverageParameters = any;
  export type TakePreciseCoverageReturn = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
  export type GetBestEffortCoverageParameters = any;
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
  public enable(): Promise<void> {
    return this._client.send<void>("HeapProfiler.enable");
  }
  public disable(): Promise<void> {
    return this._client.send<void>("HeapProfiler.disable");
  }
  public startTrackingHeapObjects(params: HeapProfiler.StartTrackingHeapObjectsParameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.startTrackingHeapObjects", params);
  }
  public stopTrackingHeapObjects(params: HeapProfiler.StopTrackingHeapObjectsParameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.stopTrackingHeapObjects", params);
  }
  public takeHeapSnapshot(params: HeapProfiler.TakeHeapSnapshotParameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.takeHeapSnapshot", params);
  }
  public collectGarbage(): Promise<void> {
    return this._client.send<void>("HeapProfiler.collectGarbage");
  }
  public getObjectByHeapObjectId(params: HeapProfiler.GetObjectByHeapObjectIdParameters): Promise<HeapProfiler.GetObjectByHeapObjectIdReturn> {
    return this._client.send<HeapProfiler.GetObjectByHeapObjectIdReturn>("HeapProfiler.getObjectByHeapObjectId", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  public addInspectedHeapObject(params: HeapProfiler.AddInspectedHeapObjectParameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.addInspectedHeapObject", params);
  }
  public getHeapObjectId(params: HeapProfiler.GetHeapObjectIdParameters): Promise<HeapProfiler.GetHeapObjectIdReturn> {
    return this._client.send<HeapProfiler.GetHeapObjectIdReturn>("HeapProfiler.getHeapObjectId", params);
  }
  public startSampling(params: HeapProfiler.StartSamplingParameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.startSampling", params);
  }
  public stopSampling(): Promise<HeapProfiler.StopSamplingReturn> {
    return this._client.send<HeapProfiler.StopSamplingReturn>("HeapProfiler.stopSampling");
  }
  get addHeapSnapshotChunk(): HeapProfiler.AddHeapSnapshotChunkHandler | null {
    return this._addHeapSnapshotChunk;
  }
  set addHeapSnapshotChunk(handler: HeapProfiler.AddHeapSnapshotChunkHandler | null) {
    if (this._addHeapSnapshotChunk) {
      this._client.removeListener("HeapProfiler.addHeapSnapshotChunk", this._addHeapSnapshotChunk);
    }
    this._addHeapSnapshotChunk = handler;
    if (handler) {
      this._client.on("HeapProfiler.addHeapSnapshotChunk", handler);
    }
  }
  get resetProfiles(): HeapProfiler.ResetProfilesHandler | null {
    return this._resetProfiles;
  }
  set resetProfiles(handler: HeapProfiler.ResetProfilesHandler | null) {
    if (this._resetProfiles) {
      this._client.removeListener("HeapProfiler.resetProfiles", this._resetProfiles);
    }
    this._resetProfiles = handler;
    if (handler) {
      this._client.on("HeapProfiler.resetProfiles", handler);
    }
  }
  get reportHeapSnapshotProgress(): HeapProfiler.ReportHeapSnapshotProgressHandler | null {
    return this._reportHeapSnapshotProgress;
  }
  set reportHeapSnapshotProgress(handler: HeapProfiler.ReportHeapSnapshotProgressHandler | null) {
    if (this._reportHeapSnapshotProgress) {
      this._client.removeListener("HeapProfiler.reportHeapSnapshotProgress", this._reportHeapSnapshotProgress);
    }
    this._reportHeapSnapshotProgress = handler;
    if (handler) {
      this._client.on("HeapProfiler.reportHeapSnapshotProgress", handler);
    }
  }
  /** If heap objects tracking has been started then backend regularly sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
  get lastSeenObjectId(): HeapProfiler.LastSeenObjectIdHandler | null {
    return this._lastSeenObjectId;
  }
  set lastSeenObjectId(handler: HeapProfiler.LastSeenObjectIdHandler | null) {
    if (this._lastSeenObjectId) {
      this._client.removeListener("HeapProfiler.lastSeenObjectId", this._lastSeenObjectId);
    }
    this._lastSeenObjectId = handler;
    if (handler) {
      this._client.on("HeapProfiler.lastSeenObjectId", handler);
    }
  }
  /** If heap objects tracking has been started then backend may send update for one or more fragments */
  get heapStatsUpdate(): HeapProfiler.HeapStatsUpdateHandler | null {
    return this._heapStatsUpdate;
  }
  set heapStatsUpdate(handler: HeapProfiler.HeapStatsUpdateHandler | null) {
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
  export type EnableParameters = any;
  export type EnableReturn = any;
  export type DisableParameters = any;
  export type DisableReturn = any;
  export type StartTrackingHeapObjectsParameters = {
    trackAllocations?: boolean;
  };
  export type StartTrackingHeapObjectsReturn = any;
  export type StopTrackingHeapObjectsParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken when the tracking is stopped. */
    reportProgress?: boolean;
  };
  export type StopTrackingHeapObjectsReturn = any;
  export type TakeHeapSnapshotParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken. */
    reportProgress?: boolean;
  };
  export type TakeHeapSnapshotReturn = any;
  export type CollectGarbageParameters = any;
  export type CollectGarbageReturn = any;
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
  export type AddInspectedHeapObjectReturn = any;
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
  export type StartSamplingReturn = any;
  export type StopSamplingParameters = any;
  export type StopSamplingReturn = {
    /** Recorded sampling heap profile. */
    profile: SamplingHeapProfile;
  };
}
