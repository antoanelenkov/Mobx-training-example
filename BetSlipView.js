var BetSlipView = (function(){
 var instance = {};

 instance.addSelection = function(selection){
        var id = selection.id;
        var selectionsContainer = document.getElementById("selections")
         var element = document.createElement('tr');
         var team1Element = document.createElement('td');
         var team2Element = document.createElement('td'); 
         var oddsElement = document.createElement('td');

         element.id = "selection_" + id;
         team1Element.id = "Team1Name_"  + id;
         team2Element.id = "Team2Name_"  + id;
         oddsElement.id = "cOddsToWhow_"  + id;

         team1Element.innerHTML = selection.Team1Name;
         team2Element.innerHTML = selection.Team2Name;
         oddsElement.innerHTML = selection.Odds;

         element.appendChild(team1Element);
         element.appendChild(team2Element);
         element.appendChild(oddsElement);
        selectionsContainer.appendChild(element);
 }

    instance.removeSelection = function(selection){
        var selectionsContainer = document.getElementById("selection_" + selection.id);
        selectionsContainer.parentElement.removeChild(selectionsContainer);
    }

     instance.updateTeamNames=function (selections) {
        selections.forEach(function (selection) {

            updateElement(selection.id, "Team1Name", selection.Team1Name);
            updateElement(selection.id, "Team2Name", selection.Team2Name);
        });
    }

    instance.updateOdds=function(selections) {
        selections.forEach(function (selection) {
            var el = document.getElementById("cOddsToWhow_" + selection.id);
            el && (el.innerHTML = selection.Odds);
        });
    }

    instance.updateAmountToWin = function(amount){
        var el = document.getElementById("amountToWin");
        el && (el.innerHTML = amount);
    }

    function updateElement(id, prefix, value) {
        var element = document.getElementById(prefix   + "_" + id);

        element && (element.innerHTML = value);
    }

 return instance;
}());