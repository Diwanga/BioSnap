import { API_ENDPOINTS } from '../config';

// Get upload URL from backend
export async function getUploadUrl(token, fileExtension = 'jpg') {
  const response = await fetch(API_ENDPOINTS.GET_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileExtension }),
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  return response.json();
}

// Upload image directly to S3
export async function uploadToS3(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return true;
}

// Trigger recognition
export async function recognizeImage(token, imageKey) {
  const response = await fetch(API_ENDPOINTS.RECOGNIZE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageKey }),
  });

  if (!response.ok) {
    throw new Error('Failed to recognize image');
  }

  return response.json();
}

// Get user's history
export async function getHistory(token) {
  const response = await fetch(API_ENDPOINTS.HISTORY, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return response.json();
}