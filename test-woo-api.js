// Quick test file - run this to debug API
// Save as: test-woo-api.js
// Run: node test-woo-api.js

const axios = require('axios');

const baseURL = 'http://peptivepeptides.local';
const consumerKey = 'ck_82d0a2ddc33cf5c6c7469feb8201dd00057f7c94';
const consumerSecret = 'cs_793677472a2d0acd46a18ea7f7c9f62106ad8401';

async function testAPI() {
  console.log('🧪 Testing WooCommerce APIs...\n');

  // Test 1: Store API (no auth needed)
  console.log('📦 Test 1: Store API (Public)');
  try {
    const storeResponse = await axios.get(`${baseURL}/wp-json/wc/store/v1/products`);
    console.log(`✅ Store API works! Found ${storeResponse.data.length} products`);
    if (storeResponse.data.length > 0) {
      console.log('   First product:', storeResponse.data[0].name);
    }
  } catch (error) {
    console.error('❌ Store API failed:', error.response?.data || error.message);
  }

  console.log('\n🔑 Test 2: REST API v3 (With Auth)');
  try {
    const response = await axios.get(`${baseURL}/wp-json/wc/v3/products`, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      params: {
        per_page: 10,
      },
    });

    console.log('✅ REST API v3 works! Products fetched:');
    console.log(`   Found ${response.data.length} products\n`);

    if (response.data.length > 0) {
      console.log('First product:');
      console.log('   ID:', response.data[0].id);
      console.log('   Name:', response.data[0].name);
      console.log('   Price:', response.data[0].price);
      console.log('   Status:', response.data[0].status);
    } else {
      console.log('⚠️  No products found. Check product status in WooCommerce.');
    }
  } catch (error) {
    console.error('❌ REST API v3 failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
      console.log('\n💡 This means:');
      console.log('   - API keys might be wrong');
      console.log('   - User permissions issue');
      console.log('   - Security plugin blocking REST API');
      console.log('   - Legacy REST API not enabled');
    } else {
      console.error('   Error:', error.message);
    }
  }
}

testAPI();
