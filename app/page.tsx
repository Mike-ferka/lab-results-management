"use client";
import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "./globals.css"

type User = {
  id: number;
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
};

export default function Page() {
  const [formData, setFormData] = useState({
    id: null as number | null,
    patientName: "",
    testType: "",
    result: "",
    testDate: "",
    notes: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api", { cache: "no-store" });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(formData.id ? `/api/tests/${formData.id}` : "/api", {
        method: formData.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit test result");
      }

      setMessage(formData.id ? "Test result updated successfully!" : "Test result added successfully!");
      setFormData({ id: null, patientName: "", testType: "", result: "", testDate: "", notes: "" });

      // Refresh data
      fetchUsers();
      closeModal();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for new test
  const openModalForNewTest = () => {
    setFormData({ id: null, patientName: "", testType: "", result: "", testDate: "", notes: "" });
    setIsModalOpen(true);
  };

  // Open modal for editing a test
  const openModalForEdit = (user: User) => {
    setFormData({
      id: user.id,
      patientName: user.patientName,
      testType: user.testType,
      result: user.result,
      testDate: new Date(user.testDate).toISOString().slice(0, 16),
      notes: user.notes || "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this test result?")) return;

    try {
      const response = await fetch(`/api/tests/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete test result");

      setMessage("Test result deleted successfully!");
      fetchUsers();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Lab Test Results</h1>

        {/* Create Test Button */}
        <button onClick={openModalForNewTest} className="mb-6 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition">
          Create Test
        </button>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.patientName}</td>
                  <td className="px-6 py-4 text-sm">{user.testType}</td>
                  <td className="px-6 py-4 text-sm">{user.result}</td>
                  <td className="px-6 py-4 text-sm">{new Date(user.testDate).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    <button onClick={() => openModalForEdit(user)} className="p-2 text-blue-600 hover:text-blue-900 transition">
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:text-red-900 transition">
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
          
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              {/* Close Button */}
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-xl font-semibold mb-4">{formData.id ? "Edit Test Result" : "Add Test Result"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="patientName" placeholder="Patient Name" value={formData.patientName} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="testType" placeholder="Test Type" value={formData.testType} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="result" placeholder="Result" value={formData.result} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="datetime-local" name="testDate" value={formData.testDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                <textarea name="notes" placeholder="Notes (optional)" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full" disabled={loading}>
                  {loading ? "Submitting..." : formData.id ? "Update" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
