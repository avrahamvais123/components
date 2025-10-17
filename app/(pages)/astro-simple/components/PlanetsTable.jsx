"use client";

export default function PlanetsTable({ displayedBodies }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">שם</th>
            <th className="p-2 border">מזל</th>
            <th className="p-2 border">מעלה (0–30)</th>
            <th className="p-2 border">בית</th>
            <th className="p-2 border">R</th>
          </tr>
        </thead>
        <tbody>
          {displayedBodies.map((b) => (
            <tr key={b.key}>
              <td className="p-2 border">
                <span className="inline-flex items-center gap-2">
                  <span>{b.glyph}</span>
                  <span>{b.labelHe}</span>
                </span>
              </td>
              <td className="p-2 border">
                <span className="inline-flex items-center gap-2">
                  <span>{b.signGlyph}</span>
                  <span>{b.sign}</span>
                </span>
              </td>
              <td className="p-2 border">{b.deg30Short || "-"}</td>
              <td className="p-2 border">
                {Number.isInteger(b.houseNum) ? b.houseNum : "-"}
              </td>
              <td className="p-2 border">{b.retro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
