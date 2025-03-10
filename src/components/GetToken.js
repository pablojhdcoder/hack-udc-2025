// filepath: /home/kai/Documentos/HACKUDC/hack-udc-2025/src/components/GetToken.js
import axios from 'axios';

const AUTH_URL = 'https://cors-anywhere.herokuapp.com/https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token?grant_type=client_credentials&scope=technology.catalog.read';

export async function getToken() {
  try {
    const response = await axios.post(AUTH_URL, null, {
      auth: {
        username: "oauth-mkplace-oauthahmvzrqrfpcxnymekypropro",
        password: "c0Onh:}dwZI_5xfR",
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      return response.data.id_token; // Adjust based on your API response structure
    } else {
      throw new Error('Failed to get token');
    }
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}