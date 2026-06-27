/**
 * Case transformation utilities.
 * FastAPI returns snake_case JSON; the frontend uses camelCase types.
 * These helpers deep-convert between the two.
 */

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export function keysToCamel<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => keysToCamel(item)) as unknown as T
  }
  if (obj !== null && typeof obj === 'object') {
    const result: JsonObject = {}
    for (const key of Object.keys(obj as JsonObject)) {
      result[snakeToCamel(key)] = keysToCamel((obj as JsonObject)[key])
    }
    return result as unknown as T
  }
  return obj as T
}

export function keysToSnake<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => keysToSnake(item)) as unknown as T
  }
  if (obj !== null && typeof obj === 'object') {
    const result: JsonObject = {}
    for (const key of Object.keys(obj as JsonObject)) {
      result[camelToSnake(key)] = keysToSnake((obj as JsonObject)[key])
    }
    return result as unknown as T
  }
  return obj as T
}
