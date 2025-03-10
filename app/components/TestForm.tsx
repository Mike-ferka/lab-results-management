"use client";

import { z } from "zod";

// Define props interface
interface TestFormProps {
  onSubmit: (data: any) => void;
  initialData?: { // Make it optional
    id?: string;
    patientName?: string;
    testType?: string;
    result?: string;
    testDate?: string;
    notes?: string;
  };
}

export default function TestForm({ onSubmit, initialData }: TestFormProps) {
  // Initialize form data with defaults
  const defaultValues = {
    patientName: initialData?.patientName || "",
    testType: initialData?.testType || "",
    result: initialData?.result || "",
    testDate: initialData?.testDate ? initialData.testDate.slice(0, 16) : "", // Handle datetime-local format
    notes: initialData?.notes || "",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Name */}
      <div>
        <label className="block text-sm font-medium">Patient Name</label>
        <input
          type="text"
          name="patientName"
          defaultValue={defaultValues.patientName}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Test Type */}
      <div>
        <label className="block text-sm font-medium">Test Type</label>
        <input
          type="text"
          name="testType"
          defaultValue={defaultValues.testType}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Result */}
      <div>
        <label className="block text-sm font-medium">Result</label>
        <input
          type="text"
          name="result"
          defaultValue={defaultValues.result}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Test Date */}
      <div>
        <label className="block text-sm font-medium">Test Date</label>
        <input
          type="datetime-local"
          name="testDate"
          defaultValue={defaultValues.testDate}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          defaultValue={defaultValues.notes}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialData?.id ? "Update Test" : "Add Test"}
      </button>
    </form>
  );
}