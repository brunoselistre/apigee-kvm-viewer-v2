window.addEventListener('beforeunload', () => localStorage.clear());

async function listEntries(kvm) {
    const fetch_entries = await api.get(`/api/kvms/${kvm}/entries`);
    window.location.href = `/kvms/${kvm}/entries`;
    console.log(fetch_entries.data.keyValueEntries);

}

async function listKeyValueMaps() {
    try {
        const fetch_environments = await api.get(`/api/environments`);
        const environments = await fetch_environments.data;

        let environments_toggle = document.getElementById('environment-list');

        if(localStorage.getItem("environment") == null) {
            localStorage.setItem("environment", environments[0]);

            environments.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                environments_toggle.appendChild(optionElement);
            });
        }

        const fetch_kvms = await api.get(`/api/kvms`);
        const kvms = await fetch_kvms.data;
        let kvms_list = document.getElementById('kvm-list')
        kvms_list.innerHTML = ''
        kvms.forEach(async (kvm) => {
            const list_item = document.createElement('li');
            list_item.textContent = kvm;
            list_item.className = 'list-item';

            const delete_btn = document.createElement('button');
            delete_btn.textContent = 'Delete';
            delete_btn.className = 'delete-btn';
        
            list_item.appendChild(delete_btn);
            kvms_list.appendChild(list_item); 
            
            list_item.addEventListener('click', async () => listEntries(await kvm))            
        });
    } catch (error) {
        console.log(error);
        window.location.href = `/`
    }
}

async function updateEnvironment() {
    const environment = document.getElementById("environment-list").value;

    try {
        const updateEnvironment = await api.put(`/api/environments`, { environment });
        localStorage.setItem("environment", environment);
        listKeyValueMaps();
    } catch (error) {
        console.log(error);
    }

}

function sortByAlphabetical(list, attribute) {
    return list.sort((a, b) => a[attribute].localeCompare(b[attribute]));
};