// Renders topology SVG identically to the original HTML file's mkSvg() function.
// Uses string concatenation + dangerouslySetInnerHTML to preserve duplicate node IDs.

const SCALE = 0.72;

export default function TopologySVG({ topo }) {
  const { width, height, nodes, links, extra } = topo;
  const PU = '#4c1d95';
  const GR = '#9ca3af';
  const MG = '#c026d3';

  // Build position map (same logic as HTML — last duplicate wins, intentional)
  const pos = {};
  nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });

  // Build lines string
  let L = '';
  links.forEach(([a, b]) => {
    const pa = pos[a], pb = pos[b];
    if (pa && pb) {
      L += `<line x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" stroke="${MG}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
  });

  // Build circles string (ALL nodes, including duplicates)
  let C = '';
  nodes.forEach(({ id, x, y, dark }) => {
    const fill = dark ? PU : GR;
    const tf = dark ? '#fff' : '#1f2937';
    const lbl = id.includes('.') ? id.split('.').pop() : id;
    const fs = lbl.length > 5 ? 7.5 : lbl.length > 3 ? 9 : 10;
    C += `<circle cx="${x}" cy="${y}" r="22" fill="${fill}"/><text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="700" fill="${tf}" font-family="monospace">${lbl}</text>`;
  });

  const vw = width + 60;
  const vh = height + 80;
  const sw = Math.round(vw * SCALE);
  const sh = Math.round(vh * SCALE);

  const svgContent = `<g transform="translate(30,40)">${extra || ''}${L}${C}</g>`;

  return (
    <svg
      className="block"
      width={sw}
      height={sh}
      viewBox={`0 0 ${vw} ${vh}`}
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}