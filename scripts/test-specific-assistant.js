const OpenAI = require('openai');
require('dotenv').config({ path: '.env' }); // Read from .env instead of .env.local

async function testAssistant() {
  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;
  
  console.log('Using API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set');
  console.log('Testing Assistant ID:', assistantId);
  console.log('---');
  
  const openai = new OpenAI({ apiKey });
  
  try {
    // Try to retrieve the specific assistant
    if (assistantId) {
      console.log(`Attempting to retrieve assistant ${assistantId}:`);
      try {
        const assistant = await openai.beta.assistants.retrieve(assistantId);
        console.log('✓ Assistant found!');
        console.log('  Name:', assistant.name);
        console.log('  Model:', assistant.model);
        console.log('  Instructions:', assistant.instructions?.substring(0, 100) + '...');
      } catch (error) {
        console.log('✗ Assistant NOT found!');
        console.log('  Error:', error.message);
      }
    } else {
      console.log('No assistant ID provided in environment variables');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('Invalid API key!');
    }
  }
}

testAssistant();