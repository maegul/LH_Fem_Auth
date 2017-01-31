

function curv(c,r,t){
    return _.round(100 * Math.exp(0.5 * r * (t-2000)) / (2 * Math.exp(0.5 * r * (t-2000)) + c), 
    				1
				)
}




// Presumes data file is "data"
// Presumes lodash is loaded
function interpolate_years(data){
	
    var years = _.range(2002, 2030+1);


    for (var i = 0; i < data.length; i++) {
    	data[i]



        var p_years = _.map(data[i]['Points'], function(o){
        	return o['Y']
        });

        for (var j=0; j<years.length; j++) {


        	if (_.includes(p_years, years[j])) {

                // not interpolated
                _.filter(data[i]['Points'], function(o){
                	return o['Y'] == years[j]
                })[0]['intp'] = 0

    		}

            else {
                var r = data[i]['Curve']['r']
                var c = data[i]['Curve']['c']

                data[i]['Points'].push(
                    {Y: years[j], GR: curv(c, r, years[j]), intp: 1}
                )
            }
        }
    };
};