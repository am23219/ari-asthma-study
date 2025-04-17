export default function TestIndexPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Integration Test Hub</h1>
      
      <p className="mb-6">
        This page provides links to various test tools to diagnose and fix integration issues.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TestCard 
          title="Client-Side API Test" 
          description="Tests the form submission API from the browser. This simulates what happens when a user submits the form."
          link="/api-test"
        />
        
        <TestCard 
          title="Server-Side Direct Test" 
          description="Tests the GoHighLevel API directly from the server, bypassing the form submission flow."
          link="/direct-test"
        />
        
        <TestCard 
          title="Environment Variables" 
          description="Shows currently loaded environment variables to help diagnose configuration issues."
          link="/api/test-env"
        />
        
        <TestCard 
          title="GoHighLevel API Diagnosis" 
          description="Comprehensive test of the GoHighLevel API with detailed error reporting."
          link="/api/test-ghl"
        />
      </div>
      
      <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Troubleshooting Steps</h2>
        <ol className="list-decimal ml-6">
          <li className="mb-2">
            First check the <strong>Server-Side Direct Test</strong> to confirm the API key works directly.
          </li>
          <li className="mb-2">
            Then try the <strong>Client-Side API Test</strong> to see if the form submission endpoint is working.
          </li>
          <li className="mb-2">
            If direct test works but client test fails, check the console logs for errors.
          </li>
          <li className="mb-2">
            Use the <strong>Environment Variables</strong> endpoint to check if env vars are loading correctly.
          </li>
          <li className="mb-2">
            The <strong>GoHighLevel API Diagnosis</strong> endpoint will run advanced API tests.
          </li>
        </ol>
      </div>
    </div>
  );
}

function TestCard({ title, description, link }) {
  return (
    <a 
      href={link} 
      className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-3">{description}</p>
      <div className="text-blue-500 font-medium">
        Run Test →
      </div>
    </a>
  );
} 