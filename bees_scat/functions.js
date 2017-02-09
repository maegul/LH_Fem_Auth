



function dispDatGen(data, disp){
    if (disp=='J') {
        var dat = _.filter(data, function(o){
            return  (o.Country == 'allCountries') &
                    (o.Journal != 'allJournals') & 
                    (o.Position == 'Overall')       
            });
    };

    if (disp=='D') {
        var dat = _.filter(data, function(o){
            return (o.Discipline != 'allDisciplines') & 
                    (o.Country == 'allCountries') &
                    (o.Journal == 'allJournals') & 
                    (o.Position == 'Overall')       
        })
    };

    if (disp=='C') {
        var dat = _.filter(data, function(o){
            return  (o.Discipline) == 'allDisciplines' &
                    (o.Country != 'allCountries') &
                    (o.Position == 'Overall')       
        });
    };

    if (disp=='P') {
        var dat = _.filter(data, function(o){
            return  (o.Discipline) == 'allDisciplines' &
                    (o.Country == 'allCountries')   
        });
    };


    return dat;
}


function curv(c,r,t, dec){
    return _.round(100 * Math.exp(0.5 * r * (t-2000)) / (2 * Math.exp(0.5 * r * (t-2000)) + c),
                    dec
				)
}



function ci_line_dat_gen(points){
    

    return _.map(points, function(p){
        return [
            {
                year: p['Y'],
                perc: p['lc']
            },

            {
                year: p['Y'],
                perc: p['uc']
            }
        ]
    })
}



function line_dat_gen(curv_dat, yr_max){


    var yrs = _.range(2000, yr_max, 1);

    return _.map(yrs, function(y){
        return {year: y, perc: curv(curv_dat['c'], curv_dat['r'], y, 3)}
    })




}

// Presumes data file is "data"
// Presumes lodash is loaded
function interpolate_years(data){

    // Adds interpolated data points to data
	
    var years = _.range(2002, 2030+1);


    for (var i = 0; i < data.length; i++) {
    	data[i]



        var p_years = _.map(data[i]['Points'], function(o){
        	return o['Y']
        });


        // mean sample n for interpolated data points
        var mean_n = _.mean(
                _.map(data[i]['Points'], function(p){
                    return p['n'];
                    }
                )
            )

        data[i]['mean_n'] = mean_n;


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
                    {Y: years[j], GR: curv(c, r, years[j], 1), intp: 1}
                )
            }
        }
    };
};



function n_range(data) {
    return d3.extent(
        _.flatten(
            _.map(data, function(d){
                return d3.extent(d['Points'], function(d){
                    return d['n'];
                    })
            
                    }
            )
        )
    )
}


function pnt_by_yr(dat, year, att){
    return _.filter(
        dat['Points'], 
        function(p){return p['Y'] == year;}
        )[0][att];

}

function tt_fill(d, tooltip){

    tooltip.style('visibility', 'visible');
    tooltip.append('p').classed('tt_main', true)
            .text(d['Discipline']);
    tooltip.append('p').classed('tt_perc', true)
            .text((pnt_by_yr(d, year, 'GR'))+'\% Female');


    if (pnt_by_yr(d, year, 'intp') == 0) {

        tooltip.append('p').classed('tt_n', true)
            .text(d3.format(',')(pnt_by_yr(d, year, 'n')) +' Papers');
        tooltip.append('p').classed('tt_nf', true)
            .text(d3.format(',')(pnt_by_yr(d, year, 'F')) + ' Female')
            .style('color', col_scale(85));
        tooltip.append('p').classed('tt_nm', true)
            .text(d3.format(',')(pnt_by_yr(d, year, 'M')) + ' Male')
            .style('color', col_scale(15));


    } else{
        tooltip.append('p').classed('tt_int', true)
            .text('Interpolated')
    };



}


function getSwarmDispDat() {

}