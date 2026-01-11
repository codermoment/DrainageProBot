const axios = require("axios");

exports.handler = async function (event, context) {
    const API_SECRET = process.env.API_SECRET;
    const endpoint = `http://18.217.27.236:8000/chatbot`;
    console.log('Function invoked');

    // Ensure that you're sending a proper JSON payload from your client side. 
    const payload = JSON.parse(event.body);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {
                'Authorization': `Bearer ${API_SECRET}`, // Removed unnecessary quotes
                "Content-Type": "application/json",
            }
        });

        // axios automatically parses JSON response into JS object. 
        // You can directly send it back to the client.
        console.log("response:", response.data);
        console.log("response", response.data.result)
        return {
            statusCode: 200,
            body: JSON.stringify(response.data.result)
        };

    } catch (error) {
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' }) // Better to not expose the raw error to clients
        };
    }
}

