/** Combines classes strings into one
 * @example ```js
 *   className={classNames("p-4", "text-green-400")} -> class="p-4 text-green-400"
 * ```
 */
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

/** Converts strings to title case format
 * @example ```js
 *   my title -> My Title
 * ```
 */
export const titleCase = (str: string) => {
  return str
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
};
