#!/usr/bin/env node

/**
 * Simple script to verify ads.txt file is accessible
 * Run with: node verify-ads-txt.js
 */

const https = require('https');
const http = require('http');

const DOMAIN = 'transfersdaily.com'; // Change this to your domain
const ADS_TXT_URL = `https://${DOMAIN}/ads.txt`;

console.log(`🔍 Checking ads.txt file at: ${ADS_TXT_URL}`);
console.log('─'.repeat(50));

function checkAdsText(url) {
  const client = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function verifyAdsText() {
  try {
    const response = await checkAdsText(ADS_TXT_URL);
    
    console.log(`✅ Status Code: ${response.statusCode}`);
    console.log(`📄 Content-Type: ${response.headers['content-type'] || 'Not specified'}`);
    console.log('─'.repeat(50));
    
    if (response.statusCode === 200) {
      console.log('📝 ads.txt Content:');
      console.log(response.body);
      
      // Check for common issues
      const content = response.body.toLowerCase();
      
      if (content.includes('pub-xxxxxxxxxxxxxxxx')) {
        console.log('⚠️  WARNING: You still have placeholder Publisher ID!');
        console.log('   Please replace "pub-XXXXXXXXXXXXXXXX" with your actual AdSense Publisher ID');
      } else if (content.includes('pub-')) {
        console.log('✅ Publisher ID found in ads.txt');
      } else {
        console.log('❌ No Publisher ID found in ads.txt');
      }
      
      if (content.includes('google.com')) {
        console.log('✅ Google AdSense entry found');
      } else {
        console.log('❌ Google AdSense entry missing');
      }
      
    } else {
      console.log(`❌ Error: ads.txt returned status ${response.statusCode}`);
      console.log('   Make sure the file is uploaded to your website root');
    }
    
  } catch (error) {
    console.log(`❌ Error accessing ads.txt: ${error.message}`);
    console.log('   This might be normal if your site is not deployed yet');
  }
}

// Run the verification
verifyAdsText();

console.log('\n📋 Next Steps:');
console.log('1. Replace the placeholder Publisher ID with your real AdSense ID');
console.log('2. Deploy your website with the updated ads.txt file');
console.log('3. Wait 24-48 hours for Google to crawl the file');
console.log('4. Check your AdSense account for verification status');
