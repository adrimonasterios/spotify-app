import moment from "moment";

export const defaultImage =
  "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg";

/** Combines classes strings into one
 * @param {string} classes           as many class strings as needed.
 * @example ```js
 *   className={classNames("p-4", "text-green-400")} -> class="p-4 text-green-400"
 * ```
 */
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

/** Converts strings to title case format
 * @param {string} str           String to be formatted.
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

/** Converts strings to title case format
 * @param {number} duration           Duration in miliseconds.
 * @example ```js
 *   175076 -> 02:55
 * ```
 */
export const formatDuration = (duration: number) => {
  const trackDuration = moment.duration(duration);
  const trackMinutes = trackDuration.minutes();
  const trackSeconds = trackDuration.seconds();
  const minutes = trackMinutes < 10 ? `0${trackMinutes}` : trackMinutes;
  const seconds = trackSeconds < 10 ? `0${trackSeconds}` : trackSeconds;

  return `${minutes}:${seconds}`;
};
