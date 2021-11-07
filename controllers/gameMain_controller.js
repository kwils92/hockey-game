/**
 * This file opens the selected save game (based on localstorage)
 */

let db;
let dbReq = indexedDB.open(localStorage.getItem('save-name'), 2);

dbReq.onupgradeneeded = function(event) {
    db = event.target.result; 
}

dbReq.onsuccess = function(event) {
    db = event.target.result; 

    //Page elements 
    let plyr = document.getElementById('player-spot');
    let gameDt = document.getElementById('game-date');

    //Get and display user player 
    getObjectFromStore(db, 'players', 'readwrite', '12345', 'It worked', 'It did not work').then(function (response) {
        plyr.innerHTML = response.name; 
        plyr.setAttribute('data-player-id', response.id); 
    }); 

    //Get and display game date
    getObjectFromStore(db, 'game-items', 'readwrite', 1, 'It worked', 'It did not work').then(function (response) {
        gameDt.innerHTML = response.toString().substring(0, 15); 
    }); 

    //Get and display team data
    getAllObjectsFromStore(db, 'teams', 'readwrite', 1, 'It worked', 'It did not work').then(function (response) {
        let listHTML = '<ul>';

        for (let ctr = 0; ctr < response.length; ctr++) {
            let team = response[ctr];

            listHTML += '<li>' + team.name + '</li>';
        }

        listHTML += '</ul>';

        document.getElementById('teams').innerHTML = listHTML;
    }); 

}

dbReq.onerror = function(event) {
    alert('Whoops! Something went wrong: ' + event.target.errorCode);
}

//Removes local storage save name (read: the current selected save file) and returns us to the main screen
function exitGame()
{
    localStorage.removeItem('save-name');
    window.location.href = "../views/main-view_welcome.html";
}
