"use server";

// This file contains server actions for form handling

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export async function submitForm(data: FormData) {
  // Validate the form data
  if (!data.name || !data.email || !data.message) {
    throw new Error("All fields are required");
  }

  if (!isValidEmail(data.email)) {
    throw new Error("Invalid email address");
  }

  // Simulate server processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate server-side validation and processing
  const processedData = {
    id: generateId(),
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    message: data.message.trim(),
    timestamp: new Date().toISOString(),
  };

  // In a real app, you would save this to a database
  console.log("Form submission received:", processedData);

  // Perform some CPU-intensive operations to test profiling
  const result = performHeavyComputation();

  // Return success response
  return {
    success: true,
    message: "Form submitted successfully!",
    data: processedData,
    computationResult: result,
  };
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function performHeavyComputation(): number {
  // Simulate a CPU-intensive task
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

/**
 * Validates form data without submitting it
 * This allows for real-time validation as the user types
 */
export async function validateForm(data: FormData): Promise<ValidationResult> {
  // Initialize validation result
  const result: ValidationResult = {
    valid: true,
    errors: {},
  };

  // Validate name
  if (!data.name || data.name.trim() === "") {
    result.valid = false;
    result.errors.name = "Name is required";
  } else if (data.name.length < 2) {
    result.valid = false;
    result.errors.name = "Name must be at least 2 characters";
  }

  // Validate email
  if (!data.email || data.email.trim() === "") {
    result.valid = false;
    result.errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    result.valid = false;
    result.errors.email = "Please enter a valid email address";
  }

  // Validate message
  if (!data.message || data.message.trim() === "") {
    result.valid = false;
    result.errors.message = "Message is required";
  } else if (data.message.length < 10) {
    result.valid = false;
    result.errors.message = "Message must be at least 10 characters";
  } else if (data.message.length > 500) {
    result.valid = false;
    result.errors.message = "Message must be less than 500 characters";
  }

  // Simulate a small delay to mimic server processing
  await new Promise((resolve) => setTimeout(resolve, 200));

  return result;
}
