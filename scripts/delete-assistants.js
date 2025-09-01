const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function deleteAssistants() {
  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const assistantsToDelete = [
    'asst_xyinQ8br9ceRBml85CqxENqj', // Agent Lee - Navada (gpt-4o-mini)
    'asst_kyVgEz2fUsJF8Ys2SkQpgNta', // Agent Lee (gpt-4-turbo-preview)
    'asst_pl0xhuOPz2X12z3f96plCEQ9'  // Agent Lee (gpt-4-0613)
  ];

  for (const assistantId of assistantsToDelete) {
    try {
      console.log(`Deleting assistant ${assistantId}...`);
      await openai.beta.assistants.delete(assistantId);
      console.log(`✓ Successfully deleted ${assistantId}`);
    } catch (error) {
      console.log(`✗ Failed to delete ${assistantId}: ${error.message}`);
    }
  }
}

deleteAssistants();