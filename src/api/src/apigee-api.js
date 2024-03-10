const axios = require('axios');

const apigee = axios.create({
    baseURL: "https://apigee.googleapis.com",
    timeout: 2000,
});

const formatAxiosError = (error) => ({
    reqVerb: error.response.config.method.toUpperCase(),
    reqUrl: error.response.config.url,
    reqBody: error.response.config.data || {},
    code: error.response.status,
    reason: error.response.statusText,
    message: error.response.data.error.message 
});

const listEnvironments = async (TOKEN, ORG, ) => {
    try {
        const response = await apigee.get(`/v1/organizations/${ORG}/environments`,
            { headers: {"Authorization": `Bearer ${await TOKEN}`} });
        return response.data;
    } catch (error) {
        console.log(formatAxiosError(error));
    }
};

const createKvm = async  (TOKEN, ORG, env, kvm) => {
    try {
        const response = await apigee.post(`/v1/organizations/${ORG}/environments/${env}/keyvaluemaps`, 
            { "name": kvm, "encrypted": true },
            { headers: {"Authorization": `Bearer ${TOKEN}`} });
        return response.data;
    } catch (error) {
        console.log(formatAxiosError(error));
    }
};

const listKvms = async (TOKEN, ORG, env) => {
    try {
        const response = await apigee.get(`/v1/organizations/${ORG}/environments/${env}/keyvaluemaps`,
            { headers: {"Authorization": `Bearer ${TOKEN}`} });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const listEntries = async (TOKEN, ORG, env, kvm) =>{
    try {
        const response = await apigee.get(`/v1/organizations/${ORG}/environments/${env}/keyvaluemaps/${kvm}/entries`,
            { headers: {"Authorization": `Bearer ${TOKEN}`} });
        return response.data;
    } catch (error) {
        console.log(formatAxiosError(error));
    }
}

const addEntry = async (TOKEN, ORG, env, kvm, newEntry) => {
    try {
        const response = await apigee.post(`/v1/organizations/${ORG}/environments/${env}/keyvaluemaps/${kvm}/entries`,
            newEntry,
            { headers: {"Authorization": `Bearer ${TOKEN}`} });
        return response.data;
    } catch (error) {
        console.log(formatAxiosError(error));
    }
}

const deleteEntry = async (TOKEN, ORG, env, kvm, entry)  => {
    try {
        const response = await apigee.delete(`/v1/organizations/${ORG}/environments/${env}/keyvaluemaps/${kvm}/entries/${entry}`,
            { headers: {"Authorization": `Bearer ${TOKEN}`} });

        return response.data;
    } catch (error) {
        console.log(formatAxiosError(error));
    }
};


module.exports = {
    listEnvironments,
    createKvm,
    listKvms,
    listEntries,
    addEntry,
    deleteEntry
}