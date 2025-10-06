// src/api/uploadApi.ts
const API_BASE =  'http://0.0.0.0:8080';

export const updateEnvWithFile = async (projectName: string, fileName: string): Promise<{ status: string; message: string }> => {
  const payload = {
    project_name: projectName,
    file_name: fileName,
  };

  try {
    console.log('Sending JSON to:', `${API_BASE}/edge_vision_req`);
    const response = await fetch(`${API_BASE}/edge_vision_req`, {
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


// src/api/uploadApi.ts (add below updateEnvWithFile)
export const checkResponseStatus = async (projectName: string, fileName: string): Promise<{ status: string; message: string }> => {
  const payload = {
    project_name: projectName,
    file_name: fileName,
  };

  try {
    console.log('Checking response at:', `${API_BASE}/edge_vision_response`);
    const response = await fetch(`${API_BASE}/edge_vision_response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Response check failed: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    console.log('Response check result:', result);
    return result;
  } catch (error) {
    console.error('Full response check error:', error);
    throw error;
  }
};