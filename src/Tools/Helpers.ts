/**
 * Various helper functions
 * @packageDocumentation
 */

import { isString } from './TypeGuards';

/**
 * Pushes items to an array, only if the item is not null or undefined
 * @param array Array to which item is pushed
 * @param item Item which is checked and pushed
 */
export function pushDefined<T>(array: T[], ...items: (T | undefined | null)[]) {
    for (const item of items) {
        if ( (item !== undefined) && (item !== null) ) {
            array.push(item!);
        }
    }
}

/**
 * Creates a delay, which can be awaited.
 * @param ms Delay time in milliseconds
 */
export function delay(ms: number) {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
}

/**
 * Returns a string representing the difference between two times with format `hh:mm:ss.fff`
 * @param start Start time
 * @param end End time
 */
export function timeDiffString(start: Date, end: Date): string {
    let remain = end.getTime() - start.getTime();
    // millis
    const millis = remain % 1000;
    remain = Math.floor(remain / 1000);
    // seconds
    const seconds = remain % 60;
    remain = Math.floor(remain / 60);
    // minutes
    const minutes = remain % 60;
    remain = Math.floor(remain / 60);
    // hours
    const hours = Math.floor(remain / 60);
    // string
    const fff = `${millis}`.padStart(3, '0');
    const ss = `${seconds}`.padStart(2, '0');
    const mm = `${minutes}`.padStart(2, '0');
    const hh = `${hours}`.padStart(2, '0');
    return `${hh}:${mm}:${ss}.${fff}`;
}

/**
 * Checks if a sting fullfills a specified filter.
 * @param value string value to check
 * @param filter filter value, if a RegExp with /g flag is used, it is automatically reset before testing
 * @returns 
 * 
 * `value` === filter if filter is `string`
 * 
 * `filter.test(value)` if filter is `RegExp`
 * 
 * `true` if filter is `undefined` (all pass)
 */
export function testStringFilter(value: string, filter: string | RegExp | undefined): boolean {
    if (filter === undefined) {
        return true;
    } else if (isString(filter)) {
        return (filter === value);
    } else { // is RegExp
        filter.lastIndex = 0; // reset index in case /g flag was set, see #32
        return filter.test(value);
    }
}

/**
 * Converts a string value to a boolean or undefined value. Value is not cases sensitive 'true' == 'TRUE' == 'True' == 'TrUe'
 * @param value Value which should be converted
 * @returns `true` for 'true' and '1', `false` for 'false' and '0', undefined for all other input
 */
export function stringToBoolOrUndefined(value: string | undefined | null): boolean | undefined {
    if (!value) {
        return undefined;
    }
    const valueLower = value.toLowerCase();
    if (valueLower === 'true') {
        return true;
    } else if (valueLower === 'false') {
        return false;
    } else {
        return undefined;
    }
}

/**
 * Converts a string value to a boolean. Value is not cases sensitive 'true' == 'TRUE' == 'True' == 'TrUe'
 * @param value Value which should be converted
 * @returns `true` for 'true' and '1', undefined for all other input
 */
export function stringToBool(value: string | undefined | null): boolean {
    return stringToBoolOrUndefined(value) ?? false;
}

/**
 * Split a raw string of shell arguments into an array of its separate commands / parameters.
 * This can be used to prevent automatic escaping of strings, containing white spaces by some
 * functions.
 * 
 * Already escaped parts of the string (e.g. `'-include "C:\My Path\SomeHeader.h"'`) will be split on each whitespace
 * and therefore break in the current implementation!
 * 
 * @param rawArgs Raw command line arguments contained in a single string. e.g. `'-D MY_DEFINE -D OTHER_DEFINE -Wall'`
 * @returns An array with all the build options separated on each whitespace. e.g. `['-D', 'MY_DEFINE', '-D', 'OTHER_DEFINE', '-Wall']`
 * 
 * If input is `undefined`, `null` or an empty string, an empty array is returned
 */
export function splitShellArgs(rawArgs: string | undefined | null): string[] {
    // #30 - When splitting will handle escapes properly use a new function argument `escapeChar?: string | string[] | RegExp`
    // directly return for empty options
    if ((!rawArgs) || (rawArgs.length === 0)) {
        return [];
    }
    const options = rawArgs.split(/\s/gm);
    return options;
}

