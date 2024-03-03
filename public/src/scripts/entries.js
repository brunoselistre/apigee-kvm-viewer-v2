window.addEventListener("beforeunload", function(event) {
    localStorage.removeItem("nextPageToken");
});

async function listEntries() {

    try {
        let currentUri = window.location.href;
        let kvm = currentUri.match(/kvms\/([^\/]+)\/entries/)?.pop();

        const fetch_entries = await api.get(`/api/kvms/${kvm}/entries`);
        let { keyValueEntries: entries, nextPageToken } = await fetch_entries.data;
        
        if (nextPageToken === '') 
            localStorage.setItem(`nextPageToken`, nextPageToken);
            
        let entries_table = document.querySelector("#kvm-entries-table > tbody");

        const deleteSVG = "\n<svg viewport=\"0 0 12 12\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"> <line x1=\"1\" y1=\"11\" x2=\"11\" y2=\"1\" stroke=\"red\" stroke-width=\"2\"></line> <line x1=\"1\" y1=\"1\" x2=\"11\" y2=\"11\" stroke=\"red\" stroke-width=\"2\"></line></svg>\n";

        entries_table.innerHTML = '';
        entries?.forEach(entry => {
            let {name, value} = entry;

            let row = document.createElement('tr');
            let name_column = document.createElement('td');
            name_column.textContent = name;

            let value_column = document.createElement('td');
            value_column.textContent = value;

            let delete_column = document.createElement('td');
            let delete_btn = document.createElement('button');
            delete_btn.textContent = 'Delete';
            delete_btn.className = 'remove-icon-btn';
            delete_btn.ariaLabel = 'Remove';
            delete_btn.innerHTML = deleteSVG;

            delete_column.appendChild(delete_btn);
            row.appendChild(name_column);
            row.appendChild(value_column);
            row.appendChild(delete_column);
            entries_table.appendChild(row);
        });
    } catch (error) {
        console.log(error);
    }
};