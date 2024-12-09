/**
 * Utility script for generating bcrypt password hashes.
 * Used for development and testing purposes.
 *
 * Usage:
 * - Default: npx ts-node scripts/generate-hash.ts
 * - With custom password: npx ts-node scripts/generate-hash.ts mypassword
 *
 * Note: This script should only be used in development environments.
 * Never use generated hashes directly in production.
 */

import bcrypt from 'bcryptjs';

async function generateHash(password: string = 'default-password'): Promise<void> {
  try {
    // Use the same number of salt rounds as in the user service
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log('Password:', password);
    console.log('Generated hash:', hash);
    console.log('\nSQL for default user:');
    console.log(`INSERT INTO "User" (id, email, password, "createdAt", "updatedAt")
VALUES (
  'default-user-id',
  'default@example.com',
  '${hash}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

// Allow password to be passed as command line argument
const password = process.argv[2];
generateHash(password).catch(console.error);
