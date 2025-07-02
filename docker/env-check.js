#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * This script validates that ALL required environment variables are set
 * before allowing any service to start. There are NO fallbacks - if any
 * required variable is missing, the process exits with an error.
 * 
 * Usage: node docker/env-check.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables - NO fallbacks allowed
const REQUIRED_ENV_VARS = [
  'BACKEND_PORT',
  'FRONTEND_PORT', 
  'SITE_PORT',
  'STORYBOOK_PORT',
  'DB_PORT',
  'DB_NAME',
  'TEST_DB_NAME'
];

function detectEnvironment() {
  const env = process.env.ENV || process.env.NODE_ENV || 'development';
  return ['CI', 'STAGING', 'PROD'].includes(env.toUpperCase());
}

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ FATAL: .env file not found at project root');
    console.error('   Expected location:', envPath);
    console.error('   Copy .env.example to .env and configure all required variables');
    process.exit(1);
  }

  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse .env file manually to avoid dependencies
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  } catch (error) {
    console.error('❌ FATAL: Failed to read .env file');
    console.error('   Error:', error.message);
    process.exit(1);
  }
}

function loadEnvironment() {
  const isProductionLike = detectEnvironment();
  const envName = process.env.ENV || process.env.NODE_ENV || 'development';
  
  if (isProductionLike) {
    console.log(`🔄 ${envName.toUpperCase()} environment detected - using system environment variables`);
    // Use existing process.env, no .env file loading
  } else {
    console.log('🔄 Development environment detected - loading .env file');
    loadEnvFile();
  }
}

function validateEnvironment() {
  console.log('🔍 Validating environment variables...');
  
  const missing = [];
  const present = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      missing.push(envVar);
    } else {
      present.push({ name: envVar, value: value.trim() });
    }
  }
  
  if (missing.length > 0) {
    const isProductionLike = detectEnvironment();
    const envName = process.env.ENV || process.env.NODE_ENV || 'development';
    
    console.error('❌ FATAL: Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`   ${envVar}`);
    });
    console.error('');
    
    if (isProductionLike) {
      console.error(`   Set these environment variables in your ${envName.toUpperCase()} deployment configuration`);
      console.error('   (GitHub Actions, Docker, Kubernetes, etc.)');
    } else {
      console.error('   Set these variables in your .env file at the project root');
      console.error('   Use .env.example as a template');
    }
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set:');
  present.forEach(({ name, value }) => {
    // Don't show sensitive values, just confirm they're set
    const displayValue = name.includes('PASSWORD') || name.includes('SECRET') 
      ? '*'.repeat(value.length) 
      : value;
    console.log(`   ${name}=${displayValue}`);
  });
  console.log('');
}

function main() {
  try {
    loadEnvironment();
    validateEnvironment();
    console.log('🚀 Environment validation passed - proceeding with startup');
  } catch (error) {
    console.error('❌ FATAL: Environment validation failed');
    console.error('   Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { detectEnvironment, loadEnvFile, loadEnvironment, validateEnvironment };