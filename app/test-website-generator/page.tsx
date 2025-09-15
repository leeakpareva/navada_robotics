'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Code, Download } from 'lucide-react';

interface GeneratedWebsite {
  projectId: string;
  projectName: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
    type: string;
    safe: boolean;
    validated: boolean;
  }>;
  status: string;
  createdAt: string;
}

export default function TestWebsiteGenerator() {
  const [request, setRequest] = useState({
    description: 'Create a modern landing page for my tech startup with blue and purple colors',
    siteName: 'TechStart',
    style: {
      primaryColor: 'blue',
      secondaryColor: 'purple',
      theme: 'modern'
    },
    features: ['Fast Performance', 'Team Collaboration', 'Premium Quality']
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; website?: GeneratedWebsite; error?: string }>({ success: false });
  const [selectedFile, setSelectedFile] = useState<string>('');

  const generateWebsite = async () => {
    setGenerating(true);
    setResult({ success: false });

    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, website: data.website });
      } else {
        setResult({ success: false, error: data.error || 'Unknown error' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setGenerating(false);
    }
  };

  const downloadProject = () => {
    if (!result.website) return;

    const zip = result.website.files.map(file => ({
      name: file.path,
      content: file.content
    }));

    // Create a simple download of the first file for testing
    const firstFile = result.website.files[0];
    if (firstFile) {
      const blob = new Blob([firstFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = firstFile.path;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Generator Test</h1>
          <p className="text-gray-600">Test the safe website generation functionality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Website Request</CardTitle>
              <CardDescription>Configure your website generation request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <Input
                  value={request.siteName}
                  onChange={(e) => setRequest(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="My Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={request.description}
                  onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your website..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <Input
                    value={request.style.primaryColor}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      style: { ...prev.style, primaryColor: e.target.value }
                    }))}
                    placeholder="blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <Input
                    value={request.style.secondaryColor}
                    onChange={(e) => setRequest(prev => ({
                      ...prev,
                      style: { ...prev.style, secondaryColor: e.target.value }
                    }))}
                    placeholder="purple"
                  />
                </div>
              </div>

              <Button
                onClick={generateWebsite}
                disabled={generating}
                className="w-full"
              >
                {generating ? 'Generating...' : 'Generate Website'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generation Results</CardTitle>
              <CardDescription>
                {result.success ? 'Website generated successfully' : 'Results will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.success && result.website ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Generation Successful</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Project: {result.website.projectName}</h3>
                    <p className="text-sm text-gray-600 mb-2">ID: {result.website.projectId}</p>
                    <p className="text-sm text-gray-600">Files: {result.website.files.length}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Generated Files:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {result.website.files.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50 ${
                            selectedFile === file.path ? 'border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedFile(file.path)}
                        >
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span className="text-sm">{file.path}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.safe ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500">{file.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={downloadProject} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample File
                  </Button>
                </div>
              ) : result.error ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>{result.error}</span>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Configure your website request and click Generate Website
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Code Preview */}
        {selectedFile && result.website && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>File Preview: {selectedFile}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                {result.website.files.find(f => f.path === selectedFile)?.content}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Safety Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Safety Features</CardTitle>
            <CardDescription>Built-in security measures for safe website generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">✅ Implemented</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Template-based generation only</li>
                  <li>• Content sanitization</li>
                  <li>• Security pattern scanning</li>
                  <li>• Safe dependency validation</li>
                  <li>• No external API calls in generated code</li>
                  <li>• No server-side code generation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">🛡️ Security Checks</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• XSS vulnerability detection</li>
                  <li>• Injection pattern scanning</li>
                  <li>• Malicious code prevention</li>
                  <li>• Safe package dependency validation</li>
                  <li>• File-by-file safety verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}