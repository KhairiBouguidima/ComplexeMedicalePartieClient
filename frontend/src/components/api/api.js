const API_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};