(function(window){

    'use strict';
    function define_align(){
        var Align = {};
        Align.create_box = function(g,p)
	{
	    var g = g;

	    var box = {};
	    
	    if(p.w == null && p.h == null)
	    {
		var bbox = p.o.getBBox();
		box.w = bbox.w;
		box.h = bbox.h;
	    }
	    else if (p.w == null)
	    {
		//console.log(p);
		var bbox = p.o.getBBox();
		box.w = bbox.w;
		box.h = p.h;
	    }
	    else if (p.h == null)
	    {
		var bbox = p.o.getBBox();
		box.h = bbox.h;
		box.w = p.w;
	    }
	    else
	    {
		box.w = p.w;
		box.h = p.h;
	    }

	    box.o = p.o;

	    box.transform_to_box = 
		function(p)
	    {
		var group;

		//if not an empty box
		if(box.o)
		{
		    var scale=1;
		    if(p.w != null && p.h != null)
		    {
			scale = Math.min(p.w/box.w,p.h/box.h);
		    }
		    else if(p.h != null)
		    {
			scale = p.h/box.h;
		    }
		    else if(p.w != null)
		    {
			scale = p.w/box.w;
		    }
		    
		    var transX = p.x || 0;	
		    var transY = p.y || 0;
		    
		    //since the element may have already been transformed, we need to use a group
		    //and add the element to it. Otherwise, the original transformation is reset
		    group = g.g(box.o);

		    //console.log("x %f y %f s %f",transX, transY, scale);
		    //console.log(box,p);
		    
		    group.transform(new Snap.matrix().translate(transX,transY).
				    scale(scale));
		}
		    
		return Align.create_box(g,{ o: group,
					    x: transX,
					    y: transY,
					    w: box.w,
					    h: box.h});
	    }
	    
	    return box;
        }

	Align.valign = function()
	{
	    var g = arguments[0];

	    var max_width = 0;
	    for(var i = 1; i < arguments.length; i++)
	    {
		if(arguments[i].w > max_width)
		    max_width = arguments[i].w;
	    }

	    var curr_y = 0;

	    var group = g.g();

	    for(var i = 1; i < arguments.length; i++)
	    {
		var box = arguments[i];
		//console.log(box);
		var box = box.transform_to_box(box.w/2 - max_width/2,curr_y);
		curr_y += box.h;
		if(box.o)
		    group.add(box.o);
	    }

	    return Align.create_box(g, { o: group, w: max_width, h: curr_y });
	}
	
	Align.halign = function()
	{
	    var g = arguments[0];

	    var max_height = 0;
	    console.log(arguments);
	    for(var i = 1; i < arguments.length; i++)
	    {
		if(arguments[i].h > max_height)
		    max_height = arguments[i].h;
	    }

	    var curr_x = 0;

	    var group = g.g();
	    
	    for(var i = 1; i < arguments.length; i++)
	    {
		var box = arguments[i];
		var box = arguments[i].transform_to_box(curr_x,box.h/2 - max_height/2);
		curr_x += box.h;
		if(box.o)
		    group.add(box.o);
	    }

	    return Align.create_box(g, { o: group, w: curr_x, y: max_height });
	}
	

        return Align;
    }

    //define globally if it doesn't already exist
    if(typeof(Align) === 'undefined'){
        window.Align = define_align();
    }
    else{
        console.log("Align already defined.");
    }
})(window);
