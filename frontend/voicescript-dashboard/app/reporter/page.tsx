"use client";
import { useEffect, useState } from "react";
import { API, apiFetch } from "@/lib/api";
import DialogAssignCase from "@/components/reporter/DialogAssignCase";

type Reporter = {
  id: number;
  name: string;
  location: string;
  assignedCase: number;
}

export default function ReporterListPage() {
  const [reporters, setReporter] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignData, setAssignData] = useState({reporterId: 0, location: ''});

  function handleAssignClick(id: number, location: string) {
    setAssignData({reporterId:id, location:location})
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setAssignData({reporterId:0, location:''})
    setIsDialogOpen(false);
  }

  useEffect(() => {
    let cancelled = false; // prevent state update if component unmounts mid-fetch

    const fetchReporter = async () => {
      try {
        const data = await apiFetch<Reporter[]>(`${API.reporter}?page=${page}&pagesize=${pageSize}`);
        if (!cancelled) {
          setReporter(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setLoading(false);
        }
      }
    };

    fetchReporter();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, refreshKey]);

  if (loading) return <p className="p-8 text-gray-500">Loading reporter...</p>;
  if (error)   return <p className="p-8 text-red-500">Error: {error}</p>;
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Reporter List</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Assigned Case</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {reporters.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{c.id}</td>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">{c.location}</td>
                <td className="px-6 py-4">{c.assignedCase}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleAssignClick(c.id, c.location)}
                      className="px-4 py-2 text-sm bg-yellow-400 text-black rounded-lg hover:bg-yellow-700"
                    >
                      Assign Case
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Page {page}</p>
            <div className="flex gap-2">
            <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50"
            >
                Previous
            </button>
            <button
                onClick={() => setPage((p) => p + 1)}
                disabled={reporters.length < pageSize} // no more pages if results < pageSize
                className="px-4 py-2 text-sm bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50"
            >
                Next
            </button>
            </div>
      </div>
      <DialogAssignCase
        reporterId={assignData.reporterId}
        location={assignData.location}
        isOpen={isDialogOpen}
        onClose={() => handleCloseDialog()}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}