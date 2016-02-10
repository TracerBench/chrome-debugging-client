import * as fs from "fs";
import * as os from "os";
import * as Protocol from "./protocol";

export interface ProtocolCodegenOptions {
  clientModuleName?: string;
  indent?: string;
  typescript?: boolean;
}

/**
 * Generate Typescript interface to use with the DebuggingProtocol#domains(protocol) method.
 */
export default class ProtocolCodegen {
  indent: string;
  typescript: boolean;
  clientModuleName: string;

  indentStack: string[] = [""];
  code: string = undefined;

  constructor(options: ProtocolCodegenOptions) {
    let opts = options || {};
    this.clientModuleName = opts.clientModuleName || "chrome-debugging-client";
    this.indent = opts.indent || "  ";
    this.typescript = !!opts.typescript;
  }

  get currentIndent(): string {
    return this.indentStack[this.indentStack.length - 1];
  }

  generate(protocol: Protocol.Protocol): string {
    this.code = "";
    this.indentStack.length = 1;

    this.appendProtocolVersionComment(protocol.version);
    this.appendClientImport();
    each(protocol.domains, domain => {
      let domainName = domain.domain;
      let events = domain.events;
      let commands = domain.commands;
      let types = domain.types;

      this.appendComment(domain);
      this.appendDomainClass(domainName, () => {
        each(events, event => {
          this.appendEventMember(event, domainName);
        });
        this.appendClientMember();
        this.appendDomainConstructor();
        each(commands, command => {
          this.appendComment(command);
          this.appendCommandMethod(command, domainName);
        });
        each(events, event => {
          this.appendComment(event);
          this.appendEventAccessors(event, domainName);
        });
      });

      this.generateDomainTypeNamespace(domainName, () => {
        each(types, type => {
          this.appendComment(type);
          this.appendType(type);
        });
        each(events, event => {
          this.appendEventParametersType(event);
          this.appendEventHandlerType(event);
        });
        each(commands, command => {
          this.appendCommandTypes(command);
        });
      });
    });
    let code = this.code;
    this.code = undefined;
    return code;
  }

  appendProtocolVersionComment(version: Protocol.Version) {
    this.append("/**");
    this.append(` * Debugging Protocol ${version.major}.${version.minor} Domains`);
    this.append(` * Generated on ${new Date()}`);
    this.append(" */");
  }

  appendClientImport() {
    if (this.typescript) {
      this.append(`import { IDebuggingProtocolClient } from "${this.clientModuleName}";`);
    } else {
      this.append("\"use strict\";");
    }
  }

  appendDomainClass(domainName: string, cb: () => void) {
    let moduleExport = this.typescript ? "export" : `module.exports.${domainName} =`;
    this.append(`${moduleExport} class ${domainName} {`);
    this.block(cb);
    this.append("}");
  }

  generateDomainTypeNamespace(domainName: string, cb: () => void) {
    if (!this.typescript) return;
    this.append(`export namespace ${domainName} {`);
    this.block(cb);
    this.append("}");
  }

  appendEventMember(event: Protocol.Event, domainName: string) {
    if (!this.typescript) {
      return;
    }
    let name = event.name;
    this.append(`private _${name}: ${domainName}.${name}_Handler = undefined;`);
  }

  appendClientMember() {
    if (!this.typescript) {
      return;
    }
    this.append("private _client: IDebuggingProtocolClient = undefined;");
  }

  appendDomainConstructor() {
    let type = this.typescript ? ": IDebuggingProtocolClient" : "";
    this.append(`constructor(client${type}) {`);
    this.block(() => {
      this.append("this._client = client;");
    });
    this.append("}");
  }

  appendCommandMethod(command: Protocol.Command, domainName: string) {
    let name = command.name;
    let fullname = `${domainName}.${name}`;
    let paramsType = this.typescript ? `: ${fullname}_Parameters` : "";
    let params = command.parameters ? `params${paramsType}` : "";
    let paramsArg = command.parameters ? ", params" : "";
    let returnType = this.typescript ? command.returns ? `<${fullname}_Return>` : "<void>" : "";
    let returns = this.typescript ? `: Promise${returnType}` : "";

    this.append(`${name}(${params})${returns} {`);
    this.block(() => {
      this.append(`return this._client.send${returnType}("${fullname}"${paramsArg});`);
    });
    this.append("}");
  }

  appendEventAccessors(event: Protocol.Event, domainName: string) {
    let name = event.name;
    let fullname = `${domainName}.${name}`;
    let handlerType = this.typescript ? `: ${fullname}_Handler` : "";

    this.append(`get ${name}()${handlerType} {`);
    this.block(() => {
      this.append(`return this._${name};`);
    });
    this.append("}");
    this.append(`set ${name}(handler${handlerType}) {`);
    this.block(() => {
      this.append(`if (this._${name}) {`);
      this.block(() => {
        this.append(`this._client.removeListener("${fullname}", this._${name});`);
      });
      this.append("}");
      this.append(`this._${name} = handler;`);
      this.append("if (handler) {");
      this.block(() => {
        this.append(`this._client.on("${fullname}", handler);`);
      });
      this.append(`}`);
    });
    this.append("}");
  }

  appendType(type: Protocol.Type) {
    let properties = type.properties;
    if (type.type === "object" && properties && properties.length) {
      this.append(`export interface ${type.id} {`);
      this.block(() => {
        each(properties, prop => this.generateProperty(prop));
      });
      this.append("}");
    } else {
      this.append(`export type ${type.id} = ${this.typeString(type)};`);
    }
  }

  appendEventParametersType(event: Protocol.Event) {
    this.generateObjectTypeAlias(`${event.name}_Parameters`, event.parameters);
  }

  appendEventHandlerType(event: Protocol.Event) {
    let params = event.parameters ? `params: ${event.name}_Parameters` : "";
    this.append(`export type ${event.name}_Handler = (${params}) => void;`);
  }

  block(cb: () => void) {
    this.indentStack.push(this.currentIndent + this.indent);
    cb();
    this.indentStack.pop();
  }

  append(line) {
    this.code += this.currentIndent + line + "\n";
  }

  generateProperty(desc: Protocol.NamedDescriptor) {
    this.appendComment(desc);
    this.append(this.namedTypeString(desc));
  }

  appendComment(obj: { description?: string }) {
    if (!obj.description) {
      return;
    }
    this.append(`/** ${obj.description} */`);
  }

  appendCommandTypes(command: Protocol.Command) {
    let name = command.name;
    this.generateObjectTypeAlias(`${name}_Parameters`, command.parameters);
    this.generateObjectTypeAlias(`${name}_Return`, command.returns);
  }

  generateObjectTypeAlias(name: string, props: Protocol.NamedDescriptor[]) {
    if (!props) {
      return;
    }
    if (props.length) {
      this.append(`export type ${name} = {`);
      this.block(() => {
        props.forEach(prop => this.generateProperty(prop));
      });
      this.append("};");
    } else {
      this.append(`export type ${name} = any;`);
    }
  }

  namedTypeString(desc: Protocol.NamedDescriptor): string {
    return `${desc.name}${desc.optional ? "?" : ""}: ${this.typeString(desc)};`;
  }

  typeString(desc: Protocol.Descriptor): string {
    if (desc.$ref) {
      return desc.$ref;
    }
    let properties = desc.properties;
    switch (desc.type) {
      case "integer":
        return "number";
      case "number":
      case "boolean":
      case "any":
        return desc.type;
      case "string":
        if (desc.enum) {
          return desc.enum.map(JSON.stringify).join(" | ");
        }
        return "string";
      case "array":
        return this.typeString(desc.items) + "[]";
      case "object":
        if (properties && properties.length) {
          return "{ " + properties.map(p => this.namedTypeString(p)).join(" ") + " }";
        }
        return "any";
      default:
        throw new Error("unexpected type" + JSON.stringify(desc));
    }
  }
}

function each<T>(arr: T[], cb: (arg: T) => void) {
  if (!arr) {
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i]);
  }
}
