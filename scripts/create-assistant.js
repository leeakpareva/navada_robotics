const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Agent Lee",
      model: "gpt-4-turbo-preview",
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