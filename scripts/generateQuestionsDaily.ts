#!/usr/bin/env node

// IMPORTANT: Load environment variables FIRST using dotenv/config
// This must be the first import to ensure env vars are available when other modules load
import 'dotenv/config';
import { resolve } from 'path';
import { config } from 'dotenv';

// Also explicitly try to load .env.local (dotenv/config only loads .env by default)
config({ path: resolve(process.cwd(), '.env.local'), override: false });

// Now import after env vars are loaded
import { generateDailyQuestions } from '../lib/generator/generateDailyQuestions';

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('Daily Questions Generation Script');
    console.log('='.repeat(60));
    console.log('');

    const result = await generateDailyQuestions({
      batchSize: 5,
      poolSize: 50,
      dryRun: false,
    });

    console.log('');
    console.log('='.repeat(60));
    console.log('Generation Complete');
    console.log('='.repeat(60));
    console.log('');
    console.log('Summary:', result.summary);
    console.log('');
    console.log('Details:');
    console.log(`  Published today: ${result.publishedToday}`);
    console.log(`  Remaining target: ${result.remaining}`);
    console.log(`  Attempted: ${result.attempted}`);
    console.log(`  Successful: ${result.successful}`);
    console.log(`  Failed: ${result.failed}`);
    console.log(`  Duplicates: ${result.duplicates}`);
    console.log(`  Errors: ${result.errors}`);
    if (result.createdSlugs.length > 0) {
      console.log('');
      console.log('Created questions:');
      result.createdSlugs.forEach((slug) => {
        console.log(`  - ${slug}`);
      });
    }
    console.log('');

    // Exit with error code logic: only fail if no questions were published at all
    if (result.successful === 0 && result.failed > 0) {
      // No questions published at all - this is a failure
      console.error('❌ Generation failed: No questions were published');
      process.exit(1);
    } else if (result.successful > 0 && result.failed > 0) {
      // Partial success - log warning but exit successfully
      console.log('⚠️  Generation completed with partial errors (some questions published)');
      process.exit(0);
    } else if (result.successful > 0 || result.remaining === 0) {
      console.log('✅ Generation completed successfully');
      process.exit(0);
    } else {
      console.log('⚠️  No questions were generated (no ideas available or target already met)');
      process.exit(0);
    }
  } catch (error: any) {
    console.error('');
    console.error('='.repeat(60));
    console.error('Fatal Error');
    console.error('='.repeat(60));
    console.error('');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('');
      console.error('Stack trace:');
      console.error(error.stack);
    }
    console.error('');
    process.exit(1);
  }
}

main();
