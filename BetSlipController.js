var      BetSlipController= (function BetSlipController() {
    var instance = {};

    instance = {};

    instance.selections = mobx.observable([]);
    instance.stake = mobx.observable(0);
    instance.amountToWin = mobx.computed(()=> 
        {
            var odds = instance.selections.map((sel)=> sel.Odds); 
            var stake = instance.stake.get();
            return odds.length ? (odds.reduce((x,y)=>x+y)*stake).toFixed(2) : 0;
        })


    //MOBX ACTIONS
    instance.updateStake = mobx.action.bound(function(stake){
        instance.stake.set(stake);
    });

    instance.addSelection = mobx.action.bound(function (selection) {
        var selectionToAdd = {};

        selectionToAdd.id = selection.id;
        selectionToAdd.Odds = selection.Odds;
        selectionToAdd.Team1Name = selection.Team1Name;
        selectionToAdd.Team2Name = selection.Team2Name;

        instance.selections.push(selectionToAdd);
    });

    instance.removeSelection = mobx.action.bound(function (id) {
        selection = instance.selections.find(function (sel) { return sel.id == id });

        selection && instance.selections.remove(selection);
    });

    instance.updateSelection = mobx.action.bound(function (selection) {
        var selectionToUpdate = instance.selections.find(function (x) { return x.id == selection.id });

        if (selectionToUpdate) {
            selectionToUpdate.Odds = selection.Odds;
            selectionToUpdate.Team1Name = selection.Team1Name;
            selectionToUpdate.Team2Name = selection.Team2Name;
        }
    });


    // MOBX REACTIONS
    // using observe, because object passed to handler has information for added/deleted items
    mobx.observe(instance.selections,addRemoveSelections);
    mobx.observe(instance.amountToWin,updateWinAmount);

    addReaction(updateTeamNamesMap, BetSlipView.updateTeamNames);
    addReaction(updateOddsMap, BetSlipView.updateOdds);

    function addReaction(mapFunction, callback) {
        mobx.reaction(mapFunction, callback);
    }

    //REACTIONS HANDLERS
    function updateWinAmount(changeObj){
        BetSlipView.updateAmountToWin(changeObj.newValue);
    }

    function addRemoveSelections(chnageObj){
        chnageObj.added.forEach(x=> BetSlipView.addSelection(x));     
        chnageObj.removed.forEach(x=> BetSlipView.removeSelection(x));    
    }

    function updateTeamNamesMap(a,b) {
        return instance.selections.map(function (x) {
            return { Team1Name: x.Team1Name, Team2Name: x.Team2Name, id: x.id }
        });
    };

    function updateOddsMap() {
        return instance.selections.map(function (x) {
            return { Odds: x.Odds, id: x.id }
        });
    };

    return instance
}());


