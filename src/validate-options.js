import errors from './errors';

function validateOptions(options) {
  switch (true) {
    // options
    case options.constructor !== Object:
      return errors['options-not-object'];

    // options.font
    case options.font === undefined:
    case options.font === null:
      return errors['font-not-defined'];

    case options.font.constructor !== String:
      return errors['font-not-string'];

    // options.charsets
    case 'charsets' in options:
      switch (true) {
        case options.charsets === undefined:
        case options.charsets === null:
          return errors['charsets-not-defined'];

        case options.charsets.constructor !== Object:
          return errors['charsets-not-object'];

        // options.charsets.source
        case options.charsets.source === undefined:
        case options.charsets.source === null:
          return errors['source-not-defined'];

        case options.charsets.source.constructor !== Array:
          return errors['source-not-array'];

        // options.charsets.target
        case options.charsets.target === undefined:
        case options.charsets.target === null:
          return errors['target-not-defined'];

        case options.charsets.target.constructor !== Array:
          return errors['target-not-array'];

        // options.charsets.{source,target}
        case options.charsets.target.length < options.charsets.source.length:
          return errors['target-smaller-than-source'];

        default:
          return null;
      }

    // options.destination
    case options.destination === undefined:
    case options.destination === null:
      return errors['destination-not-defined'];

    case options.destination.constructor !== String:
      return errors['destination-not-string'];

    default:
      return null;
  }
}

export default validateOptions;