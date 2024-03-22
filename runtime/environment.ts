import { MAKE_BOOL, MAKE_NULL, RuntimeVal } from "./values.ts";

export function setupGlobalEnv() {
  const env = new Environment();
  env.declareVar("true", MAKE_BOOL(true), true);
  env.declareVar("false", MAKE_BOOL(false), true);
  env.declareVar("null", MAKE_NULL(), true);
  return env;
}

export default class Environment {
  private parent?: Environment;

  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    const global = parentEnv ? true : false;
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw new Error(`Variable ${varname} already declared in this scope`);
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }

    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw `Cannot assign to constant variable ${varname}`;
    }
    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Cannot resolve ${varname} as it is not declared in this scope`;
    }

    return this.parent.resolve(varname);
  }
}
