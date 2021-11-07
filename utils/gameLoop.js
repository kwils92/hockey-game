function goToNextDay()
{
    const tx = db.transaction(['game-items'], 'readwrite');
    const store = tx.objectStore('game-items'); 

    store.openCursor().onsuccess = function(event) {
        const cursor = event.target.result; 
    
        //check cursor is good
        if(cursor) {
            //get the date from db
            var jsonDate = cursor.value; 

            //convert to real date
            var gameDate = new Date(jsonDate);

            //increment to tomorrow
            gameDate.setDate(gameDate.getDate() + 1);

            //update date in db
            const request = cursor.update(gameDate); 

            request.onsuccess = function(event) {
                console.log("The sun rises...");

                //print new date to screen
                let gameDt = document.getElementById('game-date');
                gameDt.innerHTML = gameDate.toString().substr(0, 15); 

                //check event array to see if there is an event to fire 
                //you need to open a 2nd conn to get nested transactions to work
                getAllObjectsFromStore(db, 'schedule-events', 'readwrite', 'It worked', 'I did not worked').then(function (scheduleDataArr) {
                    getObjectFromStore('hey', 'players', 'readwrite', '12345', 'It worked', 'It did not work').then(function (playerDataArr) {
                        scheduleDataArr.forEach(gmEvent => {
                            if(gmEvent.date == gameDate){
                                if(gmEvent.team == playerDataArr.team)
                                console.log(gameDate + " | " + gmEvent.message); 
                            }      
                        });
                    }); 

                })
            }
        } else {
            console.log("Unable to find cursor while trying to go to the next day");
        }
    }
}
