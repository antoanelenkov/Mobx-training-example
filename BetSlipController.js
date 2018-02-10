var      BetSlipController= (function BetSlipController() {
    var instance = {};  

    instance.selections = mobx.observable([]);
    instance.stake = mobx.observable(0);
    instance.amountToWin = mobx.computed(()=> 
        {
            var odds = instance.selections.map((sel)=> sel.Odds); 

            // internal computed function which prevents call of the outter function if there are no odds   
            var stake = mobx.computed(()=> (odds.length && instance.stake.get())).get();

            return odds.length ? (odds.reduce((x,y)=>x+y)*stake).toFixed(2) : 0;
        })


    //MOBX ACTIONS
    instance.updateStake = mobx.action.bound(function(stake){
        this.stake.set(stake);
    });

    instance.addSelection = mobx.action.bound(function (selection) {
        var selectionToAdd = {};

        selectionToAdd.id = selection.id;
        selectionToAdd.Odds = selection.Odds;
        selectionToAdd.Team1Name = selection.Team1Name;
        selectionToAdd.Team2Name = selection.Team2Name;

        this.selections.push(selectionToAdd);
    });

    instance.removeSelection = mobx.action.bound(function (id) {
        selection = this.selections.find(function (sel) { return sel.id == id });

        selection && this.selections.remove(selection);
    });

    instance.updateSelection = mobx.action.bound(function (selection) {
        var selectionToUpdate = this.selections.find(function (x) { return x.id == selection.id });

        if (selectionToUpdate) {
            selectionToUpdate.Odds = selection.Odds;
            selectionToUpdate.Team1Name = selection.Team1Name;
            selectionToUpdate.Team2Name = selection.Team2Name;
        }
    });


    // MOBX REACTIONS
    // observe - called if state elements are changed even when transaction in action is being executed
    // using it, because object passed to handler has information for added/deleted items
    mobx.observe(instance.selections,addRemoveSelections);
    mobx.observe(instance.amountToWin,updateWinAmount);

    // using to determine if the state object will me modified
    mobx.intercept(instance.stake,validateStake);

    // reactions are called only when state element are mutated and available after transaction
    addReaction(updateTeamNamesMap, BetSlipView.updateTeamNames);
    addReaction(updateOddsMap, BetSlipView.updateOdds);

    function addReaction(mapFunction, callback) {
        mobx.reaction(mapFunction, callback,{delay:300});
    }

    //REACTIONS HANDLERS
    function updateWinAmount(changeObj){
        BetSlipView.updateAmountToWin(changeObj.newValue);
    }

    function addRemoveSelections(chnageObj){
        chnageObj.added.forEach(x=> BetSlipView.addSelection(x));     
        chnageObj.removed.forEach(x=> BetSlipView.removeSelection(x));    
    }

    function updateTeamNamesMap() {
        return instance.selections.map(function (x) {
            return { Team1Name: x.Team1Name, Team2Name: x.Team2Name, id: x.id }
        });
    };

    function updateOddsMap() {
        return instance.selections.map(function (x) {
            return { Odds: x.Odds, id: x.id }
        });
    };

    function validateStake(changeObj){
        if(changeObj.newValue<0){
            return;
        }

        return changeObj;
    }

    return instance
}());


