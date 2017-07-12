const errors = {
  // options
  'options-not-defined': new Error('`options MUST be defined`'),
  'options-not-object': new Error('`options` MUST be an object'),

  // options.charsets
  'charsets-not-defined': new Error('`options.charsets MUST be defined`'),
  'charsets-not-object': new Error('`options.charsets` MUST be an object'),

  // options.charsets.source
  'source-not-array': new Error('`options.charsets.source` MUST be an array'),
  'source-not-defined': new Error('`options.charsets.source MUST be defined`'),

  // options.charsets.target
  'target-not-array': new Error('`options.charsets.target` MUST be an array'),
  'target-not-defined': new Error('`options.charsets.target MUST be defined`'),

  // options.charsets.{source,target}
  'target-smaller-than-source': new Error(
    '`options.charsets.target` MUST be larger than or equal to `options.charsets.source`',
  ),

  // options.destination
  'destination-not-defined': new Error('`options.destination MUST be defined`'),
  'destination-not-string': new Error('`options.destination` MUST be a string'),

  // options.font
  'font-not-defined': new Error('`options.font MUST be defined`'),
  'font-not-string': new Error('`options.font` MUST be a string'),

  // options.fontFamily
  'fontFamily-not-defined': new Error('`options.fontFamily MUST be defined`'),
  'fontFamily-not-string': new Error('`options.fontFamily` MUST be a string'),
};

export default errors;
