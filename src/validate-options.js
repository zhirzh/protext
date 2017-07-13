// @flow

import errors from './errors';

import type { Options } from './types';

function validateOptions(options: Options): Error | null {
  switch (true) {
    // options: required
    case options === undefined:
    case options === null:
      return errors['options-not-defined'];

    case options.constructor !== Object:
      return errors['options-not-object'];

    // options.charsets: optional
    case 'charsets' in options:
      switch (true) {
        case options.charsets === undefined:
        case options.charsets === null:
          return errors['charsets-not-defined'];

        case options.charsets.constructor !== Object:
          return errors['charsets-not-object'];

        // options.charsets.source: required
        case options.charsets.source === undefined:
        case options.charsets.source === null:
          return errors['source-not-defined'];

        case options.charsets.source.constructor !== Array:
          return errors['source-not-array'];

        // options.charsets.target: required
        case options.charsets.target === undefined:
        case options.charsets.target === null:
          return errors['target-not-defined'];

        case options.charsets.target.constructor !== Array:
          return errors['target-not-array'];

        // options.charsets.{source,target}: required
        case options.charsets.target.length < options.charsets.source.length:
          return errors['target-smaller-than-source'];

        default:
          return null;
      }

    // options.count: optional
    case 'count' in options:
      switch (true) {
        case options.count === undefined:
        case options.count === null:
          return errors['count-not-defined'];

        case options.count.constructor !== Number:
          return errors['count-not-object'];

        default:
          return null;
      }

    // options.destination: required
    case options.destination === undefined:
    case options.destination === null:
      return errors['destination-not-defined'];

    case options.destination.constructor !== String:
      return errors['destination-not-string'];

    // options.font: required
    case options.font === undefined:
    case options.font === null:
      return errors['font-not-defined'];

    case options.font.constructor !== String:
      return errors['font-not-string'];

    // options.fontFamily: optional
    case 'fontFamily' in options:
      switch (true) {
        case options.fontFamily === undefined:
        case options.fontFamily === null:
          return errors['fontFamily-not-defined'];

        case options.fontFamily.constructor !== String:
          return errors['fontFamily-not-string'];

        default:
          return null;
      }

    default:
      return null;
  }
}

export default validateOptions;
