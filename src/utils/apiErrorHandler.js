/**
 * Error handler utility for API responses
 * Handles standardized API response structure: { data, error }
 */

class ApiError extends Error {
  constructor(code, message, originalError = null) {
    super(message);
    this.code = code;
    this.originalError = originalError;
    this.name = 'ApiError';
  }
}

/**
 * Handle API response with standardized structure
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} - Resolved data from response
 * @throws {ApiError} - If response contains error or HTTP error
 */
export async function handleApiResponse(response) {
  // Handle HTTP errors (4xx, 5xx)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP Error: ${response.statusText}`,
      null
    );
  }

  try {
    const json = await response.json();
console.log('API Response JSON:', json);
    // Check if response has error field
    if (json.error) {
      throw new ApiError(
        json.error.code || 'UNKNOWN_ERROR',
        json.error.message || 'An unknown error occurred',
        json.error
      );
    }

    // Return data if no error
    return json.data;
  } catch (error) {
    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // If it's a parsing error or other error
    throw new ApiError(
      'PARSE_ERROR',
      'Failed to parse API response',
      error
    );
  }
}

/**
 * Wrapper for fetch call with error handling
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Resolved data from response
 * @throws {ApiError} - If request fails or API returns error
 */
export async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await handleApiResponse(response);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        'NETWORK_ERROR',
        'Network request failed. Please check your connection.',
        error
      );
    }

    // Re-throw if it's already an ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Unknown error
    throw new ApiError(
      'UNKNOWN_ERROR',
      error.message || 'An unexpected error occurred',
      error
    );
  }
}

/**
 * Format error for display to user
 * @param {ApiError|Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export function formatErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return error.message || 'An unexpected error occurred';
}

export default {
  ApiError,
  handleApiResponse,
  apiCall,
  formatErrorMessage,
};
