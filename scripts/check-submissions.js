const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSubmissions() {
  try {
    console.log('\n=== Contact Form Submissions ===\n');
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (contacts.length === 0) {
      console.log('No contact submissions found.');
    } else {
      contacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`   Phone: ${contact.phone || 'N/A'}`);
        console.log(`   Message: ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}`);
        console.log(`   Status: ${contact.status}`);
        console.log(`   Submitted: ${contact.createdAt.toLocaleString()}\n`);
      });
    }

    console.log('\n=== Email Subscribers ===\n');
    const subscribers = await prisma.emailSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      take: 10,
    });

    if (subscribers.length === 0) {
      console.log('No email subscribers found.');
    } else {
      subscribers.forEach((subscriber, index) => {
        console.log(`${index + 1}. ${subscriber.email}`);
        console.log(`   Source: ${subscriber.source || 'N/A'}`);
        console.log(`   Active: ${subscriber.isActive}`);
        console.log(`   Subscribed: ${subscriber.subscribedAt.toLocaleString()}\n`);
      });
    }

    console.log('\n=== Summary ===');
    console.log(`Total Contact Submissions: ${contacts.length}`);
    console.log(`Total Email Subscribers: ${subscribers.length}`);
    console.log(`Active Subscribers: ${subscribers.filter(s => s.isActive).length}\n`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmissions();
