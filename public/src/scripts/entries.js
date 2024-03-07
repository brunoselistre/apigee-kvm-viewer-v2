
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
    entries?.forEach(entry => {
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
        await api.delete(`/api/kvms/${kvm}/entries/${key}`);
        window.location.reload();
    }
}

async function addEntries() {
    let kvm = localStorage.getItem("kvm");
    
    let entries = document.getElementById("entries").value;

    JSON.parse(entries).forEach(async (entry) => {
        if(entry.name === "" || entry.value === "" || typeof entry.name !== "string"|| typeof entry.value !== "string")
            return alert("Empty or invalid entries format")

        await api.post(`/api/kvms/${kvm}/entries`, entry);
    });
    window.location.reload();
};

function addEntriesPopup() {
    document.getElementById("add-entries-popup").style.display = "flex";
};

function closeEntriesPopup() {
    document.getElementById("add-entries-popup").style.display = "none";
};