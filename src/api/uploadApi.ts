// src/api/uploadApi.ts
const API_BASE =  'http://localhost:8000';

export const updateEnvWithFile = async (projectName: string, fileName: string): Promise<{ status: string; message: string }> => {
  const payload = {
    project_name: projectName,
    file_name: fileName,
  };

  try {
    console.log('Sending JSON to:', `${API_BASE}/reid`);
    const response = await fetch(`${API_BASE}/reid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Update failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Update success:', result);
    return result;
  } catch (error) {
    console.error('Full update error:', error);
    throw error;
  }
};