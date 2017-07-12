const errors = {
  'options-not-object': new Error('`options` MUST be a plain object'),

  'font-not-defined': new Error('`options.font MUST be defined`'),
  'font-not-string': new Error('`options.font` MUST be a string'),

  'charsets-not-defined': new Error('`options.charsets MUST be defined`'),
  'charsets-not-object': new Error('`options.charsets` MUST be a plain object'),

  'source-not-defined': new Error('`options.charsets.source MUST be defined`'),
  'source-not-array': new Error('`options.charsets.source` MUST be an array'),

  'target-not-defined': new Error('`options.charsets.target MUST be defined`'),
  'target-not-array': new Error('`options.charsets.target` MUST be an array'),

  'target-smaller-than-source': new Error(
    '`options.charsets.target.length` MUST be greater than or equal to `options.charsets.source.length`',
  ),

  'destination-not-defined': new Error('`options.destination MUST be defined`'),
  'destination-not-string': new Error('`options.destination` MUST be a string'),

  'fontFamily-not-defined': new Error('`options.fontFamily MUST be defined`'),
  'fontFamily-not-string': new Error('`options.fontFamily` MUST be a string'),
};

export default errors;
