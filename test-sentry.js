// Sentry Test Script
// This script tests various Sentry error tracking scenarios
// Run with: node test-sentry.js

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/sentry-test`;

async function testSentryAPI() {
  console.log('🔍 Starting Sentry API Tests...\n');

  const tests = [
    {
      name: 'Custom Message Test',
      type: 'message',
      method: 'GET',
      expectError: false,
    },
    {
      name: 'Basic Error Test',
      type: 'basic',
      method: 'GET',
      expectError: true,
    },
    {
      name: 'Async Error Test',
      type: 'async',
      method: 'GET',
      expectError: true,
    },
    {
      name: 'Database Error Test',
      type: 'database',
      method: 'GET',
      expectError: true,
    },
    {
      name: 'Validation Error Test',
      type: 'validation',
      method: 'GET',
      expectError: true,
    },
    {
      name: 'Error with Context Test',
      type: 'context',
      method: 'GET',
      expectError: false,
    },
    {
      name: 'POST Request Test',
      type: null,
      method: 'POST',
      body: { triggerError: true, testData: 'sample' },
      expectError: true,
    },
  ];

  for (const test of tests) {
    console.log(`📌 Running: ${test.name}`);

    try {
      const url = test.type ? `${API_ENDPOINT}?type=${test.type}` : API_ENDPOINT;
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (test.expectError && response.status === 500) {
        console.log(`   ✅ Error triggered successfully: ${data.message}`);
        console.log(`   📤 Sentry capture: ${data.sentryCapture}`);
      } else if (!test.expectError && response.ok) {
        console.log(`   ✅ Success: ${data.message}`);
      } else {
        console.log(`   ⚠️ Unexpected response:`, data);
      }
    } catch (error) {
      console.log(`   ❌ Test failed:`, error.message);
    }

    console.log('');
  }

  console.log('✨ All Sentry API tests completed!');
  console.log('\n📊 Next steps:');
  console.log('1. Check your Sentry dashboard at https://sentry.io');
  console.log('2. Navigate to: generali-ki / sentry-purple-lamp');
  console.log('3. Verify that all test errors appear in the Issues tab');
  console.log('4. Check that custom messages appear in the Events tab');
}

// Run tests
testSentryAPI().catch(console.error);