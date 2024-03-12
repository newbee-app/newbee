import { Permissions } from './permissions';

interface TestInterface {
  bool: boolean;
}

class TestClass1 {
  bool = true;
  str = 'str';
}

class TestClass2 {
  num = 1;
  bool = true;
}

class TestClass3 {
  str = 'str';
  num = 1;
}

type Action = 'create' | 'read' | 'update' | 'delete' | 'modify';
type Subject =
  | TestClass1
  | TestClass2
  | TestClass3
  | TestInterface
  | 'TestInterface';

describe('Permissions', () => {
  let permissions: Permissions<Action, Subject>;
  let testInterface: TestInterface;
  let testClass1: TestClass1;
  let testClass2: TestClass2;

  beforeEach(() => {
    permissions = new Permissions();
    testInterface = { bool: true };
    testClass1 = new TestClass1();
    testClass2 = new TestClass2();
  });

  it('should be defined', () => {
    expect(permissions).toBeDefined();
    expect(testInterface).toBeDefined();
    expect(testClass1).toBeDefined();
    expect(testClass2).toBeDefined();
  });

  describe('allow', () => {
    it('should add new simple rules', () => {
      permissions.allow('create', TestClass1);
      expect(permissions.can('create', TestClass1)).toBeTruthy();
      expect(permissions.can('create', testClass1)).toBeTruthy();
      expect(permissions.can('create', TestClass1, 'bool')).toBeFalsy();
    });

    it('should respect fields if specified', () => {
      permissions.allow('create', TestClass1, { fields: 'bool' });
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass1, 'bool')).toBeTruthy();
      expect(permissions.can('create', testClass1, 'bool')).toBeTruthy();
      expect(permissions.can('create', TestClass1, 'str')).toBeFalsy();
    });

    it('should default to forbidding if conditions are not met', () => {
      permissions.allow('update', TestClass1, {
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('update', TestClass1)).toBeFalsy();
      expect(permissions.can('update', testClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', testClass1)).toBeFalsy();
    });

    it('should handle multiple actions', () => {
      permissions.allow(['create', 'update'], TestClass1);
      expect(permissions.can('create', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
    });

    it('should handle multiple subjects', () => {
      permissions.allow('create', [TestClass1, TestClass2]);
      expect(permissions.can('create', TestClass1)).toBeTruthy();
      expect(permissions.can('create', TestClass2)).toBeTruthy();
      expect(permissions.can('create', TestClass3)).toBeFalsy();
    });

    it('should override previoiusly forbidden actions', () => {
      permissions.forbid('create', TestClass1, {
        fields: 'bool',
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('create', testClass1, 'bool')).toBeFalsy();
      permissions.allow('create', TestClass1, {
        fields: 'bool',
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('create', testClass1, 'bool')).toBeTruthy();
    });
  });

  describe('forbid', () => {
    it('should add new simple rules', () => {
      permissions.allow('create', TestClass1);
      permissions.forbid('create', TestClass1);
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', testClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass1, 'bool')).toBeFalsy();
    });

    it('should respect fields if specified', () => {
      permissions.allow('create', TestClass1, { fields: 'bool' });
      permissions.forbid('create', TestClass1, { fields: 'bool' });
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass1, 'bool')).toBeFalsy();
      expect(permissions.can('create', testClass1, 'bool')).toBeFalsy();
      expect(permissions.can('create', TestClass1, 'str')).toBeFalsy();
    });

    it('should default to allowing if conditions are not met', () => {
      permissions.allow('update', TestClass1, {
        conditional: (tc1) => tc1.bool,
      });
      permissions.forbid('update', TestClass1, {
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('update', testClass1)).toBeFalsy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', testClass1)).toBeFalsy();
    });

    it('should handle multiple actions', () => {
      permissions.allow(['create', 'update'], TestClass1);
      permissions.forbid(['create', 'update'], TestClass1);
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('update', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
    });

    it('should handle multiple subjects', () => {
      permissions.allow('create', [TestClass1, TestClass2]);
      permissions.forbid('create', [TestClass1, TestClass2]);
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass2)).toBeFalsy();
      expect(permissions.can('create', TestClass3)).toBeFalsy();
    });

    it('should override previously allowed actions', () => {
      permissions.allow('create', TestClass1, {
        fields: 'bool',
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('create', testClass1, 'bool')).toBeTruthy();
      permissions.forbid('create', TestClass1, {
        fields: 'bool',
        conditional: (tc1) => tc1.bool,
      });
      expect(permissions.can('create', testClass1, 'bool')).toBeFalsy();
    });
  });

  describe('clearRules', () => {
    it('should clear all rules', () => {
      permissions.allow('create', TestClass1);
      permissions.clearRules();
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', testClass1)).toBeFalsy();

      permissions.forbid('create', TestClass1, {
        conditional: (tc1) => !tc1.bool,
      });
      permissions.clearRules();
      expect(permissions.can('create', TestClass1)).toBeFalsy();
      expect(permissions.can('create', testClass1)).toBeFalsy();
    });
  });

  describe('addActionAlias', () => {
    it('should add an action alias', () => {
      permissions.addActionAlias('modify', ['update', 'delete']);
      permissions.allow('modify', TestClass1);
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeTruthy();
      expect(permissions.can('create', TestClass1)).toBeFalsy();
    });
  });

  describe('deleteActionAlias', () => {
    it('should delete all actions of an action alias', () => {
      permissions.addActionAlias('modify', ['update', 'delete']);
      permissions.allow('modify', TestClass1);
      permissions.deleteActionAlias('modify');
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass1)).toBeFalsy();
    });

    it('should delete specified actions of an action alias', () => {
      permissions.addActionAlias('modify', ['update', 'delete']);
      permissions.allow('modify', TestClass1);
      permissions.deleteActionAlias('modify', 'delete');
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
      expect(permissions.can('create', TestClass1)).toBeFalsy();
    });
  });

  describe('clearActionAlias', () => {
    it('should clear all action aliases', () => {
      permissions.addActionAlias('modify', ['update', 'delete']);
      permissions.addActionAlias('create', 'update');
      permissions.allow('modify', TestClass1);
      permissions.allow('create', TestClass1);
      permissions.clearActionAliases();
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('create', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();
    });
  });

  describe('lock & unlock', () => {
    it('allow and forbid should not be allowed when locked', () => {
      permissions.lock();
      permissions.allow('create', TestClass1);
      expect(permissions.can('create', TestClass1)).toBeFalsy();

      permissions.unlock();
      permissions.allow('create', TestClass1);
      permissions.lock();
      permissions.forbid('create', TestClass1);
      expect(permissions.can('create', TestClass1)).toBeTruthy();

      permissions.clearRules();
      expect(permissions.can('create', TestClass1)).toBeTruthy();
    });

    it('addActionAlias and deleteActionAlias should not be allowed when locked', () => {
      permissions.allow('modify', TestClass1);
      permissions.lock();
      permissions.addActionAlias('modify', ['update', 'delete']);
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeFalsy();
      expect(permissions.can('delete', TestClass1)).toBeFalsy();

      permissions.unlock();
      permissions.addActionAlias('modify', ['update', 'delete']);
      permissions.lock();
      permissions.deleteActionAlias('modify');
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeTruthy();

      permissions.clearActionAliases();
      expect(permissions.can('modify', TestClass1)).toBeTruthy();
      expect(permissions.can('update', TestClass1)).toBeTruthy();
      expect(permissions.can('delete', TestClass1)).toBeTruthy();
    });
  });

  describe('objToSubject & getSubjectKey', () => {
    it('should handle strings, constructors, and objects', () => {
      expect(permissions.getSubjectKey(TestClass1)).toEqual('TestClass1');
      expect(permissions.getSubjectKey(testClass1)).toEqual('TestClass1');
      expect(permissions.getSubjectKey('TestInterface')).toEqual(
        'TestInterface',
      );
      expect(permissions.getSubjectKey(testInterface)).toEqual('Object');
      expect(
        permissions.getSubjectKey(
          permissions.objToSubject(testInterface, 'TestInterface'),
        ),
      ).toEqual('TestInterface');
    });
  });
});
