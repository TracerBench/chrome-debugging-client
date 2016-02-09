import * as fs from "fs";
import * as os from "os";
import * as Protocol from "./protocol";

/**
 * Generate Typescript interface to use with the DebuggingProtocol#domains(protocol) method.
 */
export default class ProtocolCodegen {
  clientModule: string = "chrome-debugging-client";
  code: string;
  indentStack: string[];
  indent = "  ";
  get currentIndent(): string {
    return this.indentStack[this.indentStack.length - 1];
  }

  generate(protocol: Protocol.Protocol): string {
    this.code = "";
    this.indentStack = [""];
    this.append(`import { IDebuggingProtocolClient } from "${this.clientModule}";`);
    protocol.domains.forEach(domain => {
      this.generateDomain(domain);
    });
    return this.code;
  }

  pushIndent() {
    this.indentStack.push(this.currentIndent + this.indent);
  }

  popIndent() {
    this.indentStack.pop();
  }

  append(line) {
    this.code += this.currentIndent + line + "\n";
  }

  generateDomain(domain: Protocol.Domain) {
    this.generateComment(domain);
    this.append(`export class ${domain.domain} {`);
    this.pushIndent();
    this.append("_client: IDebuggingProtocolClient;");
    if (domain.events) {
      domain.events.forEach(event => this.generateEventProperty(event, domain.domain));
    }
    this.append("constructor(client: IDebuggingProtocolClient) {");
    this.pushIndent();
    this.append("this._client = client;");
    this.popIndent();
    this.append("}");
    if (domain.commands) {
      domain.commands.forEach(command => this.generateMethod(command, domain.domain));
    }
    if (domain.events) {
      domain.events.forEach(event => this.generateEvent(event, domain.domain));
    }
    this.popIndent();
    this.append("}");
    this.append(`export namespace ${domain.domain} {`);
    this.pushIndent();
    if (domain.types) {
      domain.types.forEach(type => this.generateType(type));
    }
    if (domain.events) {
      domain.events.forEach(event => this.generateEventTypes(event));
    }
    if (domain.commands) {
      domain.commands.forEach(command => this.generateCommandTypes(command));
    }
    this.popIndent();
    this.append("}");
  }

  generateType(type: Protocol.Type) {
    this.generateComment(type);
    if (type.type === "object" && type.properties) {
      this.append(`export interface ${type.id} {`);
      this.pushIndent();
      this.generateProperties(type.properties);
      this.popIndent();
      this.append("}");
    } else {
      this.append(`export type ${type.id} = ${this.typeString(type)};`);
    }
  }

  generateProperties(props: Protocol.NamedDescriptor[], domain?: string) {
    props.forEach(prop => this.generateProperty(prop, domain));
  }

  generateProperty(property: Protocol.NamedDescriptor, domain?: string) {
    this.generateComment(property);
    this.append(`${this.namedTypeString(property, domain)};`);
  }

  generateComment(obj: { description?: string }) {
    if (!obj.description) {
      return;
    }
    this.append(`/** ${obj.description} */`);
  }

  generateMethod(command: Protocol.Command, domain: string) {
    this.generateComment(command);
    let params = command.parameters ? `params: ${domain}.${command.name}_Parameters` : "";
    let args = command.parameters ? ", params" : "";
    let returns = command.returns ? `${domain}.${command.name}_Return` : "void";
    this.append(`${command.name}(${params}): Promise<${returns}> {`);
    this.pushIndent();
    this.append(`return this._client.send<${returns}>("${domain}.${command.name}"${args});`);
    this.popIndent();
    this.append("}");
  }

  generateEvent(event: Protocol.Event, domain: string) {
    this.generateComment(event);
    this.append(`get ${event.name}(): ${domain}.${event.name}_Handler {`);
    this.pushIndent();
    this.append(`return this._${event.name};`);
    this.popIndent();
    this.append("}");
    this.append(`set ${event.name}(handler: ${domain}.${event.name}_Handler) {`);
    this.pushIndent();
    this.append(`if (this._${event.name}) {`);
    this.pushIndent();
    this.append(`this._client.removeListener("${domain}.${event.name}", this._${event.name});`);
    this.popIndent();
    this.append(`}`);
    this.append(`this._${event.name} = handler;`);
    this.append(`if (handler) {`);
    this.pushIndent();
    this.append(`this._client.on("${domain}.${event.name}", handler);`);
    this.popIndent();
    this.append(`}`);
    this.popIndent();
    this.append("}");
  }

  generateEventProperty(event: Protocol.Event, domain: string) {
    this.append(`_${event.name}: ${domain}.${event.name}_Handler;`);
  }

  generateEventTypes(event: Protocol.Event) {
    if (event.parameters) {
      this.append(`export type ${event.name}_Parameters = {`);
      this.pushIndent();
      this.generateProperties(event.parameters);
      this.popIndent();
      this.append("}");
      this.append(`export type ${event.name}_Handler = (params: ${event.name}_Parameters) => void;`);
    } else {
      this.append(`export type ${event.name}_Handler = () => void;`);
    }
  }

  generateCommandTypes(command: Protocol.Command) {
    if (command.parameters) {
      this.append(`export type ${command.name}_Parameters = {`);
      this.pushIndent();
      this.generateProperties(command.parameters);
      this.popIndent();
      this.append("}");
    }
    if (command.returns) {
      this.append(`export type ${command.name}_Return = {`);
      this.pushIndent();
      this.generateProperties(command.returns);
      this.popIndent();
      this.append("}");
    }
  }

  qualifiedTypeId(domain, id) {
    if (id.indexOf(".") === -1) {
      return `${domain}.${id}`;
    }
    return id;
  }

  namedTypeString(desc: Protocol.NamedDescriptor, domain?: string): string {
    let s = desc.name;
    if (desc.optional) {
      s += "?";
    }
    s += ": ";
    s += this.typeString(desc);
    return s;
  }

  typeString(desc: Protocol.Descriptor): string {
    if (desc.$ref) {
      return desc.$ref;
    }
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
        if (desc.properties) {
          return "{ " + desc.properties.map(p => this.namedTypeString(p)).join("; ") + " }";
        }
        return "any";
      default:
        throw new Error("unexpected type" + JSON.stringify(desc));
    }
  }
}
