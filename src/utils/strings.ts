/**
 * @file /utils/strings.js
 * @module /utils
 * @description This file contains utility functions for working with strings.
 * @version 2024-02-01 C2RLO - Initial
 */

/**
 * @description capitalize first letter of a string
 * @param {string} [first] string to capitalize
 * @returns {string} string with first letter capitalized
 */
export function capitalizeFirstLetter([first = '', ...rest]: string[]) {
  return [first.toUpperCase(), ...rest].join('')
}

/**
 * Capitalizes the first letter of a string and cut last letter
 *
 * @param s - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(s: string): string {
  return s[0].toUpperCase().slice(0, 1) + s.slice(1, s.length - 1)
}
