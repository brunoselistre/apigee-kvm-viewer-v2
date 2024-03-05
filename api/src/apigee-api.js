const listEnvironments = async (apigee, token, organization) => {
    try {
        const response = await apigee.get(`/v1/organizations/${organization}/environments`, {
            "headers": {
                "Authorization": `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const listKvms = async (apigee, token, organization, env) => {
    try {
        const response = await apigee.get(`/v1/organizations/${organization}/environments/${env}/keyvaluemaps`, {
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });        
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const listEntries = async (apigee, token, organization, env, kvm) =>{
    try {
        const response = await apigee.get(`/v1/organizations/${organization}/environments/${env}/keyvaluemaps/${kvm}/entries`, {
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });        
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const addEntry = async (apigee, token, organization, env, kvm, newEntry) => {
    try {
        const response = await apigee.post(`/v1/organizations/${organization}/environments/${env}/keyvaluemaps/${kvm}/entries`, newEntry, {
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    listEnvironments,
    listKvms,
    listEntries,
    addEntry
}