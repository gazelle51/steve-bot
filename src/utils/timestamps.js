/**
 * Convert seconds into hours, minutes and seconds.
 * @param {number} e - total seconds
 * @returns {string} Seconds represented as HH:MM:SS
 */
function secondsToHMS(e) {
  var h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  if (h == '00' && m == '00') return `0:${s}`;
  else if (h == '00') return `${m}:${s}`;
  else return `${h}:${m}:${s}`;
}

module.exports = { secondsToHMS };
