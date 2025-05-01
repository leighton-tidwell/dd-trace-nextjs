/**
 * Test script to verify Datadog integration
 * 
 * This script generates logs, traces, and metrics to verify that Datadog is properly configured.
 */

// Import Datadog tracer
const tracer = require('../src/utils/datadog');

console.log('Starting Datadog integration test...');

// Create a span to test tracing
const span = tracer.startSpan('test.operation');
span.setTag('test.type', 'integration');
span.setTag('test.version', '1.0');

// Log some messages at different levels
console.log('This is a standard log message');
console.warn('This is a warning message');
console.error('This is an error message');

// Simulate some work
function doWork(iterations) {
  console.log(`Performing ${iterations} iterations of work...`);
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

// Create child spans for different operations
function performOperation(name, iterations) {
  const childSpan = tracer.startSpan(`test.${name}`, { childOf: span });
  childSpan.setTag('iterations', iterations);
  
  try {
    console.log(`Starting operation: ${name}`);
    const result = doWork(iterations);
    childSpan.setTag('result', result.toFixed(2));
    console.log(`Completed operation: ${name}, result: ${result.toFixed(2)}`);
    return result;
  } catch (error) {
    childSpan.setTag('error', true);
    childSpan.setTag('error.message', error.message);
    childSpan.setTag('error.stack', error.stack);
    console.error(`Error in operation ${name}:`, error);
    throw error;
  } finally {
    childSpan.finish();
  }
}

// Perform a series of operations
async function runTest() {
  try {
    // Operation 1: CPU-intensive task
    performOperation('cpu_task', 1000000);
    
    // Operation 2: Simulated async operation
    await new Promise(resolve => {
      console.log('Starting async operation...');
      setTimeout(() => {
        performOperation('async_task', 500000);
        console.log('Async operation completed');
        resolve();
      }, 1000);
    });
    
    // Operation 3: Generate an error
    try {
      console.log('Attempting operation that will fail...');
      const errorSpan = tracer.startSpan('test.error', { childOf: span });
      errorSpan.setTag('will_error', true);
      
      // This will throw an error
      const obj = null;
      obj.nonExistentMethod();
    } catch (error) {
      console.error('Caught expected error:', error.message);
    }
    
    // Finish the main span
    span.finish();
    
    console.log('Datadog integration test completed');
    console.log('Check your Datadog dashboard for traces, logs, and metrics');
    
    // Keep the process running for a bit to allow data to be sent
    console.log('Waiting for data to be sent to Datadog...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Test script completed');
  } catch (error) {
    console.error('Unexpected error in test:', error);
    span.setTag('error', true);
    span.setTag('error.message', error.message);
    span.finish();
  }
}

// Run the test
runTest();
