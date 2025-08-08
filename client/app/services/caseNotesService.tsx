const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});


export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/case-notes/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image case");
  return res.json();
};


export const uploadText = async (notes: string, token: string) => {
  const res = await fetch(`${BASE_URL}/case-notes/upload-text`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) throw new Error("Failed to submit case note");
  return res.json();
};


export const listCaseNotes = async (token: string) => {
  const res = await fetch(`${BASE_URL}/case-notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch case notes");
  return res.json();
};
