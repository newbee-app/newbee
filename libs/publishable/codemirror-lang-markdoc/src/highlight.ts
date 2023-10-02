import { styleTags, tags as t } from '@lezer/highlight';

export const markdocHighlight = styleTags({
  'TagStart TagEnd': t.special(t.brace),
  '{ }': t.brace,
  '[ ]': t.squareBracket,
  '( )': t.paren,
  ': =': t.definitionOperator,
  ',': t.separator,
  '.': t.derefOperator,

  'TagOpen/Identifier TagClose': t.tagName,

  'AttributeFull/Identifier': t.attributeName,
  AttributeShorthand: t.attributeValue,

  'Function/Identifier': t.function(t.name),
  'FunctionParameterNamed/Identifier': t.function(t.propertyName),

  ValueNull: t.null,
  ValueBoolean: t.bool,
  ValueNumber: t.number,
  ValueString: t.string,

  StringEscapeSequence: t.escape,

  'HashKey/Identifier': t.propertyName,

  VariableIdentifier: t.variableName,
  'VariableTail/Identifier': t.special(t.variableName),
});
