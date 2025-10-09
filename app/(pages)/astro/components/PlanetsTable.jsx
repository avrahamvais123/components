import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { toRoman } from '../utils/constants';

export default function PlanetsTable({ 
  planets, 
  houseFormat, 
  tableColors, 
  isDark 
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'nameHe',
        header: 'כוכב',
        cell: ({ getValue }) => (
          <span style={{ fontWeight: 500 }}>{getValue()}</span>
        ),
      },
      {
        accessorKey: 'sign',
        header: 'מזל',
        cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>{row.original.signGlyph}</span>
            <span style={{ fontSize: 14 }}>{row.original.signName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'degOnlyText',
        header: 'מעלות',
        cell: ({ getValue }) => (
          <span style={{ fontFamily: 'monospace' }}>{getValue()}</span>
        ),
      },
      {
        accessorKey: 'house',
        header: 'בית',
        cell: ({ getValue, row }) => {
          const house = getValue() || 1;
          const houseDisplay = houseFormat === "roman" ? toRoman(house) : house;
          return (
            <span 
              style={{ 
                fontWeight: 500,
                color: isDark ? "#818cf8" : "#6366f1"
              }}
            >
              {houseDisplay}
            </span>
          );
        },
      },
      {
        accessorKey: 'retro',
        header: 'רטרוגרד',
        cell: ({ getValue }) => (
          <span style={{ fontSize: 16 }}>
            {getValue() ? (
              <span style={{ color: "#ef4444" }}>℞</span>
            ) : (
              <span style={{ color: isDark ? "#6b7280" : "#d1d5db" }}>—</span>
            )}
          </span>
        ),
      },
    ],
    [houseFormat, isDark]
  );

  const table = useReactTable({
    data: planets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 16 }}>כוכבים</h3>
      <div style={{ 
        border: `1px solid ${tableColors.border}`, 
        borderRadius: 12, 
        overflow: "hidden",
        boxShadow: tableColors.boxShadow
      }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          fontSize: 14
        }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} style={{ backgroundColor: tableColors.headerBg }}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ 
                      padding: "12px 16px", 
                      textAlign: header.id === 'nameHe' ? 'right' : 'center',
                      fontWeight: 600,
                      borderBottom: `1px solid ${tableColors.border}`,
                      color: tableColors.headerText
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr 
                key={row.id} 
                style={{ 
                  backgroundColor: index % 2 === 0 ? tableColors.rowEven : tableColors.rowOdd,
                  borderBottom: index < table.getRowModel().rows.length - 1 ? `1px solid ${tableColors.rowBorder}` : "none"
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ 
                      padding: "12px 16px", 
                      textAlign: cell.column.id === 'nameHe' ? 'right' : 'center',
                      color: tableColors.textPrimary
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
