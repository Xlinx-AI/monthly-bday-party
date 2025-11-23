
import { loadEnvConfig } from '@next/env';
import { db } from '../src/db';
import { users, interests, events } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

loadEnvConfig(process.cwd());

const generateId = () => crypto.randomUUID();

async function runStressTest() {
  console.log('Starting stress test...');
  
  const userId = generateId();
  const interestId = generateId();
  const email = `stress-${Date.now()}@example.com`;
  
  try {
    console.log('Creating test data...');
    
    // Create User
    await db.insert(users).values({
      id: userId,
      name: 'Stress Test User',
      email: email,
      passwordHash: 'hash',
      birthDate: '1990-01-01',
    });
    
    // Create Interest
    await db.insert(interests).values({
        id: interestId,
        name: `Stress Interest ${Date.now()}`
    });

    console.log('User and Interest created.');
    
    // Create 50 events concurrently
    const eventCount = 50;
    console.log(`Creating ${eventCount} events concurrently...`);
    
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < eventCount; i++) {
        promises.push(
            db.insert(events).values({
                id: generateId(),
                hostUserId: userId,
                interestId: interestId,
                title: `Stress Event ${i}`,
                eventDate: new Date(),
                location: 'Test Location',
                ticketPrice: '100.00',
                maxGuests: 10,
                inviteCode: `CODE${i}`,
                status: 'planned'
            })
        );
    }
    
    // Wait for all to finish
    await Promise.all(promises);
    
    const duration = Date.now() - startTime;
    console.log(`Created ${eventCount} events in ${duration}ms`);
    
    // Read them back
    console.log('Reading events back...');
    const readStart = Date.now();
    const userEvents = await db.select().from(events).where(eq(events.hostUserId, userId));
    const readDuration = Date.now() - readStart;
    
    console.log(`Read ${userEvents.length} events in ${readDuration}ms`);
    
    if (userEvents.length !== eventCount) {
        console.error(`ERROR: Expected ${eventCount} events, found ${userEvents.length}`);
    } else {
        console.log('SUCCESS: All events created and read successfully.');
    }
    
  } catch (err) {
    console.error('Stress test failed:', err);
    if (err instanceof Error) {
        console.error(err.message);
        console.error(err.stack);
    }
    process.exit(1);
  } finally {
      // Cleanup
      console.log('Cleaning up...');
      try {
        await db.delete(events).where(eq(events.hostUserId, userId));
        await db.delete(interests).where(eq(interests.id, interestId));
        await db.delete(users).where(eq(users.id, userId));
        console.log('Cleanup done.');
      } catch (cleanupErr) {
          console.error('Cleanup failed:', cleanupErr);
      }
      process.exit(0);
  }
}

runStressTest();
