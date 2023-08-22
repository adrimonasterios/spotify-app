/** Combines classes strings into one
 * @example ```js
 *   className={classNames("p-4", "text-green-400")} -> class="p-4 text-green-400"
 * ```
 */
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
