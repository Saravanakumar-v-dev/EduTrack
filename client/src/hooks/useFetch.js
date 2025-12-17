import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios for cleaner HTTP requests

// Define the base URL for the backend API
// NOTE: You should replace this with your actual deployed URL or environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * A custom React hook for fetching data from the backend API.
 * It manages loading, error, and data states.
 *
 * @param {string} urlPath - The API endpoint path (e.g., '/students/profile/123').
 * @param {object} options - Configuration options for the fetch (e.g., method, body, headers).
 * @param {boolean} skip - If true, the fetch call is skipped initially.
 * @returns {{ data: any, loading: boolean, error: string | null, refetch: () => void }}
 */
const useFetch = (urlPath, options = {}, skip = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch logic, preventing unnecessary re-creation
  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    // Get JWT from localStorage, if available (for protected routes)
    const token = localStorage.getItem('token');
    
    // Merge provided headers with authorization header
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await axios({
        method: options.method || 'GET', // Default to GET
        url: `${API_BASE_URL}${urlPath}`,
        data: options.body, // axios uses 'data' for request body
        headers: headers,
        // Other axios config options can be passed here
      });

      if (response.status >= 400) {
        // Handle HTTP error statuses
        throw new Error(response.data.message || `HTTP error! Status: ${response.status}`);
      }

      setData(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Check if it's an axios error with a response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An unknown error occurred during data fetching.');
      }
      setData(null); // Clear old data on error
    } finally {
      setLoading(false);
    }
  }, [urlPath, options.method, options.body, JSON.stringify(options.headers), skip]); // Include all dependencies

  // useEffect runs the fetch function when the component mounts or dependencies change
  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [fetchData, skip]);

  // refetch function allows components to manually trigger a re-fetch (e.g., after a POST/PUT/DELETE)
  const refetch = () => {
    // Only refetch if not initially skipped
    if (!skip) {
      fetchData();
    }
  };

  return { data, loading, error, refetch };
};

export default useFetch;