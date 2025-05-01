/**
 * Test script to verify Datadog profiling is working
 * 
 * This script performs CPU and memory-intensive operations
 * to generate profiling data that can be viewed in Datadog.
 */

// Import Datadog tracer
require('../src/utils/datadog');

console.log('Starting Datadog profiling test...');

// CPU-intensive function (recursive Fibonacci)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memory-intensive function
function createLargeArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push({ index: i, value: `item-${i}` });
  }
  return arr;
}

// Function to simulate async operations
function simulateAsyncOperation(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test function
async function runProfilingTest() {
  try {
    // Test 1: CPU-intensive operation
    console.log('Running CPU-intensive test (Fibonacci)...');
    console.time('fibonacci');
    const fibResult = fibonacci(40); // Large enough to be CPU-intensive
    console.timeEnd('fibonacci');
    console.log(`Fibonacci result: ${fibResult}`);
    
    // Wait a bit between tests
    await simulateAsyncOperation(1000);
    
    // Test 2: Memory-intensive operation
    console.log('Running memory-intensive test (Large Array)...');
    console.time('createLargeArray');
    const arr = createLargeArray(1000000); // 1 million objects
    console.timeEnd('createLargeArray');
    console.log(`Array created with ${arr.length} elements`);
    
    // Wait a bit to allow profiling data to be sent
    console.log('Waiting for profiling data to be sent...');
    await simulateAsyncOperation(5000);
    
    console.log('Profiling test completed successfully!');
    console.log('Check your Datadog dashboard for profiling data.');
    console.log('Look for the service name "dd-rscs-demo" in your Datadog account.');
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error('Error during profiling test:', error);
    process.exit(1);
  }
}

// Run the test
runProfilingTest();
