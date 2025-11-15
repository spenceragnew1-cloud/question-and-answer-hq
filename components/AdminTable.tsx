import Link from 'next/link';

interface AdminTableProps {
  headers: string[];
  rows: Array<Record<string, any>>;
  getRowLink?: (row: Record<string, any>) => string;
}

export default function AdminTable({
  headers,
  rows,
  getRowLink,
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, idx) => {
            const link = getRowLink?.(row);
            const RowComponent = link ? Link : 'tr';
            const rowProps = link ? { href: link } : {};

            return (
              <RowComponent
                key={idx}
                {...rowProps}
                className={link ? 'hover:bg-gray-50 cursor-pointer' : ''}
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[header.toLowerCase().replace(/\s+/g, '_')] ||
                      row[header] ||
                      '-'}
                  </td>
                ))}
              </RowComponent>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

