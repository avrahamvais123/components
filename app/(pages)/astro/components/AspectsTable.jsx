import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ASPECT_COLORS, labelAspect } from '../utils/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
            <div className="flex items-center gap-2">
              <span className="text-base">{aInfo.glyph}</span>
              <span className="font-medium">{aInfo.nameHe}</span>
              <span className="text-xs text-muted-foreground">
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
            <Badge 
              variant="outline"
              className="font-bold"
              style={{ 
                color: color, 
                backgroundColor: color + (isDark ? "25" : "15"),
                borderColor: color + (isDark ? "40" : "30")
              }}
            >
              {labelAspect(type)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'bInfo',
        header: 'כוכב ב\'',
        cell: ({ getValue }) => {
          const bInfo = getValue();
          return (
            <div className="flex items-center gap-2">
              <span className="text-base">{bInfo.glyph}</span>
              <span className="font-medium">{bInfo.nameHe}</span>
              <span className="text-xs text-muted-foreground">
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
            <span className="font-mono text-xs text-muted-foreground">
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
    <Card className="mt-6 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
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
                        header.id === 'aInfo' ? 'text-right' : 
                        header.id === 'bInfo' ? 'text-left' : 'text-center'
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
                        cell.column.id === 'aInfo' ? 'text-right' : 
                        cell.column.id === 'bInfo' ? 'text-left' : 'text-center'
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
