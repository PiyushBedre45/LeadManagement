export function getErrorMessage(error, fallback) {
  if (!error) return fallback;

  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message === "Network Error") return "Network error. Please check your connection and try again.";

  return fallback;
}
