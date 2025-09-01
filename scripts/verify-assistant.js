const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function verifyAssistant() {
  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;
  
  console.log('Using API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set');
  console.log('Checking Assistant ID:', assistantId);
  console.log('---');
  
  const openai = new OpenAI({ apiKey });
  
  try {
    // List all assistants
    console.log('Listing all assistants for this API key:');
    const assistants = await openai.beta.assistants.list({ limit: 20 });
    
    if (assistants.data.length === 0) {
      console.log('No assistants found for this API key!');
    } else {
      assistants.data.forEach(assistant => {
        console.log(`- ${assistant.name} (${assistant.id}) - Model: ${assistant.model}`);
      });
    }
    
    console.log('\n---');
    
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
        console.log('✗ Assistant NOT found with this API key!');
        console.log('  Error:', error.message);
        console.log('\nThis means the assistant was created with a different API key.');
        console.log('You need to either:');
        console.log('1. Use the same API key that created the assistant');
        console.log('2. Create a new assistant with the current API key');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('401')) {
      console.error('Invalid API key!');
    }
  }
}

verifyAssistant();