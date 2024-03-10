async function listEntries() {
    let entries;
    let nextPageToken;

    const kvm = localStorage.getItem("kvm");
    const deleteSVG = "\n<svg viewport=\"0 0 12 12\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"> <line x1=\"1\" y1=\"11\" x2=\"11\" y2=\"1\" stroke=\"red\" stroke-width=\"2\"></line> <line x1=\"1\" y1=\"1\" x2=\"11\" y2=\"11\" stroke=\"red\" stroke-width=\"2\"></line></svg>\n";


    try {
        const fetch_entries = await api.get(`/api/kvms/${kvm}/entries`);
        entries = await fetch_entries?.data?.keyValueEntries;
        nextPageToken =  await fetch_entries?.data?.nextPageToken;
    } catch (error) {
        console.log(error);
    }

    if (nextPageToken !== '')         
        localStorage.setItem(`nextPageToken`, nextPageToken);

    let entries_table = document.querySelector("#kvm-entries-table > tbody");
    entries_table.innerHTML = '';
    entries?.sort().forEach(entry => {
        let {name: key, value} = entry;
        let row           = document.createElement('tr');
        let name_column   = document.createElement('td');
        let value_column  = document.createElement('td');
        let delete_column = document.createElement('td');
        let delete_btn    = document.createElement('button');

        name_column.textContent = key;
        value_column.textContent = value;

        delete_btn.textContent = 'Delete';
        delete_btn.id = 'remove-icon-btn';
        delete_btn.className = 'remove-icon-btn';
        delete_btn.ariaLabel = 'Remove';
        delete_btn.innerHTML = deleteSVG;
        delete_btn.addEventListener('click', async () => await deleteEntry(kvm, key)); 

        delete_column.appendChild(delete_btn);
        row.appendChild(name_column);
        row.appendChild(value_column);
        row.appendChild(delete_column);
        entries_table.appendChild(row);
    });
};

async function deleteEntry(kvm, key) {
    let delete_btn = document.getElementById('delete_btn');
    let confirmDelete = confirm(`Confirm deletion of key: \n- ${key}`);

    if (confirmDelete) {
        try {
            await api.delete(`/api/kvms/${kvm}/entries/${key}`);
            window.location.reload();
        } catch (error) {
            console.log(error);            
        }
    }
}

async function addEntries() {
    let kvm = localStorage.getItem("kvm");
    let entries = document.getElementById("entries").value;

    JSON.parse(entries).forEach(async (entry) => {
        if(entry.name === "" || entry.value === "" || typeof entry.name !== "string"|| typeof entry.value !== "string")
            return alert("Empty or invalid entries format")
        try {
            await api.post(`/api/kvms/${kvm}/entries`, entry);            
        } catch (error) {
            alert(error.message)
        }

        // Sleep to prevent spike arrests
        const SLEEP_TIME = 200;
        sleep(SLEEP_TIME);
    });
    window.location.reload();
};

async function exportEntries() {
    const kvm = localStorage.getItem('kvm');
    const env = localStorage.getItem('environment');
    let entries = [];

    try {
        const fetch_entries = await api.get(`/api/kvms/${kvm}/entries`);
        entries = await fetch_entries?.data?.keyValueEntries;
    } catch (error) {
        console.log(error);
    }

    if(entries.length > 0) {
        const jsonString = JSON.stringify(entries);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `${kvm}_${env}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);    
    }
}

function addEntriesPopup() {
    document.getElementById("add-entries-popup").style.display = "flex";
}

function closeEntriesPopup() {
    document.getElementById("add-entries-popup").style.display = "none";
}

function searchEntries() {
    const searchInput = document.getElementById('search-entry');
    const table = document.getElementById('kvm-entries-table');
    const rows = table.querySelectorAll('tbody tr');
    const searchValue = searchInput.value.toLowerCase();

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const text = cells[0].textContent.toLowerCase();
        if (text.includes(searchValue))
            row.style.display = 'table-row';
        else
            row.style.display = 'none';
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  