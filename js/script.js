
var home = {
    
}

var away = {

}

var game = {
    inProgress: false
}

function getNextGameID(teamID){
    const Http = new XMLHttpRequest();
    const url=`http://statsapi.web.nhl.com/api/v1/teams/${teamID}?expand=team.schedule.next`;
    Http.open("GET", url, false);
    Http.send(null);

    if (Http.status === 200) {
        
        var json = JSON.parse(Http.responseText);
        console.log(json);
        var nextGame = json["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0];
        var nextGameID = nextGame["gamePk"];
        
        game.nextGameID = nextGameID;
    
    
    }


    return nextGameID;

}

function getGame(gameID){
    const Http = new XMLHttpRequest();
    const url=`http://statsapi.web.nhl.com/api/v1/game/${gameID}/feed/live`;
    Http.open("GET", url, false);
    Http.send(null);

    if (Http.status === 200) {
        
        var json = JSON.parse(Http.responseText);
        console.log(json);
        var nextGame = json["gameData"];
        var nextGameStart = new Date(nextGame["datetime"]["dateTime"]).getTime();
        
        game.nextGameStart = nextGameStart;
        console.log(game.nextGameStart)
        console.log(`url("../images/logos/${json["gameData"]["teams"]["home"]["id"]}.svg");`)
        document.getElementById("homeLogo").style.backgroundImage = `url('./images/logos/${json["gameData"]["teams"]["home"]["id"]}.svg')`;
        document.getElementById("awayLogo").style.backgroundImage = `url('./images/logos/${json["gameData"]["teams"]["away"]["id"]}.svg')`;

    }
    

}

function getScore(gameID){
    const Http = new XMLHttpRequest();
    const url=`http://statsapi.web.nhl.com/api/v1/game/${gameID}/linescore`;
    Http.open("GET", url, false);
    Http.send(null);

    if (Http.status === 200) {
        
        var json = JSON.parse(Http.responseText);
        console.log(json);

        var homeTeam = json["teams"]["home"];
        var awayTeam = json["teams"]["away"];
        
        
        var homeScore = homeTeam["goals"];
        var awayScore = awayTeam["goals"];

        var period = json["currentPeriodOrdinal"]
        
        var time = json["currentPeriodTimeRemaining"] == "Final" ? "0.0" : json["currentPeriodTimeRemaining"]

        if(json["currentPeriodTimeRemaining"] == "Final" || json["currentPeriod"] == 0){
            time = "0.0";
            period = "Period"
        }
        
        document.getElementById("homeScore").innerHTML = homeScore;
        document.getElementById("awayScore").innerHTML = awayScore;
        document.getElementById("period").innerHTML = period;
        document.getElementById("timer").innerHTML = time;
        if(json["currentPeriodTimeRemaining"]=="Final"){
            game.inProgress == false;
        }
    }
}

function countdown(countDownDate){

    // Get todays date and time
    var now = new Date().getTime();
  
    // Find the distance between now and the count down date
    var distance = game.nextGameStart - now;
    //distance = 0;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
  
    // If the count down is finished, write some text 
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("countdown").innerHTML = "EXPIRED";
    
    
    }

    if (distance <= 0){
        game.inProgress = true
        //monitorGame(game.nextGameID);
    }

    return distance;
  }

function monitorGame(gameID){
    
    var intervalID = setInterval(function() { getScore(gameID); },10000);
    while(game.inProgress){
        setTimeout(10);
        
    }
    clearInterval(intervalID);
}

function drawScore(){

}

function main(game){
    if(game.inProgress==false && game.found==false){
        
        var game_id = getNextGameID(10);
        
        var distance = getGame(game_id);
        getScore(game_id);
        game.found = true;
    }if(game.inProgress==true){
        game.found==false
        getScore(game_id);
        console.log("inProg")
    }
    setTimeout(100000)
    return;
}



game.found=false;
setInterval(countdown,1000);
var game_id = getNextGameID(10);
game_id = game_id;
var distance = getGame(game_id);
getScore(game_id);

//main(game);



var main_id = setInterval(function(){main(game)}, 1000);
