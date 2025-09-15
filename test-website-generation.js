// Simple test for website generation functionality
const { WebsiteGenerator } = require('./lib/website-generator/generator');
const { parseUserRequest } = require('./lib/website-generator/utils');

async function testWebsiteGeneration() {
  console.log('🧪 Testing Website Generation...\n');

  // Test 1: Parse user request
  console.log('1. Testing request parsing...');
  const userMessage = "Create a modern website for my tech startup called TechStart with blue and purple colors";
  const parsed = parseUserRequest(userMessage);
  console.log('✅ Parsed request:', {
    isWebsiteRequest: parsed.isWebsiteRequest,
    siteName: parsed.siteName,
    style: parsed.style
  });

  if (!parsed.isWebsiteRequest) {
    console.log('❌ Failed to detect website request');
    return;
  }

  // Test 2: Generate website
  console.log('\n2. Testing website generation...');
  try {
    const generator = new WebsiteGenerator();
    const websiteRequest = {
      description: parsed.description || userMessage,
      siteName: parsed.siteName || 'Test Website',
      style: parsed.style,
      pages: parsed.pages,
      features: parsed.features
    };

    const generatedWebsite = await generator.generateWebsite(websiteRequest);

    console.log('✅ Website generated successfully!');
    console.log('📁 Project:', generatedWebsite.projectName);
    console.log('🗂️  Files:', generatedWebsite.files.length);
    console.log('✅ Safe files:', generatedWebsite.files.filter(f => f.safe).length);
    console.log('⚠️  Unsafe files:', generatedWebsite.files.filter(f => !f.safe).length);

    // Test 3: Check file contents
    console.log('\n3. Checking main page file...');
    const mainPage = generatedWebsite.files.find(f => f.path === 'app/page.tsx');
    if (mainPage) {
      console.log('✅ Main page generated');
      console.log('🛡️  File is safe:', mainPage.safe);
      console.log('📝 Content preview:', mainPage.content.substring(0, 100) + '...');
    } else {
      console.log('❌ Main page not found');
    }

    // Test 4: Security validation
    console.log('\n4. Security validation...');
    const hasUnsafeFiles = generatedWebsite.files.some(f => !f.safe);
    if (hasUnsafeFiles) {
      console.log('⚠️  WARNING: Some files failed security validation');
      generatedWebsite.files.filter(f => !f.safe).forEach(file => {
        console.log('❌', file.path);
      });
    } else {
      console.log('✅ All files passed security validation');
    }

    console.log('\n🎉 Website generation test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Project: ${generatedWebsite.projectName}`);
    console.log(`- Files: ${generatedWebsite.files.length}`);
    console.log(`- Status: ${generatedWebsite.status}`);
    console.log(`- Safe: ${!hasUnsafeFiles ? 'Yes' : 'No'}`);

  } catch (error) {
    console.log('❌ Website generation failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testWebsiteGeneration().catch(console.error);
}

module.exports = { testWebsiteGeneration };