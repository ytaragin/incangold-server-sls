const Cards = require("../lib/Cards");


test('Create Cards', async () => {

    let origCards = [
        new Cards.TreasureCard({img:"", value:7}),
        new Cards.TreasureCard({img:"", value:9}),
        new Cards.HazardCard({img:"", type:"Spider"}),
        new Cards.TreasureCard({img:"", value:11}),
        new Cards.ArtifactCard({img:""}),
        new Cards.HazardCard({img:"", type:"Fire"}),
        new Cards.HazardCard({img:"", type:"Spider"}),
        new Cards.TreasureCard({img:"", value:5}),
        new Cards.HazardCard({img:"", type:"Fire"})
    ];

    let jsonStr = JSON.stringify(origCards);

    let jsonObj = JSON.parse(jsonStr);
    let newCards = Cards.recreateCards(jsonObj);

    expect(newCards).toEqual(origCards);




});