import './globals.css'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

type User = {
  id: number;
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes: string;
};

async function getUsers(): Promise<User[]> {
  // Keep your existing data fetching logic
  const response = await fetch("http://localhost:3000/api", {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch users:", response.statusText);
    return [];
  }

  const text = await response.text();
  
  if (!text) {
    console.warn("API returned an empty response");
    return [];
  }

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
}

export default async function Page() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Lab Test Results
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">All Test Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.testType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.testDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {user.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:text-blue-900 transition-colors">
            <PencilIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Edit</span>
          </button>
          <button className="p-2 text-red-600 hover:text-red-900 transition-colors">
            <TrashIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No test results available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}