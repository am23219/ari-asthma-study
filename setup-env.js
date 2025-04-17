// Script to help set up environment variables for GoHighLevel integration
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the .env.local file
const envFilePath = path.join(process.cwd(), '.env.local');

// Function to check if .env.local file exists
function checkEnvFile() {
  if (fs.existsSync(envFilePath)) {
    console.log('\nAn .env.local file already exists.');
    
    // Read the current file
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    
    // Check if GOHIGHLEVEL_API_KEY is already set
    if (envContent.includes('GOHIGHLEVEL_API_KEY=')) {
      console.log('GOHIGHLEVEL_API_KEY is already set in your .env.local file.');
      
      rl.question('\nDo you want to update the API key? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          promptForApiKey();
        } else {
          console.log('\nKeeping the existing API key. Setup complete!');
          rl.close();
        }
      });
    } else {
      console.log('GOHIGHLEVEL_API_KEY is not set in your .env.local file.');
      promptForApiKey();
    }
  } else {
    console.log('\nNo .env.local file found. Creating a new one...');
    promptForApiKey();
  }
}

// Function to prompt for the API key
function promptForApiKey() {
  rl.question('\nPlease enter your GoHighLevel API key: ', (apiKey) => {
    if (!apiKey.trim()) {
      console.log('API key cannot be empty. Please try again.');
      promptForApiKey();
      return;
    }
    
    updateEnvFile(apiKey.trim());
  });
}

// Function to update the .env.local file
function updateEnvFile(apiKey) {
  try {
    let envContent = '';
    
    // If the file exists, read its content
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Check if GOHIGHLEVEL_API_KEY is already set
      if (envContent.includes('GOHIGHLEVEL_API_KEY=')) {
        // Replace the existing API key
        envContent = envContent.replace(
          /GOHIGHLEVEL_API_KEY=.*/,
          `GOHIGHLEVEL_API_KEY=${apiKey}`
        );
      } else {
        // Add the API key to the existing file
        envContent += envContent.endsWith('\n') ? '' : '\n';
        envContent += `GOHIGHLEVEL_API_KEY=${apiKey}\n`;
      }
    } else {
      // Create a new file with the API key
      envContent = `GOHIGHLEVEL_API_KEY=${apiKey}\n`;
    }
    
    // Write the updated content to the file
    fs.writeFileSync(envFilePath, envContent);
    
    console.log('\nAPI key has been successfully saved to .env.local file.');
    console.log('\nSetup complete! You can now run the integration tests:');
    console.log('  node test-ghl-system.js');
    
    rl.close();
  } catch (error) {
    console.error('\nError updating .env.local file:', error.message);
    console.error('Please make sure you have write permissions to the project directory.');
    rl.close();
  }
}

// Main function
function main() {
  console.log('=== GOHIGHLEVEL INTEGRATION SETUP ===');
  console.log('\nThis script will help you set up the GoHighLevel integration.');
  console.log('You will need your GoHighLevel API key to proceed.');
  console.log('\nTo get your API key:');
  console.log('1. Go to your GoHighLevel account');
  console.log('2. Navigate to Location Level > Settings > Business Info');
  console.log('   Or Agency Level > Agency Settings > API Keys');
  console.log('3. Copy the API key for your location');
  
  rl.question('\nDo you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      checkEnvFile();
    } else {
      console.log('\nSetup cancelled. No changes were made.');
      rl.close();
    }
  });
}

// Handle the close event
rl.on('close', () => {
  console.log('\nThank you for using the GoHighLevel integration setup script!');
  process.exit(0);
});

// Run the main function
main(); 