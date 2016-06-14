var redfish64 = { };

//stolen from bitaddress.org TODO 2 give attrition
redfish64.seeder = {
    init: (function () {
    })(),

    // number of mouse movements to wait for
    seedLimit: (function () {
	return 200 + Math.floor(Math.random()*12);
    })(),

    seedCount: 0, // counter
    lastInputTime: new Date().getTime(),
    seedPoints: [],
    seedData: [],
    isStillSeeding: true,

    // seed function exists to wait for mouse movement to add more entropy before generating an address
    seed: function (evt) {
	if (!evt) var evt = window.event;
	var timeStamp = new Date().getTime();
	// seeding is over now we generate and display the address
	if (redfish64.seeder.seedCount == redfish64.seeder.seedLimit) {
	    redfish64.seeder.seedCount++;
	    redfish64.seeder.seedingOver();
	}
	// seed mouse position X and Y when mouse movements are greater than 40ms apart.
	else if ((redfish64.seeder.seedCount < redfish64.seeder.seedLimit) && evt && (timeStamp - redfish64.seeder.lastInputTime) > 40) {
	    redfish64.seeder.seedData.push([evt.clientX, evt.clientY, +new Date]);
	    redfish64.seeder.showPoint(evt.clientX, evt.clientY);
	    redfish64.seeder.seedCount++;
	    redfish64.seeder.lastInputTime = new Date().getTime();
	}
    },

    showPoint: function (x, y) {
	var div = document.createElement("div");
	div.setAttribute("class", "seedpoint");
	div.style.top = y + "px";
	div.style.left = x + "px";
	document.body.appendChild(div);
	redfish64.seeder.seedPoints.push(div);
    },

    removePoints: function () {
	for (var i = 0; i < redfish64.seeder.seedPoints.length; i++) {
	    document.body.removeChild(redfish64.seeder.seedPoints[i]);
	}
	redfish64.seeder.seedPoints = [];
    },

    seedingOver: function () {
	redfish64.seeder.isStillSeeding = false;
	redfish64.seeder.removePoints();

	Math.seedrandom(seedData, { entropy: true });
    }
};
