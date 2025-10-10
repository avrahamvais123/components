import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { toRoman } from '../utils/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
          <span className="font-medium">{getValue()}</span>
        ),
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
          <span className="font-mono text-sm">{getValue()}</span>
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
              className="font-medium"
              style={{ color: isDark ? "#818cf8" : "#6366f1" }}
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
          <span className="text-base">
            {getValue() ? (
              <span className="text-red-500">℞</span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">—</span>
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
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🪐 כוכבים
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-4 py-3 font-semibold border-b ${
                        header.id === 'nameHe' ? 'text-right' : 'text-center'
                      }`}
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
                  className={`transition-all duration-200 hover:bg-muted/40 hover:shadow-sm ${
                    index < table.getRowModel().rows.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 ${
                        cell.column.id === 'nameHe' ? 'text-right' : 'text-center'
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
