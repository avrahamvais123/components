import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ASPECT_COLORS, labelAspect } from '../utils/constants';

export default function AspectsTable({ 
  aspects, 
  title,
  tableColors, 
  isDark 
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'aInfo',
        header: 'כוכב א\'',
        cell: ({ getValue }) => {
          const aInfo = getValue();
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{aInfo.glyph}</span>
              <span style={{ fontWeight: 500 }}>{aInfo.nameHe}</span>
              <span style={{ fontSize: 12, color: tableColors.textSecondary }}>
                {aInfo.sign} {aInfo.degOnlyText}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'היבט',
        cell: ({ getValue }) => {
          const type = getValue();
          const color = ASPECT_COLORS[type] || "#000";
          return (
            <span style={{ 
              color: color, 
              fontWeight: 700,
              fontSize: 16,
              padding: "4px 8px",
              backgroundColor: color + (isDark ? "25" : "15"),
              borderRadius: 6,
              border: `1px solid ${color}${isDark ? "40" : "30"}`
            }}>
              {labelAspect(type)}
            </span>
          );
        },
      },
      {
        accessorKey: 'bInfo',
        header: 'כוכב ב\'',
        cell: ({ getValue }) => {
          const bInfo = getValue();
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{bInfo.glyph}</span>
              <span style={{ fontWeight: 500 }}>{bInfo.nameHe}</span>
              <span style={{ fontSize: 12, color: tableColors.textSecondary }}>
                {bInfo.sign} {bInfo.degOnlyText}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'orb',
        header: 'אורב',
        cell: ({ getValue, row }) => {
          const orb = getValue();
          const mode = row.original.mode;
          return (
            <span style={{ 
              fontFamily: "monospace",
              fontSize: 13,
              color: tableColors.textSecondary
            }}>
              {mode === "degree" ? `${orb}°` : "—"}
            </span>
          );
        },
      },
    ],
    [tableColors, isDark]
  );

  const table = useReactTable({
    data: aspects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (aspects.length === 0) return null;

  return (
    <>
      <h3 style={{ marginTop: 24, marginBottom: 16 }}>
        {title}
      </h3>
      <div style={{ 
        border: `1px solid ${tableColors.border}`, 
        borderRadius: 12, 
        overflow: "hidden",
        boxShadow: tableColors.boxShadow,
        marginBottom: 16
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
                      textAlign: header.id === 'aInfo' ? 'right' : 
                                header.id === 'bInfo' ? 'left' : 'center',
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
                      textAlign: cell.column.id === 'aInfo' ? 'right' : 
                                cell.column.id === 'bInfo' ? 'left' : 'center',
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
    </>
  );
}
