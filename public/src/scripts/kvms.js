async function getEntriesView(kvm) {
    localStorage.setItem('kvm', kvm);
    window.location.href = `/kvms/${kvm}/entries`;
}

async function listKeyValueMaps() {
    localStorage.removeItem("kvm");
    localStorage.removeItem("nextPageToken");

    try {
        // Handle environments
        const fetch_environments = await api.get(`/api/environments`);
        const environments = await fetch_environments.data;
        let environments_toggle = document.getElementById('environment-list');

        if(environments_toggle.value == "" || localStorage.getItem("environment") == null) {
            localStorage.setItem("environment", environments[0]);

            environments.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                environments_toggle.appendChild(optionElement);
            });
        }

        // Show KVMs
        const fetch_kvms = await api.get(`/api/kvms`);
        let kvms = await fetch_kvms.data;
        let kvms_list = document.getElementById('kvm-list');

        kvms_list.innerHTML = ''
        kvms.sort().forEach(async (kvm) => {
            const list_item = document.createElement('li');
            list_item.textContent = kvm;
            list_item.className = 'list-item';

            kvms_list.appendChild(list_item); 
            
            list_item.addEventListener('click', async () => getEntriesView(await kvm))            
        });
    } catch (error) {
        console.log(error);
        window.location.href = `/`
    }
}

async function updateEnvironment() {
    const environment = document.getElementById("environment-list").value;

    try {
        await api.put(`/api/environments`, { environment });
        localStorage.setItem("environment", environment);
        listKeyValueMaps();
    } catch (error) {
        console.log(error);
    }

}

async function createKvm() {
    const kvm = prompt("KVM name:");
    
    try {
        await api.post(`/api/kvms/${kvm}`);
        window.location.reload();        
    } catch (error) {
        console.log(error);
    }

}

function searchKvm() {
    const kvms_list = document.getElementById('kvm-list');
    const kvms = kvms_list.querySelectorAll('li');
    const searchInput = document.getElementById("search-kvm");
    const searchValue = searchInput.value.toLowerCase();

    kvms.forEach(kvm => {
        const text = kvm.textContent.toLowerCase();
        if (text.includes(searchValue)) {
            kvm.style.display = 'block';
        } else {
            kvm.style.display = 'none';
        }
    });
}