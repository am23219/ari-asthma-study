// Script to check locally saved leads
const fs = require('fs');
const path = require('path');

// Path to the leads directory
const leadsDir = path.join(process.cwd(), 'leads');

// Function to check if leads directory exists and has files
function checkLeadsDirectory() {
  // Check if leads directory exists
  if (!fs.existsSync(leadsDir)) {
    console.log('No leads directory found. No leads have been saved locally.');
    return false;
  }
  
  // Get all files in the leads directory
  const files = fs.readdirSync(leadsDir);
  
  // Check if there are any lead files
  if (files.length === 0) {
    console.log('No lead files found in the leads directory.');
    return false;
  }
  
  return files;
}

// Function to display lead information
function displayLeadInfo(leadFile) {
  try {
    const filePath = path.join(leadsDir, leadFile);
    const leadData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log('\n===================================');
    console.log(`Lead File: ${leadFile}`);
    console.log('===================================');
    
    // Display form type and timestamp
    console.log(`Form Type: ${leadData.formData.formType}`);
    console.log(`Timestamp: ${leadData.timestamp}`);
    
    // Display contact information
    console.log('\nContact Information:');
    console.log(`  Name: ${leadData.contactData.firstName} ${leadData.contactData.lastName}`);
    console.log(`  Email: ${leadData.contactData.email}`);
    if (leadData.contactData.phone) {
      console.log(`  Phone: ${leadData.contactData.phone}`);
    }
    console.log(`  Tags: ${leadData.contactData.tags.join(', ')}`);
    console.log(`  Source: ${leadData.contactData.source}`);
    
    // Display custom fields if any
    if (leadData.customFields && leadData.customFields.length > 0) {
      console.log('\nCustom Fields:');
      leadData.customFields.forEach(field => {
        console.log(`  ${field.name}: ${field.value}`);
      });
    }
    
    // Display error information
    console.log('\nError Information:');
    if (typeof leadData.error === 'object') {
      console.log(`  Status: ${leadData.error.status || 'N/A'}`);
      console.log(`  Message: ${leadData.error.message || JSON.stringify(leadData.error)}`);
    } else {
      console.log(`  Error: ${leadData.error}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error reading lead file ${leadFile}:`, error.message);
    return false;
  }
}

// Function to display all leads
function displayAllLeads() {
  const files = checkLeadsDirectory();
  
  if (!files) {
    return;
  }
  
  console.log(`Found ${files.length} lead file(s):\n`);
  
  // Sort files by creation time (newest first)
  const sortedFiles = files.map(file => {
    const filePath = path.join(leadsDir, file);
    const stats = fs.statSync(filePath);
    return { file, createdAt: stats.birthtime };
  }).sort((a, b) => b.createdAt - a.createdAt);
  
  // Display information for each lead file
  let successCount = 0;
  sortedFiles.forEach(({ file }) => {
    const success = displayLeadInfo(file);
    if (success) {
      successCount++;
    }
  });
  
  console.log('\n===================================');
  console.log(`Successfully displayed ${successCount} of ${files.length} lead(s).`);
}

// Function to retry submitting a lead to GoHighLevel
function retrySubmitLead(leadFile) {
  console.log(`\nRetrying submission for lead file: ${leadFile}`);
  console.log('This functionality is not implemented yet.');
  console.log('To implement, you would:');
  console.log('1. Read the lead data from the file');
  console.log('2. Call the GoHighLevel API with the lead data');
  console.log('3. If successful, move the lead file to a "processed" directory');
  console.log('4. If unsuccessful, keep the lead file and log the error');
}

// Main function
function main() {
  console.log('=== LOCAL LEADS CHECKER ===');
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // No arguments, display all leads
    displayAllLeads();
  } else if (args[0] === '--retry-all') {
    // Retry submitting all leads
    console.log('Retry all leads functionality is not implemented yet.');
  } else if (args[0] === '--retry' && args[1]) {
    // Retry submitting a specific lead
    const leadFile = args[1];
    const filePath = path.join(leadsDir, leadFile);
    
    if (fs.existsSync(filePath)) {
      retrySubmitLead(leadFile);
    } else {
      console.error(`Lead file not found: ${leadFile}`);
    }
  } else if (args[0] === '--help') {
    // Display help information
    console.log('Usage:');
    console.log('  node check-local-leads.js                  - Display all locally saved leads');
    console.log('  node check-local-leads.js --retry <file>   - Retry submitting a specific lead');
    console.log('  node check-local-leads.js --retry-all      - Retry submitting all leads');
    console.log('  node check-local-leads.js --help           - Display this help information');
  } else {
    console.error('Invalid arguments. Use --help for usage information.');
  }
}

// Run the main function
main(); 