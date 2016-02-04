import * as fs from "fs";
import * as os from "os";
import { Protocol } from "./debugging-protocol-factory";

export default class ProtocolCodegen {
  code: string;
  indentStack: string[];
  indent = "  ";
  get currentIndent(): string {
    return this.indentStack[this.indentStack.length - 1];
  }

  generate(protocol: Protocol, filename: string): string {
    this.code = "";
    this.indentStack = [""];
    this.append("/**");
    this.append(` * Generated from protocol ${filename} (version ${protocol.version.major}.${protocol.version.minor})`);
    this.append(" */");
    this.append("");
    protocol.domains.forEach(domain => {
      this.generateInterface(domain);
    });
    this.append(`interface DebuggingProtocolDomains {`);
    this.pushIndent();
    protocol.domains.forEach(domain => {
      this.append(`${domain.domain}: ${domain.domain};`);
    });
    this.popIndent();
    this.append(`}`);
    this.append(`export default DebuggingProtocolDomains;`);
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

  generateInterface(domain: Protocol.Domain) {
    this.generateComment(domain);
    this.append(`export interface ${domain.domain} {`);
    this.pushIndent();
    this.generateMethods(domain);
    this.generateEventOverloads(domain);
    this.popIndent();
    this.append("}");
    if (domain.types) {
      this.append(`export namespace ${domain.domain} {`);
      this.pushIndent();
      domain.types.forEach(type => this.generateType(type));
      this.popIndent();
      this.append("}");
    }
  }

  generateType(type: Protocol.Type) {
    this.generateComment(type);
    if (type.type === "object" && type.properties) {
      this.append(`export type ${type.id} = {`);
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

  generateMethods(domain: Protocol.Domain) {
    if (!domain.commands) {
      return;
    }
    domain.commands.forEach(command => this.generateMethod(command, domain.domain));
  }

  generateMethod(command: Protocol.Command, domain: string) {
    this.generateComment(command);
    let line = `${command.name}(`;
    if (command.parameters) {
      line += "params: {";
      this.append(line);
      this.pushIndent();
      this.generateProperties(command.parameters, domain);
      this.popIndent();
      line = "}";
    }
    line += "): Promise<";
    if (command.returns) {
      line += "{";
      this.append(line);
      this.pushIndent();
      this.generateProperties(command.returns, domain);
      this.popIndent();
      line = "}";
    } else {
      line += "void";
    }
    line += ">;";
    this.append(line);
  }

  generateEventOverloads(domain: Protocol.Domain) {
    if (!domain.events) {
      return;
    }
    domain.events.forEach(event => this.generateEvent(event, domain.domain));
  }

  generateEvent(event: Protocol.Event, domain: string) {
    this.generateComment(event);
    if (event.parameters) {
      this.append(`${event.name}: (evt: {`);
      this.pushIndent();
      this.generateProperties(event.parameters, domain);
      this.popIndent();
      this.append("}) => void;");
    } else {
      this.append(`${event.name}: () => void;`);
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
    s += this.typeString(desc, domain);
    return s;
  }

  typeString(desc: Protocol.Descriptor, domain?: string): string {
    if (desc.$ref) {
      if (domain) {
        return this.qualifiedTypeId(domain, desc.$ref);
      }
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
        return this.typeString(desc.items, domain) + "[]";
      case "object":
        if (desc.properties) {
          return "{ " + desc.properties.map(p => this.namedTypeString(p, domain)).join("; ") + " }";
        }
        return "any";
      default:
        throw new Error("unexpected type" + JSON.stringify(desc));
    }
  }
}
