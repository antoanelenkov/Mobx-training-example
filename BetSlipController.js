var      BetSlipController= (function BetSlipController() {
    var instance = {};

    instance.state = {};

    instance.state.selections = mobx.observable([]);


    //MOBX ACTIONS
    instance.addSelection = mobx.action.bound(function (selection) {
        var selectionToAdd = {};

        selectionToAdd.id = selection.id;
        selectionToAdd.Odds = selection.Odds;
        selectionToAdd.Team1Name = selection.Team1Name;
        selectionToAdd.Team2Name = selection.Team2Name;

        instance.state.selections.push(selectionToAdd);
    });

    instance.removeSelection = mobx.action.bound(function (id) {
        selection = instance.state.selections.find(function (sel) { return sel.id == id });

        selection && instance.state.selections.remove(selection);
    });

    instance.updateSelection = mobx.action.bound(function (selection) {
        var selectionToUpdate = instance.state.selections.find(function (x) { return x.id == selection.id });

        if (selectionToUpdate) {
            selectionToUpdate.Odds = selection.Odds;
            selectionToUpdate.Team1Name = selection.Team1Name;
            selectionToUpdate.Team2Name = selection.Team2Name;
        }
    });

    mobx.observe(instance.state.selections,addRemoveSelections);

    // MOBX REACTIONS
    addReaction(updateTeamNamesMap, BetSlipView.updateTeamNames);
    addReaction(updateOddsMap, BetSlipView.updateOdds);

    function addSelection(selection){
      
    }

    function addRemoveSelections(chnageObj){
        chnageObj.added.forEach(x=> BetSlipView.addSelection(x));     
        chnageObj.removed.forEach(x=> BetSlipView.removeSelection(x));    
    }

    function addReaction(mapFunction, callback) {
        mobx.reaction(mapFunction, callback);
    }

    function updateTeamNamesMap(a,b) {
        return instance.state.selections.map(function (x) {
            return { Team1Name: x.Team1Name, Team2Name: x.Team2Name, id: x.id }
        });
    };

    function updateOddsMap() {
        return instance.state.selections.map(function (x) {
            return { Odds: x.Odds, id: x.id }
        });
    };

    return instance
}());


