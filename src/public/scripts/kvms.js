async function environmentsToggle() { 

    let environments
    let fetch_environments;
    let environments_toggle = document.getElementById('environment-list');

    try {
        fetch_environments = await api.get(`/api/environments`);
        environments = await fetch_environments.data;
    } catch (error) {
        console.log(error);
    }

    if(environments_toggle.value == "" || localStorage.getItem("environment") == null) {
        localStorage.setItem("environment", environments[0]);

        environments.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            environments_toggle.appendChild(optionElement);
        });
    }
}

async function updateEnvironment() {
    const environment = document.getElementById("environment-list").value;

    try {
        await api.put(`/api/environments`, { environment });
        localStorage.setItem("environment", environment);
        listKvms();
    } catch (error) {
        console.log(error);
    }
}

async function listKvms() {

    let kvms;
    let fetch_kvms;
    let kvms_list = document.getElementById('kvm-list');

    kvms_list.innerHTML = '';
    localStorage.removeItem("kvm");
    localStorage.removeItem("nextPageToken");

    try {
        fetch_kvms = await api.get(`/api/kvms`);
        kvms = await fetch_kvms.data;
    } catch (error) {
        console.log(error);
        window.location.href = `/`
    }
    
    kvms.sort().forEach(async (kvm) => {
        const list_item = document.createElement('li');
        list_item.textContent = kvm;
        list_item.className = 'list-item';
        list_item.addEventListener('click', async () => {
            localStorage.setItem('kvm', kvm);
            window.location.href = `/kvms/${kvm}/entries`;
        });      
        kvms_list.appendChild(list_item); 
    });

    // Environments toggle
    await environmentsToggle();
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