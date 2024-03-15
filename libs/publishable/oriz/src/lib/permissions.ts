/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The object that tracks the permission rules that users can set and query.
 */
export class Permissions<
  Action extends string,
  Subject extends string | object,
> {
  /**
   * The specially set property used in `toSubject` to notate a POJO as a specific subject type.
   */
  static readonly subjectKey = '__orizSubjectKey__';

  /**
   * Whether the permissions are locked.
   * If they are locked, they cannot be modified in any way, only read.
   */
  get locked() {
    return this._locked;
  }
  private _locked = false;

  /**
   * All of the rules of the instance structured as a map of maps of maps.
   *
   * The outermost map's keys represents all of the possible actions.
   * The second map's keys represents a subject as a key string.
   * The innermost map's keys represent a field of the subject, or `null` if fields are not relevant.
   * The innermost map's values represent an object containing a conditional function attached to the rule and a boolean, or `null` if no such function was attached.
   *
   * An action will only be allowed if `conditional` is `null`, the `conditional` returns `true` and `reverse` is `false`, or `conditional` returns `false` and `reverse` is `true`.
   */
  protected rules = new Map<
    Action,
    Map<
      string,
      Map<
        string | null,
        { conditional: (subject: any) => boolean; reverse: boolean } | null
      >
    >
  >();

  /**
   * A map of action aliases to actions.
   */
  protected aliasToActions = new Map<Action, Set<Action>>();

  /**
   * A map of actions to action aliases.
   */
  protected actionToAliases = new Map<Action, Set<Action>>();

  /**
   * Lock permissions so they cannot be edited.
   */
  lock(): void {
    this._locked = true;
  }

  /**
   * Unlock permissions so they can be edited.
   */
  unlock(): void {
    this._locked = false;
  }

  /**
   * Adds the specified action alias to this object and associate it with the given actions.
   * If an alias of the given name already exists, any unique actions will be added on top and old associations will not be overwritten.
   *
   * Does nothing if permissions are locked.
   *
   * @param alias An alias for existing actions.
   * @param actions The actions to associate with the alias.
   */
  addActionAlias(alias: Action, actions: ArrayOfOr<Action>): void {
    if (this._locked) {
      return;
    }

    const actionsArr = Array.isArray(actions) ? actions : [actions];
    const actionSet =
      this.aliasToActions.get(alias) ??
      (this.aliasToActions.set(alias, new Set()).get(alias) as Set<Action>);
    for (const action of actionsArr) {
      actionSet.add(action);

      const aliasSet =
        this.actionToAliases.get(action) ??
        (this.actionToAliases
          .set(action, new Set())
          .get(action) as Set<Action>);
      aliasSet.add(alias);
    }
  }

  /**
   * Disassociates actions from an action alias.
   * If no actions are specified, the entire action alias will be removed.
   *
   * Does nothing if permissions are locked.
   *
   * @param alias The action alias to affect.
   * @param actions The actions to disassociate from the alias.
   */
  deleteActionAlias(alias: Action, actions?: ArrayOfOr<Action>): void {
    if (this._locked) {
      return;
    }

    const actionSet = this.aliasToActions.get(alias);
    if (!actionSet) {
      return;
    }

    if (actions === undefined) {
      for (const action of actionSet) {
        this.actionToAliases.get(action)?.delete(alias);
      }
      this.aliasToActions.delete(alias);
      return;
    }

    const actionsArr = Array.isArray(actions) ? actions : [actions];
    for (const action of actionsArr) {
      actionSet.delete(action);
      this.actionToAliases.get(action)?.delete(alias);
    }
  }

  /**
   * Clear all action aliases.
   *
   * Does nothing if permissions are locked.
   */
  clearActionAliases(): void {
    if (this._locked) {
      return;
    }

    this.aliasToActions.clear();
    this.actionToAliases.clear();
  }

  /**
   * Mark an action as allowed on a subject.
   * If you specify a conditional, interpret that to mean "always forbid unless these specific conditions are met."
   * If the conditions are not met or it's impossible to tell, it will forbid.
   *
   * Does nothing if permissions are locked.
   *
   * @param action The action to allow.
   * @param subject The subject for which to allow the actions.
   * @param optional An object containing fields of the subjects for which the rule should be applicable to or a conditional function to apply when checking permissions.
   */
  allow<
    SubSubject extends
      | ObjToConstructor<Extract<Subject, object>>
      | Extract<Subject, string>,
  >(
    action: ArrayOfOr<SubSubject extends never ? never : Action>,
    subject: ArrayOfOr<SubSubject>,
    optional?: {
      fields?: ArrayOfOr<StrKeys<InstanceOf<SubSubject>>>;
      conditional?: (subject: InstanceOf<SubSubject>) => boolean;
    },
  ) {
    if (this._locked) {
      return;
    }

    const fields = optional?.fields ?? null;
    const fieldsArr = !fields
      ? null
      : Array.isArray(fields)
      ? fields
      : [fields];
    const conditional = optional?.conditional ?? null;
    const actionArr = Array.isArray(action) ? action : [action];
    const subjectArr = Array.isArray(subject) ? subject : [subject];
    const subjectKeys = subjectArr.map((subject) =>
      this.getSubjectKey(subject),
    );

    for (const action of actionArr) {
      const actionMap =
        this.rules.get(action) ??
        this.rules.set(action, new Map()).get(action)!;
      for (const subjectKey of subjectKeys) {
        const subjectMap =
          actionMap.get(subjectKey) ??
          actionMap.set(subjectKey, new Map()).get(subjectKey)!;
        if (!fieldsArr) {
          subjectMap.set(
            null,
            conditional ? { conditional, reverse: false } : null,
          );
          continue;
        }

        for (const field of fieldsArr) {
          subjectMap.set(
            field,
            conditional ? { conditional, reverse: false } : null,
          );
        }
      }
    }
  }

  /**
   * Mark an action as forbidden on a subject.
   * If you specify a conditional, interpret that to mean "always allow unless these specific conditions are met."
   * If the conditions are not met or it's impossible to tell, it will allow.
   *
   * Does nothing if permissions are locked.
   *
   * @param action The action to allow.
   * @param subject The subject for which to allow the actions.
   * @param optional An object containing fields of the subjects for which the rule should be applicable to or a conditional function to apply when checking permissions.
   */
  forbid<
    SubSubject extends
      | ObjToConstructor<Extract<Subject, object>>
      | Extract<Subject, string>,
  >(
    action: ArrayOfOr<SubSubject extends never ? never : Action>,
    subject: ArrayOfOr<SubSubject>,
    optional?: {
      fields?: ArrayOfOr<StrKeys<InstanceOf<SubSubject>>>;
      conditional?: (subject: InstanceOf<SubSubject>) => boolean;
    },
  ) {
    if (this._locked) {
      return;
    }

    const fields = optional?.fields ?? null;
    const fieldsArr = !fields
      ? null
      : Array.isArray(fields)
      ? fields
      : [fields];
    const conditional = optional?.conditional ?? null;
    const actionArr = Array.isArray(action) ? action : [action];
    const subjectArr = Array.isArray(subject) ? subject : [subject];
    const subjectKeys = subjectArr.map((subject) =>
      this.getSubjectKey(subject),
    );

    for (const action of actionArr) {
      const actionMap = this.rules.get(action);
      if (!actionMap) {
        continue;
      }

      for (const subjectKey of subjectKeys) {
        const subjectMap = actionMap.get(subjectKey);
        if (!subjectMap) {
          continue;
        }

        if (!fieldsArr) {
          if (conditional) {
            subjectMap.set(null, { conditional, reverse: true });
          } else {
            subjectMap.delete(null);
          }

          continue;
        }

        for (const field of fieldsArr) {
          if (conditional) {
            subjectMap.set(field, { conditional, reverse: true });
          } else {
            subjectMap.delete(field);
          }
        }
      }
    }
  }

  /**
   * Clear all rules.
   *
   * Does nothing if permissions are locked.
   */
  clearRules(): void {
    if (this._locked) {
      return;
    }

    this.rules.clear();
  }

  /**
   * Whether the specified action is allowed on the subject.
   *
   * Must use with `objToSubject` when using POJOs not created through a class constructor.
   * Not doing so will lead to indeterminate behavior.
   *
   * @param action The action to check.
   * @param subject The subject to check.
   * @param field The field of the subject to check, if any.
   *
   * @returns `true` if the action is allowed, `false` if it's forbidden.
   */
  can<SubSubject extends Subject | ObjToConstructor<Extract<Subject, object>>>(
    action: Action,
    subject: SubSubject,
    field?: StrKeys<InstanceOf<SubSubject>> | undefined,
  ): boolean {
    const aliasSet = this.actionToAliases.get(action);
    const actions = [action].concat(Array.from(aliasSet ?? []));
    for (const action of actions) {
      const actionMap = this.rules.get(action);
      if (!actionMap) {
        continue;
      }

      const subjectMap = actionMap.get(this.getSubjectKey(subject));
      if (!subjectMap) {
        continue;
      }

      const condition = subjectMap.get(field ?? null);
      if (condition === undefined) {
        continue;
      }

      if (condition === null) {
        return true;
      }

      const { conditional, reverse } = condition;
      if (typeof subject === 'function' || typeof subject === 'string') {
        return !reverse;
      }

      return conditional(subject) !== reverse;
    }

    return false;
  }

  /**
   * Whether the specified action is forbidden on the subject.
   *
   * Must use with `objToSubject` when using POJOs not created through a class constructor.
   * Not doing so will lead to indeterminate behavior.
   *
   * @param action The action to check.
   * @param subject The subject to check.
   * @param field The field of the subject to check, if any.
   *
   * @returns `true` if the action is forbidden, `false` if it's allowed.
   */
  cannot<
    SubSubject extends Subject | ObjToConstructor<Extract<Subject, object>>,
  >(
    action: Action,
    subject: SubSubject,
    field?: StrKeys<InstanceOf<SubSubject>> | undefined,
  ): boolean {
    return !this.can(action, subject, field);
  }

  /**
   * Converts a POJO to a specific subject type for use with oriz.
   * It accomplishes this by setting an obscure and hidden property on the object with the subject's name as a key.
   *
   * @param obj The POJO to convert.
   * @param subject The name of the subject to notate the object with.
   *
   * @returns The object with the subject type notated.
   */
  objToSubject<Obj extends OnlyInstance<Extract<Subject, object>>>(
    obj: Obj,
    subject: Extract<Subject, string>,
  ): Obj {
    Object.defineProperty(obj, Permissions.subjectKey, {
      value: subject,
      writable: true,
    });
    return obj;
  }

  /**
   * A helper function for converting a subject into a key string.
   *
   * @param subject The subject to convert.
   *
   * @returns The key string associated with the subject.
   */
  getSubjectKey(
    subject: Subject | ObjToConstructor<Extract<Subject, object>>,
  ): string {
    // subject is a string: 'SomeInterface'
    if (typeof subject === 'string') {
      return subject;
    }

    // subject is a constructor: SomeClass
    if (typeof subject === 'function') {
      return subject.name;
    }

    // subject is an object with subject key annotated: objToSubject(someInterface, 'SomeInterface)
    if (Object.hasOwn(subject, Permissions.subjectKey)) {
      return subject[Permissions.subjectKey as keyof typeof subject];
    }

    // subject is an object made with a constructor: new SomeClass()
    // if not and the user does nothing, this will default to `Object`
    return subject.constructor.name;
  }
}

/**
 * A helper type to denote a JS class constructor.
 */
export type ClassConstructor<Class = any> = new (...args: any[]) => Class;

/**
 * A helper type to denote a function.
 */
export type Func<Return = any> = (...args: any[]) => Return;

/**
 * A helper to represent the `object` type as a record of property keys mapped to any type.
 */
export type ObjectAsRecord = Record<PropertyKey, any>;

/*
 * It is important to keep in mind that `object` can also be a Func or a ClassConstructor.
 * In other words, if `Type extends object`, that is synonymous to `Type extends object | Func | ClassConstructor`.
 */

/**
 * A helper type to extract object instances from any object type, as opposed to constructors or functions.
 */
export type OnlyInstance<Obj extends object> = Exclude<
  Obj,
  Func | ClassConstructor
>;

/**
 * A helper type to extract or create object constructors from any object type.
 */
export type ObjToConstructor<Obj extends object> =
  | Extract<Obj, ClassConstructor>
  | ClassConstructor<OnlyInstance<Obj>>;

/**
 * A helper type for extracing all of the string keys of a type.
 */
export type StrKeys<Type> = string & keyof Type;

/**
 * A helper type to get an instance of a type.
 * Useful for when the type can be a class constructor or a function.
 */
export type InstanceOf<Type extends string | object | Func | ClassConstructor> =
  Type extends ClassConstructor<infer Class>
    ? Class
    : Type extends Func<infer Return>
    ? Return
    : Type extends object
    ? Type
    : Type extends string
    ? ObjectAsRecord
    : never;

/**
 * A helper type that is either a type or an array of the type.
 */
export type ArrayOfOr<Type> = Type | Type[];
