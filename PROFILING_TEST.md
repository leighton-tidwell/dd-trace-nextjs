# Datadog Remote Service Configuration (RSC) Profiling Test

This project demonstrates how to use Datadog's Remote Service Configuration (RSC) profiling with a Next.js application.

## Setup

1. Make sure your `.env` file contains the necessary Datadog configuration:

```
DD_ORGANIZATION_API_KEY=your_org_api_key
DD_ORGANIZATION_API_KEY_ID=your_org_api_key_id
DD_APPLICATION_API_KEY=your_app_api_key
DD_APPLICATION_API_KEY_ID=your_app_api_key_id
DD_ENV="dev"
DD_LOGS_INJECTION=true
DD_PROFILING_ENABLED=true
```

2. Install dependencies:

```bash
npm install
```

## Running the Tests

### Web Application Test

1. Start the Next.js development server:

```bash
npm run dev
```

2. Open your browser and navigate to http://localhost:3000

3. Click on the "Datadog Profiling Test" button on the homepage

4. On the test page, click either the "Run Fibonacci (CPU Test)" or "Create Large Array (Memory Test)" buttons to generate profiling data

### Command Line Test

Run the profiling test script:

```bash
npm run test:profiling
```

This script will:
- Run a CPU-intensive Fibonacci calculation
- Create a large array to test memory usage
- Wait for the profiling data to be sent to Datadog

## Viewing Profiling Data in Datadog

1. Log in to your Datadog account

2. Navigate to APM > Profiling

3. Look for the service named "dd-rscs-demo"

4. You should see CPU and memory profiles for your application

## How It Works

The profiling setup consists of:

1. **Datadog Initialization**: The `src/utils/datadog.ts` file initializes the Datadog tracer with profiling enabled.

2. **Next.js Integration**: The `next.config.ts` file imports the Datadog tracer to ensure it's loaded when the application starts.

3. **Test Components**: The `ProfileTest.tsx` component provides a UI for running CPU and memory-intensive operations.

4. **Test Script**: The `scripts/test-profiling.js` script provides a command-line way to generate profiling data.

## Remote Service Configuration (RSC)

Datadog's RSC allows you to:

1. Dynamically adjust sampling rates
2. Enable/disable profiling remotely
3. Configure which functions to profile
4. Set profiling frequency

These configurations can be managed from the Datadog dashboard without requiring code changes or redeployments.

## Troubleshooting

If you don't see profiling data in Datadog:

1. Check that your API keys are correct in the `.env` file
2. Verify that `DD_PROFILING_ENABLED` is set to `true`
3. Make sure the Datadog agent is running (if using a local agent)
4. Check the browser console or server logs for any Datadog-related errors
