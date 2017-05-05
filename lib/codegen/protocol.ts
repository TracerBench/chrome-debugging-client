/**
 * Describes the protocol.json
 */
export interface IProtocol {
  domains: IDomain[];
  version: IVersion;
}

export interface IVersion {
  major: string;
  minor: string;
}

export interface IDomain {
  domain: string;
  description?: string;
  hidden?: boolean;
  commands?: ICommand[];
  events?: IEvent[];
  types?: IType[];
}

export interface ICommand {
  name: string;
  description?: string;
  hidden?: boolean;
  parameters?: INamedDescriptor[];
  returns?: INamedDescriptor[];
}

export interface IEvent {
  name: string;
  description?: string;
  hidden?: boolean;
  deprecated?: boolean;
  parameters?: INamedDescriptor[];
}

export interface IType extends IDescriptor {
  id: string;
}

export interface INamedDescriptor extends IDescriptor {
  name: string;
  optional?: boolean;
}

export interface IDescriptor {
  description?: string;
  hidden?: boolean;
  $ref?: string;
  type?: string;
  enum?: string[];
  items?: IDescriptor;
  properties?: INamedDescriptor[];
}
