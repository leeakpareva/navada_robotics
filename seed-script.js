const fetch = require('node-fetch');

async function seedCourses() {
  try {
    console.log('Attempting to seed courses...');

    // First sign in to get a session
    const loginResponse = await fetch('http://localhost:3001/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'leeakpareva@gmail.com',
        password: 'admin123',
        redirect: false
      })
    });

    console.log('Login response status:', loginResponse.status);

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Got cookies:', cookies);

      // Now call the seed endpoint with the session
      const seedResponse = await fetch('http://localhost:3001/api/learning/seed-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        }
      });

      console.log('Seed response status:', seedResponse.status);
      const result = await seedResponse.json();
      console.log('Seed result:', result);
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

seedCourses();