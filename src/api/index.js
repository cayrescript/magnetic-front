const API_URL = 'https://api.sampleapis.com/baseball';

class BaseballApi {
    fetchHitsSingleSeason = async () => {
        try {
            const response = await fetch(`${API_URL}/hitsSingleSeason`);

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default BaseballApi;
