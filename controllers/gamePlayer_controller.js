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
     getObjectFromStore(db, 'players', 'readwrite', localStorage.getItem('curr-plyr-id'), 'It worked', 'It did not work').then(function (response) {
        let pName = document.getElementById('player-name'); 
        let pPos  = document.getElementById('player-position');
        let pTeam = document.getElementById('player-team');
        let pAttr = document.getElementById('player-attr-bdy');

        //pPos.innerHTML = response.position;
        pTeam.innerHTML = response.team;
        pName.innerHTML = response.name;     
        
        for(var attr in response.attributes){
            var nAtt = response.attributes[attr];
            for(var num in nAtt) {
                var yep = nAtt[num];
                let node = document.createElement("td");
                let txt = document.createTextNode(yep);
                
                node.appendChild(txt);
                pAttr.appendChild(node);
            }
        }
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

 