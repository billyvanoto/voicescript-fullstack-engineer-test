"use client";
import { useState } from "react";
import { API, apiPost } from "@/lib/api";

type CaseFormData = {
  name: string;
  duration: number;
  location: string;
};

type FormErrors = Partial<Record<keyof CaseFormData, string>>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const defaultForm: CaseFormData = {
  name: "",
  duration: 0,
  location: "",
};

function validate(form: CaseFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim())
    errors.name = "Name is required";

  if (!form.location.trim())
    errors.location = "Location is required";

  if (!form.duration) {
    errors.duration = "Duration is required";
  } else if (isNaN(Number(form.duration))) {
    errors.duration = "Duration must be a number";
  } else if (Number(form.duration) <= 0) {
    errors.duration = "Duration must be greater than 0";
  }

  return errors;
}

export default function CreateCaseDialog({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<CaseFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

     if (errors[name as keyof CaseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop here if there are errors
    }
    setSubmitting(true);
    setApiError(null);
    try {
      await apiPost(`${API.case}`, form);
      setForm(defaultForm);
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
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Create New Case</h3>
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

            {(["name", "duration", "location"] as (keyof CaseFormData)[]).map(
              (field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {field !== 'duration' ? field : 'duration in minute'}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[field] && (
                    <p className="text-xs text-red-500">{errors[field]}</p>
                    )}
                </div>
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Case"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}