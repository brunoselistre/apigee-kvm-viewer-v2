const api = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 2000,
});

async function submitAuthorization() {
    // Get form elements
    var organizationInput = document.getElementById('organization');
    var tokenInput = document.getElementById('token');

    // Get values from form inputs
    var organization = organizationInput.value;
    var token = tokenInput.value;
    
    try {
        const response = await api.post(`/api/authorize`, { organization, token },  {
            headers: {
              'Content-Type': 'application/json'
        }});
        
        if(response.status === 200 && response.data.authorized) {
            localStorage.setItem("org", organization);
            localStorage.setItem("token", token);
            localStorage.removeItem("environment");
            window.location.href = `/kvms`
        }
    } catch (error) {
        console.log(error);
    }
    
}

function refreshPage() {
    window.location.reload();
}





