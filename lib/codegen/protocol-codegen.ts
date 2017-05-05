import * as Protocol from "./protocol";

export interface IProtocolCodegenOptions {
  clientModuleName?: string;
  indent?: string;
  typescript?: boolean;
}

/**
 * Generate Typescript interface to use with the DebuggingProtocol#domains(protocol) method.
 */
export default class ProtocolCodegen {
  private indent: string;
  private typescript: boolean;
  private clientModuleName: string;
  private code: string | undefined = undefined;
  private indentStack: string[] = [""];

  constructor(options: IProtocolCodegenOptions) {
    const opts = options || {};
    this.clientModuleName = opts.clientModuleName || "chrome-debugging-client";
    this.indent = opts.indent || "  ";
    this.typescript = !!opts.typescript;
  }

  get currentIndent(): string {
    return this.indentStack[this.indentStack.length - 1];
  }

  public generate(protocol: Protocol.IProtocol): string {
    this.code = "";
    this.indentStack.length = 1;

    this.appendProtocolVersionComment(protocol.version);
    this.appendClientImport();
    each(protocol.domains, (domain) => {
      const { domain: domainName, events, commands, types } = domain;

      this.appendComment(domain);
      this.appendDomainClass(domainName, () => {
        each(events, (event) => {
          this.appendEventMember(event, domainName);
        });
        this.appendClientMember();
        this.appendDomainConstructor();
        each(commands, (command) => {
          this.appendComment(command);
          this.appendCommandMethod(command, domainName);
        });
        each(events, (event) => {
          this.appendComment(event);
          this.appendEventAccessors(event, domainName);
        });
      });

      this.generateDomainTypeNamespace(domainName, () => {
        each(types, (type) => {
          this.appendComment(type);
          this.appendType(type);
        });
        each(events, (event) => {
          this.appendEventParametersType(event);
          this.appendEventHandlerType(event);
        });
        each(commands, (command) => {
          this.appendCommandTypes(command);
        });
      });
    });
    const code = this.code;
    this.code = undefined;
    return code;
  }

  protected appendProtocolVersionComment(version: Protocol.IVersion) {
    this.append("/**");
    this.append(` * Debugging Protocol ${version.major}.${version.minor} Domains`);
    this.append(` * Generated on ${new Date()}`);
    this.append(" */");
    this.append("/* tslint:disable */");
  }

  protected appendClientImport() {
    if (this.typescript) {
      this.append(`import { IDebuggingProtocolClient } from "${this.clientModuleName}";`);
    } else {
      this.append("\"use strict\";");
    }
  }

  protected appendDomainClass(domainName: string, cb: () => void) {
    const moduleExport = this.typescript ? "export" : `module.exports.${domainName} =`;
    this.append(`${moduleExport} class ${domainName} {`);
    this.block(cb);
    this.append("}");
  }

  protected generateDomainTypeNamespace(domainName: string, cb: () => void) {
    if (!this.typescript) {
      return;
    }
    this.append(`export namespace ${domainName} {`);
    this.block(cb);
    this.append("}");
  }

  protected appendEventMember(event: Protocol.IEvent, domainName: string) {
    if (!this.typescript) {
      return;
    }
    const name = event.name;
    this.append(`private _${name}: ${this.handlerTypeName(name, domainName)} | null = null;`);
  }

  protected appendClientMember() {
    if (!this.typescript) {
      return;
    }
    this.append("private _client: IDebuggingProtocolClient;");
  }

  protected appendDomainConstructor() {
    const type = this.typescript ? ": IDebuggingProtocolClient" : "";
    this.append(`constructor(client${type}) {`);
    this.block(() => {
      this.append("this._client = client;");
    });
    this.append("}");
  }

  protected appendCommandMethod(command: Protocol.ICommand, domainName: string) {
    const name = command.name;
    const fullname = `${domainName}.${name}`;
    const paramsType = this.typescript ? `: ${this.parametersTypeName(name, domainName)}` : "";
    const params = command.parameters ? `params${paramsType}` : "";
    const paramsArg = command.parameters ? ", params" : "";
    const returnType = this.typescript ? command.returns ? `<${this.returnTypeName(name, domainName)}>` : "<void>" : "";
    const returns = this.typescript ? `: Promise${returnType}` : "";
    const access = this.typescript ? "public " : "";

    this.append(`${access}${name}(${params})${returns} {`);
    this.block(() => {
      this.append(`return this._client.send${returnType}("${fullname}"${paramsArg});`);
    });
    this.append("}");
  }

  protected appendEventAccessors(event: Protocol.IEvent, domainName: string) {
    const name = event.name;
    const fullname = `${domainName}.${name}`;
    const handlerType = this.typescript ? `: ${this.handlerTypeName(name, domainName)} | null` : "";

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

  protected appendType(type: Protocol.IType) {
    const properties = type.properties;
    if (type.type === "object" && properties && properties.length) {
      this.append(`export interface ${type.id} {`);
      this.block(() => {
        each(properties, (prop) => this.generateProperty(prop));
      });
      this.append("}");
    } else {
      this.append(`export type ${type.id} = ${this.typeString(type)};`);
    }
  }

  protected appendEventParametersType(event: Protocol.IEvent) {
    if (event.parameters) {
      this.generateObjectTypeAlias(`${this.parametersTypeName(event.name)}`, event.parameters);
    }
  }

  protected appendEventHandlerType(event: Protocol.IEvent) {
    const params = event.parameters ? `params: ${this.parametersTypeName(event.name)}` : "";
    this.append(`export type ${this.handlerTypeName(event.name)} = (${params}) => void;`);
  }

  protected block(cb: () => void) {
    this.indentStack.push(this.currentIndent + this.indent);
    cb();
    this.indentStack.pop();
  }

  protected append(line: string) {
    this.code += this.currentIndent + line + "\n";
  }

  protected generateProperty(desc: Protocol.INamedDescriptor) {
    this.appendComment(desc);
    this.append(this.namedTypeString(desc));
  }

  protected appendComment(obj: { description?: string }) {
    if (!obj.description) {
      return;
    }
    this.append(`/** ${obj.description} */`);
  }

  protected appendCommandTypes(command: Protocol.ICommand) {
    const name = command.name;
    this.generateObjectTypeAlias(this.parametersTypeName(name), command.parameters);
    this.generateObjectTypeAlias(this.returnTypeName(name), command.returns);
  }

  protected returnTypeName(name: string, domainName?: string) {
    return buildTypeName(name, "Return", domainName);
  }

  protected parametersTypeName(name: string, domainName?: string) {
    return buildTypeName(name, "Parameters", domainName);
  }

  protected handlerTypeName(name: string, domainName?: string) {
    return buildTypeName(name, "Handler", domainName);
  }

  protected generateObjectTypeAlias(name: string, props: Protocol.INamedDescriptor[] | undefined) {
    if (!props) {
      return;
    }
    if (props.length) {
      this.append(`export type ${name} = {`);
      this.block(() => {
        props.forEach((prop) => this.generateProperty(prop));
      });
      this.append("};");
    } else {
      this.append(`export type ${name} = any;`);
    }
  }

  protected namedTypeString(desc: Protocol.INamedDescriptor): string {
    return `${desc.name}${desc.optional ? "?" : ""}: ${this.typeString(desc)};`;
  }

  protected typeString(desc: Protocol.IDescriptor | undefined, isArray?: boolean): string {
    let typeName: string;
    let simple = true;
    if (desc) {
      if (desc.$ref) {
        typeName = desc.$ref;
      } else {
        const properties = desc.properties;
        switch (desc.type) {
          case "integer":
            typeName = "number";
            break;
          case "number":
          case "boolean":
          case "any":
            typeName = desc.type;
            break;
          case "string":
            if (desc.enum) {
              simple = false;
              typeName = desc.enum.map((str) => JSON.stringify(str)).join(" | ");
            } else {
              typeName = "string";
            }
            break;
          case "array":
            typeName = this.typeString(desc.items, true);
            break;
          case "object":
            if (properties && properties.length) {
              simple = false;
              typeName = "{ " + properties.map((p) => this.namedTypeString(p)).join(" ") + " }";
            } else {
              typeName = "any";
            }
            break;
          default:
            throw new Error("unexpected type" + JSON.stringify(desc));
        }
      }
    } else {
      typeName = "any";
    }
    return isArray ? simple ? `${typeName}[]` : `Array<${typeName}>` : typeName;
  }
}

function each<T>(arr: T[] | undefined, cb: (arg: T) => void) {
  if (arr) {
    for (const item of arr) {
      cb(item);
    }
  }
}

function buildTypeName(name: string, suffix: string, domainName?: string) {
  let typeName = name.substring(0, 1).toUpperCase() + name.substring(1) + suffix;
  if (domainName) {
    typeName = `${domainName}.${typeName}`;
  }
  return typeName;
}
