const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createAssistant() {
  try {
    // First, try to retrieve the existing assistant to check its configuration
    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    if (assistantId) {
      try {
        const existing = await openai.beta.assistants.retrieve(assistantId);
        console.log('Existing Assistant Configuration:');
        console.log('ID:', existing.id);
        console.log('Name:', existing.name);
        console.log('Model:', existing.model);
        console.log('Tools:', existing.tools);
        console.log('Instructions:', existing.instructions);
        return existing;
      } catch (error) {
        console.log('Could not retrieve existing assistant, creating new one...');
      }
    }

    const assistant = await openai.beta.assistants.create({
      name: "Agent Lee - Navada",
      model: "gpt-4o-mini",
      instructions: `You are Agent Lee, a helpful AI assistant for Navada Robotics. 
You help users with questions about robotics, programming, and engineering.
Be professional, friendly, and provide detailed technical answers when appropriate.`,
      tools: [],
    });

    console.log('New Assistant created successfully!');
    console.log('Assistant ID:', assistant.id);
    console.log('\nPlease update your .env.local file with:');
    console.log(`OPENAI_ASSISTANT_ID=${assistant.id}`);
    
    return assistant;
  } catch (error) {
    console.error('Error creating assistant:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

createAssistant();