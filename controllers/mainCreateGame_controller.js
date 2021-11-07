function createNewGame(){
    const dbName = document.getElementById("save-name").value.trim(); 
    let db;
    let dbReq = indexedDB.open(dbName, 1);

    dbReq.onupgradeneeded = function(event) {
        db = event.target.result; 

        //create player object store 
        db.createObjectStore(
            'players', {
                autoIncrement: true,
                keyPath: "id"
            },
        )

        //object store for things like current in-game date, etc. 
        db.createObjectStore(
            'game-items', {
                autoIncrement: true
            }
        )

        //object store for events
        //The link below will probably be important. So what you'll want to do probably, is create an index on date and go, 
        //var data = db.transaction(storeName).objectStore(storeName).index("date").get(TODAYS_DATE)
        //https://stackoverflow.com/questions/32214815/indexeddb-what-is-key-keypath-and-indexname
        var scheduleStore = db.createObjectStore(
            'schedule-events', {
                autoIncrement: true
            }
        )

        //Create index on date 
        scheduleStore.createIndex("date", "date", {unique: false})

        //object store for team data
        db.createObjectStore(
            'teams', {
                autoIncrement: true
            }
        )
    }
    
    dbReq.onsuccess = function(event) {
        db = event.target.result; 
        console.log("Save Database Created...");
        
        //accept user data from creation screen
        let unsanUserData = createUserData();

        //add user player to pool of players
        addPlayerToPool(db, unsanUserData);

        //import team data
        loadJSON("../model/teams.json", dbName, 'teams', 'teamData');

        //import player data
        loadJSON("../model/players.json", dbName, 'players', 'playerData');

        //import schedule data
        loadJSON("../model/schedule.json", dbName, 'schedule-events', 'scheduleEvents');

        //set in game time 
        addObjectToStore(db, 'game-items', 'readwrite', 'Mon Aug 30 1948 12:00:50 GMT-0400 (Eastern Daylight Time)', 'welcome to 1984!', 'Something went wrong with the time machine... ')

        //set save name in local storage
        localStorage.setItem('save-name', dbName);

        //remove create button show play button
        let formButtons = document.getElementById("form-buttons");
        formButtons.innerHTML = "<button class='btn btn-primary' id='" + dbName + "' onclick='selectSaveGame(this.id)'>Play Game</button>";

        alert('Game ' + dbName + ' Created!');
    }

    dbReq.onerror = function(event) {
        alert('error opening database ' + event.target.errorCode);
    }    
}

function createUserData() {
    console.log("Gathering Your Player Information...");
    
    let playerName       = document.getElementById('name').value;
    let playerHeight     = parseInt(document.getElementById('height').value);
    let playerWeight     = parseInt(document.getElementById('weight').value);
    let playerPossession = parseInt(document.getElementById('possession').value);
    let playerShooting   = parseInt(document.getElementById('shooting').value);
    let playerPassing    = parseInt(document.getElementById('passing').value);
    let playerPassTend   = parseInt(document.getElementById('passTend').value);
    let playerSaving     = parseInt(document.getElementById('saving').value);
    let playerTeam       = document.getElementById('team').value;
    let playerPosition   = document.getElementById('position').value;

    let unsanPlayerData = {
        id: '12345',
        name: playerName, 
        height: playerHeight, 
        weight: playerWeight, 
        attributes: [{
            possession: playerPossession,
            shooting: playerShooting,
            passing: playerPassing,
            passTendency: playerPassTend,
            saving: playerSaving,
        }],
        team: playerTeam,
        position: playerPosition
    }

    return unsanPlayerData; 
}

async function loadJSON(fileName, dbName, storeName, objName){
    console.log("Gathering all player data...");

    var resp = await fetch(fileName);
    var str  = await resp.text(); 
    var data = JSON.parse(str);
    var idb  = await importIDB(dbName, storeName, data[objName]);
}

function importIDB(dbName, storeName, importData){
    console.log("Importing player data...");

    return new Promise(function(resolve) {
        var r = window.indexedDB.open(dbName);

        r.onupgradeneeded = function () {
            var idb = r.result;
            var store = idb.createObjectStore(storeName)
        }

        r.onsuccess = function() {
            console.log("Player Data Imported!");

            var idb = r.result
            let tx = idb.transaction(storeName, "readwrite")
            var store = tx.objectStore(storeName)
            
            for(var obj of importData){
                store.put(obj);
            }

            resolve(idb);
        }

        r.onerror = function(e) {
            alert("Didn't work, young money " + e.target.errorCode);
        }
    })
}