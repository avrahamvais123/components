"use client";

export default function AspectsTable({ niceAspects }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">היבטים</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">נק׳ 1</th>
              <th className="p-2 border">סוג</th>
              <th className="p-2 border">נק׳ 2</th>
              <th className="p-2 border">אורב</th>
            </tr>
          </thead>
          <tbody>
            {niceAspects.map((a, i) => (
              <tr key={i}>
                <td className="p-2 border">
                  <span className="inline-flex items-center gap-2">
                    <span>{a.p1Glyph}</span>
                    <span>{a.p1}</span>
                  </span>
                </td>
                <td className="p-2 border">
                  <span className="inline-flex items-center gap-2">
                    <span>{a.typeGlyph}</span>
                    <span>{a.type}</span>
                  </span>
                </td>
                <td className="p-2 border">
                  <span className="inline-flex items-center gap-2">
                    <span>{a.p2Glyph}</span>
                    <span>{a.p2}</span>
                  </span>
                </td>
                <td className="p-2 border">{a.orb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
