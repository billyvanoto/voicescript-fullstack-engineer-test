"use client";
import { useEffect, useState } from "react";
import { API, apiFetch } from "@/lib/api";
import CreateCaseDialog from "@/components/case/CreateCaseDialog";
import UpdateCaseStatusDialog from "@/components/case/UpdateCaseStatusDialog";

type Case = {
  id: number;
  name: string;
  duration: number;
  location: string;
  status: string;
};

export default function CaseListPage() {
  const [cases, setCase] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({caseId: 0, status: 'new'});
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEditClick(id: number, status: string) {
    setUpdateData({caseId:id, status:status})
    setIsUpdateDialogOpen(true);
  }

  useEffect(() => {
    let cancelled = false; // prevent state update if component unmounts mid-fetch

    const fetchCase = async () => {
      try {
        const data = await apiFetch<Case[]>(`${API.case}?page=${page}&pagesize=${pageSize}`);
        if (!cancelled) {
          setCase(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setLoading(false);
        }
      }
    };

    fetchCase();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, refreshKey]);

  if (loading) return <p className="p-8 text-gray-500">Loading case...</p>;
  if (error)   return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-6">Case List</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Case
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3 text-center">Duration</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{c.id}</td>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-center">{c.duration}</td>
                <td className="px-6 py-4">{c.location}</td>
                <td className="px-6 py-4 uppercase">{c.status}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleEditClick(c.id, c.status)}
                      className="px-4 py-2 text-sm bg-yellow-400 text-black rounded-lg hover:bg-yellow-700"
                    >
                      Edit
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
                disabled={cases.length < pageSize} // no more pages if results < pageSize
                className="px-4 py-2 text-sm bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50"
            >
                Next
            </button>
            </div>
      </div>
      <CreateCaseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
      <UpdateCaseStatusDialog
        key={updateData.caseId}
        caseId={updateData.caseId}
        status={updateData.status}
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}