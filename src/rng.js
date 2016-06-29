
var redfish64 = { };

//stolen from bitaddress.org TODO 2 give attrition


//the sjcl mouse collector is really weird. It will allow a non-moving static mouse to be considered
//as "random" movement
redfish64.seeder = {
    lastInputTime: new Date().getTime(),
    seedPoints: [],
    isStillSeeding: false,
 
    start: function() {
	if (window.addEventListener) {
	    window.addEventListener("mousemove", redfish64.seeder._seed, false);
	} else if (document.attachEvent) {
	    document.attachEvent("onmousemove", redfish64.seeder._seed);
	} else {
	    throw new sjcl.exception.bug("can't attach event");
	}
  //	console.log("stART!!");
    },

    onfinish: function(f) {
	redfish64.seeder.onfinish = f;
    },

    _seed: function (evt) {
	if(sjcl.random.isReady())
	{
	    redfish64.seeder.seedingOver();
	    return;
	}
	
	timeStamp = new Date().getTime();
	if (!evt) var evt = window.event;

	var x = evt.x || evt.clientX || evt.offsetX || 0;
	var y = evt.y || evt.clientY || evt.offsetY || 0;
	
	if (evt && (timeStamp - redfish64.seeder.lastInputTime) > 40)
	{
	    //console.log(x,y)
	    sjcl.random.addEntropy([x, y], 2, "mouse");
	    redfish64.seeder.showPoint(redfish64.seeder.lastX= x, redfish64.seeder.lastY=y);
	    redfish64.seeder.lastInputTime = timeStamp;
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
	if (window.removeEventListener) {
	    window.removeEventListener("mousemove", redfish64.seeder._seed, false);
	} else if (document.detachEvent) {
	    document.detachEvent("onmousemove", redfish64.seeder._seed);
	}
	redfish64.seeder.removePoints();
	redfish64.seeder.onfinish();
    }
};
