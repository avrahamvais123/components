"use client";

export default function HousesGrid({ niceHouses }) {
  if (!niceHouses || niceHouses.length !== 12) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">קאספים של הבתים</h2>
      <div className="grid md:grid-cols-3 gap-2">
        {niceHouses.map((h) => (
          <div key={h.num} className="border rounded p-3">
            <div className="font-bold">
              בית {h.labelHe} ({h.num})
            </div>
            <div>
              מזל:{" "}
              <span className="inline-flex items-center gap-2">
                <span>{h.signGlyph}</span>
                <span>{h.sign}</span>
              </span>
            </div>
            <div>מעלה: {h.degFmt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
