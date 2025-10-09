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
    <div>
      <h3 className="mt-0 mb-4 text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        🪐 כוכבים
      </h3>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg dark:shadow-2xl bg-white dark:bg-gray-800">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${
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
                className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  index % 2 === 0 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-gray-50/50 dark:bg-gray-700/30'
                } ${index < table.getRowModel().rows.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 text-gray-900 dark:text-gray-100 ${
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
    </div>
  );
}
