export function getIndicatorColor(refnumValue2) {
  if (!refnumValue2 || refnumValue2.length < 2) return '#fff';
  const prefix = refnumValue2.substring(0, 2).toUpperCase();
  switch (prefix) {
    case 'AC': return '#fbbe07ff'; // green for driver attach
    case 'AT': return '#ffee00ff'; // orange for in-progress
    case 'DT': return '#28f808ff'; // red for pending/delayed
    default: return '#fff';
  }
}