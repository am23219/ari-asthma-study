// Script to test the entire GoHighLevel integration system
const { spawn } = require('child_process');
const path = require('path');

console.log('=== GOHIGHLEVEL INTEGRATION SYSTEM TEST ===\n');

// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${path.basename(scriptPath)}...`);
    console.log('='.repeat(50));
    
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      console.log('='.repeat(50));
      if (code === 0) {
        console.log(`${path.basename(scriptPath)} completed successfully.\n`);
        resolve();
      } else {
        console.error(`${path.basename(scriptPath)} failed with code ${code}`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      console.error(`Failed to start ${path.basename(scriptPath)}: ${err.message}`);
      reject(err);
    });
  });
}

// Main function to run all tests
async function runTests() {
  try {
    // Step 1: Run the GoHighLevel integration test
    await runScript(path.join(__dirname, 'test-ghl-integration.js'));
    
    // Step 2: Check for locally saved leads
    await runScript(path.join(__dirname, 'check-local-leads.js'));
    
    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
    console.log('The GoHighLevel integration system is working as expected.');
    console.log('If any leads were saved locally, they were displayed above.');
  } catch (error) {
    console.error('\n=== TEST SUITE FAILED ===');
    console.error('Error:', error.message);
    console.error('Please check the logs above for more details.');
    process.exit(1);
  }
}

// Run the tests
runTests(); 