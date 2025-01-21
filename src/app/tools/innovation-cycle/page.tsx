"use client";

import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectTask {
  taskName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function InnovationCyclePage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ProjectTask[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);
    setError(null);

    try {
      const text = await uploadedFile.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];

      if (!headers.includes('taskName') || !headers.includes('startDate') || 
          !headers.includes('endDate') || !headers.includes('status')) {
        throw new Error('Invalid CSV format. Required columns missing.');
      }

      const parsedData = rows.slice(1).map(row => ({
        taskName: row[headers.indexOf('taskName')],
        startDate: row[headers.indexOf('startDate')],
        endDate: row[headers.indexOf('endDate')],
        status: row[headers.indexOf('status')]
      }));

      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing file');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-lg font-semibold mb-2">
                  Drop your CSV file here
                </span>
                <span className="text-sm text-gray-500">
                  or click to browse files
                </span>
              </label>
            </div>

            {loading && (
              <div className="mt-4 text-blue-500">
                Processing your file...
              </div>
            )}

            {error ? (
              <Alert type="error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Alert type="info">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  CSV should include: Task Name, Start Date, End Date, Status
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Timeline Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500 py-12">
                Processing your data...
              </div>
            ) : data ? (
              <div className="space-y-4">
                {data.map((task, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">{task.taskName}</h3>
                    <div className="text-sm text-gray-600">
                      {task.startDate} - {task.endDate}
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Upload a CSV file to see your timeline analysis
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}