"use client";
import { useEffect, useState } from "react";
import { API, apiFetch } from "@/lib/api";


type AssignedCase = {
  assignmentId: number;
  case: {
    id: number;
    name: string;
    duration: number;
    location: string;
    status: string;
  };
  reporter: {
    id: number;
    name: string;
    location: string;
  };
  editor: {
    id: number;
    name: string;
  };
  reporterFee: number;
  editorFee: number;
}

export default function AssignedCaseListPage() {
  const [assignedCases, setAssignedCases] = useState<AssignedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  
  useEffect(() => {
    let cancelled = false; // prevent state update if component unmounts mid-fetch

    const fetchAssignedCase = async () => {
      try {
        const data = await apiFetch<AssignedCase[]>(`${API.assignedCase}?page=${page}&pagesize=${pageSize}`);
        if (!cancelled) {
          setAssignedCases(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setLoading(false);
        }
      }
    };

    fetchAssignedCase();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  if (loading) return <p className="p-8 text-gray-500">Loading assigned case...</p>;
  if (error)   return <p className="p-8 text-red-500">Error: {error}</p>;
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Assigned Case List</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Case</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Reporter</th>
              <th className="px-6 py-3">Reporter Fee</th>
              <th className="px-6 py-3">Editor</th>
              <th className="px-6 py-3">Editor Fee</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {assignedCases.map((c, i) => (
              <tr key={c.assignmentId} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{i +1}</td>
                <td className="px-6 py-4 font-medium">{c.case.name}</td>
                <td className="px-6 py-4">{c.case.status}</td>
                <td className="px-6 py-4">{c.reporter.name}</td>
                <td className="px-6 py-4">{Number(c.reporterFee)}</td>
                <td className="px-6 py-4">{c.editor.name || '-'}</td>
                <td className="px-6 py-4">{Number(c.editorFee) || '-'}</td>
                <td className="px-6 py-4">{Number(c.reporterFee) + Number(c.editorFee)}</td>
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
                disabled={assignedCases.length < pageSize} // no more pages if results < pageSize
                className="px-4 py-2 text-sm bg-white border rounded shadow-sm disabled:opacity-40 hover:bg-gray-50"
            >
                Next
            </button>
            </div>
      </div>
    </div>
  );
}