//Reads the databases available out of the availableDatabases database. 
indexedDB.databases().then(db => {
    tbl = document.getElementById("saves-tbl");

    for(ctr = 0; ctr < db.length; ctr++){
        row = document.createElement("tr"); 
        col = document.createElement("td");

        col.innerHTML = "<button class='btn btn-primary' id='" + db[ctr].name + "' onclick='selectSaveGame(this.id)'>" + db[ctr].name + "</button>"; 

        tbl.appendChild(row);
        row.appendChild(col);
    }
});