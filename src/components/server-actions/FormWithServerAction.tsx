"use client";

import { useState, useEffect } from "react";
import { submitForm, validateForm } from "@/utils/wrap-server-actions";

export default function FormWithServerAction() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add validation state
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isValidating, setIsValidating] = useState(false);
  const [validationTimeout, setValidationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Add useEffect for validation
  useEffect(() => {
    // Clear any existing validation messages when form status changes
    if (formStatus.success) {
      setValidationErrors({});
    }
  }, [formStatus]);

  // Cleanup effect for the validation timeout
  useEffect(() => {
    // Return cleanup function to clear timeout when component unmounts
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any existing timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    // Set a new timeout to validate after user stops typing
    const timeout = setTimeout(async () => {
      // Only validate if we have some content
      if (value.trim().length > 0) {
        setIsValidating(true);
        try {
          // Get the updated form data
          const updatedData = {
            ...formData,
            [name]: value,
          };

          // Call the server action to validate
          const result = await validateForm(updatedData);

          // Update validation errors
          setValidationErrors(result.errors);
        } catch (error) {
          console.error("Validation error:", error);
        } finally {
          setIsValidating(false);
        }
      }
    }, 500); // 500ms debounce

    setValidationTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate the form before submitting
      const validationResult = await validateForm(formData);

      if (!validationResult.valid) {
        // Update validation errors
        setValidationErrors(validationResult.errors);
        setFormStatus({
          success: false,
          message: "Please fix the errors in the form before submitting.",
        });
        return;
      }

      // If validation passes, submit the form
      const result = await submitForm(formData);
      setFormStatus({
        success: true,
        message: result.message,
      });

      // Reset form on success
      if (result.success) {
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        // Clear validation errors
        setValidationErrors({});
      }
    } catch (error) {
      setFormStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Contact Form with Server Action</h3>
      <p>This form uses a server action to process the submission.</p>

      {formStatus.message && (
        <div
          className={`status-message ${
            formStatus.success ? "success" : "error"
          }`}
        >
          {formStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={validationErrors.name ? "error" : ""}
          />
          {validationErrors.name && (
            <div className="validation-error">{validationErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={validationErrors.email ? "error" : ""}
          />
          {validationErrors.email && (
            <div className="validation-error">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className={validationErrors.message ? "error" : ""}
          />
          {validationErrors.message && (
            <div className="validation-error">{validationErrors.message}</div>
          )}
          <div className="character-count">
            {formData.message.length} / 500 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? "submitting" : ""}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <style jsx>{`
        .form-container {
          padding: 1.5rem;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1a1a1a;
          margin-bottom: 2rem;
          color: #dddddd;
        }

        .status-message {
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .success {
          background-color: #1a3a1a;
          border: 1px solid #2a5a2a;
          color: #52c41a;
        }

        .error {
          background-color: #3a1a1a;
          border: 1px solid #5a2a2a;
          color: #ff7875;
        }

        form {
          margin-top: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #dddddd;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #444;
          border-radius: 4px;
          font-size: 1rem;
          background-color: #333333;
          color: #dddddd;
        }

        button {
          padding: 0.5rem 1rem;
          background-color: #1a3a4a;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        button:hover:not(:disabled) {
          background-color: #2a5a7a;
        }

        button:disabled {
          background-color: #333333;
          cursor: not-allowed;
        }

        button.submitting {
          opacity: 0.7;
        }

        .validation-error {
          color: #ff7875;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        input.error,
        textarea.error {
          border-color: #5a2a2a;
          background-color: #3a1a1a;
        }

        .character-count {
          font-size: 0.8rem;
          color: #999;
          text-align: right;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
