// Approximate "open now" check from human-readable hours strings.
// Honest heuristic: handles '24/7' and the common 'Mon–Fri 8:00am–5:00pm'
// shape in the seed data; anything unparseable counts as open so we never
// hide help we can't be sure about. UI must show "call to confirm."

export function isOpenNow(hours: string, now: Date = new Date()): boolean {
  const h = hours.toLowerCase();
  if (h.includes('24/7') || h.includes('24 hours')) return true;

  // Day-range check, e.g. "mon–fri" / "mon-fri".
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = now.getDay();
  const range = h.match(/(sun|mon|tue|wed|thu|fri|sat)[a-z]*\s*[–-]\s*(sun|mon|tue|wed|thu|fri|sat)/);
  if (range) {
    const start = days.indexOf(range[1]);
    const end = days.indexOf(range[2]);
    const inRange =
      start <= end ? today >= start && today <= end : today >= start || today <= end;
    if (!inRange) return false;
  }

  // Time-range check, e.g. "8:00am–5:00pm".
  const time = h.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (time) {
    const toMinutes = (hr: string, min: string | undefined, ap: string) => {
      let v = (parseInt(hr, 10) % 12) * 60 + (min ? parseInt(min, 10) : 0);
      if (ap === 'pm') v += 12 * 60;
      return v;
    };
    const open = toMinutes(time[1], time[2], time[3]);
    const close = toMinutes(time[4], time[5], time[6]);
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= open && cur <= close;
  }

  // Unparseable → assume open; never hide possible help.
  return true;
}
