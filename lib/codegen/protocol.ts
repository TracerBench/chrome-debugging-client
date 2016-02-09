/**
 * Describes the protocol.json
 */
export interface Protocol {
  domains: Domain[];
  version: Version;
}

export interface Version {
  major: string;
  minor: string;
}

export interface Domain {
  domain: string;
  description?: string;
  hidden?: boolean;
  commands?: Command[];
  events?: Event[];
  types?: Type[];
}

export interface Command {
  name: string;
  description?: string;
  hidden?: boolean;
  parameters?: NamedDescriptor[];
  returns?: NamedDescriptor[];
}

export interface Event {
  name: string;
  description?: string;
  hidden?: boolean;
  deprecated?: boolean;
  parameters?: NamedDescriptor[];
}

export interface Type extends Descriptor {
  id: string;
}

export interface NamedDescriptor extends Descriptor {
  name: string;
  optional?: boolean;
}

export interface Descriptor {
  description?: string;
  hidden?: boolean;
  $ref?: string;
  type?: string;
  enum?: string[];
  items?: Descriptor;
  properties?: NamedDescriptor[];
}
