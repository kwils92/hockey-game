/**
 * Contains various utility functions
 */


 //Converts Height in CM to Height in Feet + Inches live on forms
 function liveConvertHeight(){
    const cmInInch = 2.54; 
    const inchInFt = 12; 

    let heightinCM = document.getElementById("height").value; 
    let heightInIN = heightinCM / cmInInch;
    let heightInFT = Math.trunc(heightInIN / inchInFt); 
    let remainingIN = Math.trunc(heightInIN % inchInFt); 

    document.getElementById("imperial-addon-ht").innerHTML = `Imperial: ${heightInFT}'${remainingIN}"`;
}

//Converts Weight in KG to Weight in LBS live on forms 
function liveConvertWeight(){
    const poundInKG = 2.20462; 

    let weightInKG = document.getElementById("weight").value; 
    let weightInLBS = Math.trunc(weightInKG * poundInKG);

    document.getElementById("imperial-addon-wt").innerHTML = `Imperial: ${weightInLBS}lbs`;
}

//Rerolls player stats in the start menu
function rollPlayerStats(){
    let possession = document.getElementById("possession");
    let shooting   = document.getElementById("shooting");
    let passing    = document.getElementById("passing");
    let passTend   = document.getElementById("passTend");
    let saves      = document.getElementById("saving");

    possession.value = Math.floor(Math.random() * 30);
    shooting.value   = Math.floor(Math.random() * 30);
    passing.value    = Math.floor(Math.random() * 30);
    passTend.value   = Math.floor(Math.random() * 30);
    saves.value      = Math.floor(Math.random() * 30);
}

function addPlayerToPool(db, playerData) {
    // Start a database transaction and get the notes object store
    let tx = db.transaction(['players'], 'readwrite');
    let store = tx.objectStore('players');

    // Put the sticky note into the object store
    store.add(playerData);

    // Wait for the database transaction to complete
    tx.oncomplete = function() {
        //getAndDisplayNotes(db);
    }

    tx.onerror = function(event) {
      alert('Error storing player in pool ' + event.target.errorCode);
    }
  }

  /**
   * Loads the selected save into local storage for reference
   * @param {*selectedSave* contains the name of the save}  
   */
function selectSaveGame(selectedSave)
{
      localStorage.setItem('save-name', selectedSave);
      window.location.href = "game-view_main.html";
}

/**
 * Loads id of selected entity (could be a player id, a team id, etc.) into load storage so it's remembered between pages.
 * This remembered entity is simply overwritten whenever you click on the next thing. 
 * @param {*} entityId 
 */
function rememberPlayerId(plyrObj, pageToLoad){
    plyrId = document.getElementById(plyrObj).getAttribute('data-player-id');

    localStorage.setItem('curr-plyr-id', plyrId);
    window.location.href = pageToLoad; 
}

function addObjectToStore(db, objStore, writeRule, dataToStore, completeMsg, errorDesc)
{
    let tx = db.transaction([objStore], writeRule);
    let store = tx.objectStore(objStore);

    // Put the sticky note into the object store
    store.add(dataToStore);

    // Wait for the database transaction to complete
    tx.oncomplete = function() {
        console.log(completeMsg);
    }

    tx.onerror = function(event) {
      alert(errorDesc + event.target.errorCode);
    }
}

/**
 * This is a generic function for retrieving a single object from a specified object store. 
 * @param { } db 
 * @param {*} objStore 
 * @param {*} writeRule 
 * @param {*} keyToRetrieve 
 * @param {*} completeMsg 
 * @param {*} errorDesc 
 */
function getObjectFromStore(dbConn, objStore, writeRule, keyToRetrieve, completeMsg, errorDesc){
    return new Promise(
        function(resolve, reject) {
            let dbReq = indexedDB.open(localStorage.getItem('save-name'), 2);

            dbReq.onupgradeneeded = function(event) {
                db = event.target.result; 
            }
            
            dbReq.onsuccess = function(event) {
                db = event.target.result; 

                let tx = db.transaction([objStore], writeRule);
                let store = tx.objectStore(objStore);
            
                //select first player out of player array (user player in this case)
                let requestedData = store.get(keyToRetrieve);
            
                tx.oncomplete = function() {
                    console.log(requestedData.result);
            
                    resolve(requestedData.result);
                }
            
                tx.onerror = function(event) {
                    alert(errorDesc + event.target.errorCode);
                }
            }
        }
    )
}

/**
 * This function retrieves all objects from the specified object store 
 * @param {*} db 
 * @param {*} objStore 
 * @param {*} writeRule 
 * @param {*} completeMsg 
 * @param {*} errorDesc 
 */
function getAllObjectsFromStore(db, objStore, writeRule, completeMsg, errorDesc){
    return new Promise(
        function(resolve, reject) {
            let tx = db.transaction([objStore], writeRule);
            let store = tx.objectStore(objStore);
    
            let req = store.openCursor();
            let dataArr = [];
          
            req.onsuccess = function(event) {
                let cursor = event.target.result;

                if (cursor != null) {
                    dataArr.push(cursor.value);
                    cursor.continue();
                } else {
                    console.log(completeMsg);

                    resolve(dataArr);
                }
            }
        
            req.onerror = function(event) {
                alert(errorDesc + event.target.errorCode);
            }
        }
    )

}

function updateStoreRecord(db, objStore, writeRule, keyToRetrieve, completeMsg, errorDesc)
{
    let tx = db.transaction([objStore], writeRule);
    let store = tx.objectStore(objStore);

    //select first player out of player array (user player in this case)
    let requestedData = store.get(keyToRetrieve);

    tx.oncomplete = function() {
        console.log(requestedData.result);

        resolve(requestedData.result);
    }

    tx.onerror = function(event) {
        alert(errorDesc + event.target.errorCode);
    }
}

//Removes local storage save name (read: the current selected save file) and returns us to the main screen
function exitGame()
{
    localStorage.removeItem('save-name');
    window.location.href = "../views/main-view_welcome.html";
}
