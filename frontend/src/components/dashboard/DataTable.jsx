import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

export default function DataTable({ columns, rows, loading, hasMore, onLoadMore, loadingMore, empty, rowKey = "_id" }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/60">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={`whitespace-nowrap px-4 py-3 font-medium ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading
              ? Array.from({ length: 4 }, (_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-4">
                        <Skeleton className="h-4 w-full max-w-[160px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={row[rowKey]} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 align-middle ${col.className || ""}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!loading && rows.length === 0 && <p className="px-4 py-10 text-center text-sm text-gray-500">{empty}</p>}
      {hasMore && (
        <div className="flex justify-center border-t border-gray-200 p-3 dark:border-gray-800">
          <Button variant="ghost" size="sm" onClick={onLoadMore} loading={loadingMore}>
            {t("common.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
