/**
 * @file /utils/tests.js
 * @module /utils
 * @description function to get error from async call
 * @version 2024-02-03 C2RLO - Initial
 */

export class NoErrorThrownError extends Error {}

export async function getError(call: () => Promise<unknown>): Promise<unknown> {
  try {
    await call()

    throw new NoErrorThrownError()
  } catch (error) {
    return error
  }
}
