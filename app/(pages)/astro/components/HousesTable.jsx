import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { toRoman } from '../utils/constants';

export default function HousesTable({ 
  houses, 
  houseFormat, 
  tableColors 
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'house',
        header: 'בית',
        cell: ({ getValue }) => {
          const house = getValue();
          const houseDisplay = houseFormat === "roman" ? toRoman(house) : house;
          return (
            <span className="font-medium">בית {houseDisplay}</span>
          );
        },
      },
      {
        accessorKey: 'sign',
        header: 'מזל',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <span className="text-base">{row.original.signGlyph}</span>
            <span className="text-sm">{row.original.signName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'degOnlyText',
        header: 'מעלות',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">
            {getValue()}
          </span>
        ),
      },
    ],
    [houseFormat]
  );

  const table = useReactTable({
    data: houses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 16 }}>בתים</h3>
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
                      textAlign: header.id === 'house' ? 'right' : 'center',
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
                      textAlign: cell.column.id === 'house' ? 'right' : 'center',
                      color: cell.column.id === 'degOnlyText' ? tableColors.textSecondary : tableColors.textPrimary
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
