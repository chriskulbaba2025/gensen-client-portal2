// scripts/check-env.mjs
const required = [
    'COGNITO_DOMAIN',
    'COGNITO_CLIENT_ID',
    'COGNITO_REGION',
    'COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_COGNITO_DOMAIN',
    'NEXT_PUBLIC_COGNITO_CLIENT_ID',
    'AIRTABLE_TOKEN',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_TABLE_ID',
    'AIRTABLE_VIEW_ID',
  ];
  
  let missing = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length) {
    console.error('❌ Missing environment variables:\n', missing.join('\n'));
    process.exit(1);
  } else {
    console.log('✅ All required environment variables are present.');
  }
  