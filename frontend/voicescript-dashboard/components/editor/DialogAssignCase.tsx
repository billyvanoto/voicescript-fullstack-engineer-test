"use client";
import { useState, useEffect } from "react";
import { API, apiPost, apiFetch } from "@/lib/api";

type Case = {
  id: number;
  name: string;
  duration: number;
  location: string;
  status: string;
}

type Props = {
  editorId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}; 


export default function DialogAssignCase({ editorId, isOpen, onClose, onSuccess }: Props) {
  const [cases, setCase] = useState<Case[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false; // prevent state update if component unmounts mid-fetch
    const fetchCase = async () => {
      try {
        const data = await apiFetch<Case[]>(`${API.case}/available/editor`);
        if (!cancelled) {
          setCase(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(err instanceof Error ? err.message : "Something went wrong");
          setLoading(false);
        }
      }
    };
    fetchCase();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  async function handleSubmit(caseId: number) {
    setSubmitting(true);
    setApiError(null);
    try {
      const payload = {editorId: editorId, caseId: caseId}
      await apiPost(`${API.case}/assign/editor`, payload);
      onSuccess(); // refresh table
      onClose();   // close dialog
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-fit">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Assign Case Editor</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 flex flex-col gap-4">
            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded">
                {apiError}
              </p>
            )}

              <div key="id" className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  Editor ID
                </label>
                <input
                  name="id"
                  value={editorId}
                  disabled={true}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div key="status" className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  Case List
                </label>
                {loading ? (<p className="p-8 text-gray-500">Loading case...</p>) :
                (<table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-300 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">{c.id}</td>
                        <td className="px-6 py-4 font-medium">{c.name}</td>
                        <td className="px-6 py-4">{c.location}</td>
                        <td className="px-6 py-4">{c.duration}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleSubmit(c.id)}
                              disabled={submitting}
                              className="px-4 py-2 text-sm bg-yellow-400 text-black rounded-lg hover:bg-yellow-700"
                            >
                              Assign Case
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>)}
              </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </>
  );
}