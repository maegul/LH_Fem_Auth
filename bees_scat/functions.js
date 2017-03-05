






function dispDatGen(data, disp){
    if (disp=='J') {
        var dat = _.filter(data, function(o){
            return  (o.Country == 'allCountries') &
                    (o.Journal != 'allJournals') & 
                    (o.Position == 'Overall') &
                    (o.Discipline == 'Neurology') // just for demo, will need to filter by Disc       
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


function dispDatGenFilt(data, disp){
    if (disp=='J') {
        var dat = _.filter(data, function(o){
            return (o.Journal != 'allJournals') 
            });
    };

    if (disp=='D') {
        var dat = _.filter(data, function(o){
            return (o.Discipline != 'allDisciplines') & 
                    (o.Journal == 'allJournals')
        })
    };

    if (disp=='C') {
        var dat = _.filter(data, function(o){
            return   (o.Country != 'allCountries') &
                        (o.Journal == 'allJournals')     
        });
    };

    if (disp=='P') {
        var dat = _.filter(data, function(o){
            return  (o.Journal == 'allJournals')
                    // & (o.Position != 'Overall')  
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


    var yrs = _.range(2000, (yr_max+1), 1);

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


function nestDatGen(data){
    dat = dispDatGenFilt(data, dispMode)

    if (dispMode == 'J') {
        var journDiscIdx = d3.nest()
            .key(function(d) {return d.Journal})
            .key(function(d) {return d.Discipline})
            .map(dat);

    }

    var nestDatInit = d3.nest()
                    .key(function(d) { return d[dispDatKey[dispMode]]})
                    .key(function(d) { return d[dispFiltKey[dispMode][0]]})
                    .key(function(d) { return d[dispFiltKey[dispMode][1]]})
                    // .rollup(function(d){
                    //  return {
                    //      Points: d.Points,
                    //      Curve: d.Curve,
                    //      mean_n: d.mean_n
                    //  }
                    // })
                    .object(dat)


    // Avoid key, value structure at top
    var nestDat = d3.keys(nestDatInit).map(function(d){ 
                    var ndat = {};
                    ndat['nDat'] = nestDatInit[d]; // nDat = nested data
                    ndat[dispDatKey[dispMode]] = d; // disp mode coded in as key id

                    if (dispMode=='J'){
                        ndat['Discipline'] = journDiscIdx.get(d).keys()[0];
                    }
                    return ndat;
        })

    return nestDat;


}





// function n_range(data) {
//     return d3.extent(
//         _.flatten(
//             _.map(data, function(d){
//                 return d3.extent(d['Points'], function(d){
//                             return d['n'];
//                         })
            
//                     }
//             )
//         )
//     )
// }


function n_range(data) {

    // var filtParam1 = filtParams[dispFiltKey[dispMode][0]]

    // var filtParam2 = filtParams[dispFiltKey[dispMode][1]]


    return d3.extent(
        _.flatten(_.map(data, function(d){
                    return _.map(
                                _.get(d, ['nDat', filtParam1, filtParam2, 0, 'Points'], undefined),
                                function(o){return o['n']}
                            )
                        })
                    )
            )

}



function n_range_proto(data) {
    // console.log('inner n_range_proto')
    // console.log(filtParam1)
    // console.log(filtParam2)
    // console.log(data)

            return d3.extent(
            _.flatten(
            _.map(data, function(dob){
            return _.map(
                _.get(dob, ['nDat', filtParam1, filtParam2, 0, 'Points'], undefined),
                function(o){return o['n']}
                )
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


function getPntDat(dat, year, att){

    // filt conditional on dispMode

    // var filtParam1 = filtParams[dispFiltKey[dispMode][0]]

    // var filtParam2 = filtParams[dispFiltKey[dispMode][1]]

    // pnt_by_yr(_.get(dat, ['nDat', filtParam1, filtParam2, 0], undefined), year, att)
    
    return _.filter(
                _.get(dat, ['nDat', filtParam1, filtParam2, 0, 'Points'], undefined),
                    function(o){return o['Y'] == year} 
            )[0][att]

    // Use below 
    // How deal with undefined for data points ... if statement and fade in .attr()?

    // _.get(d, ['nDat', filtParam1, filtParam2, 0], undefined)    


}

function tt_fill(d, tooltip){

    tooltip.style('visibility', 'visible');
    tooltip.append('p').classed('tt_main', true)
            .text(d[getDispDat()]);
    tooltip.append('p').classed('tt_perc', true)
            .text((getPntDat(d, year, 'GR'))+'\% Female');


    if (getPntDat(d, year, 'intp') == 0) {

        tooltip.append('p').classed('tt_n', true)
            .text(d3.format(',')(getPntDat(d, year, 'n')) +' Papers');
        tooltip.append('p').classed('tt_nf', true)
            .text(d3.format(',')(getPntDat(d, year, 'F')) + ' Female')
            .style('color', col_scale(85));
        tooltip.append('p').classed('tt_nm', true)
            .text(d3.format(',')(getPntDat(d, year, 'M')) + ' Male')
            .style('color', col_scale(15));


    } else{
        tooltip.append('p').classed('tt_int', true)
            .text('Interpolated')
    };



}


function getDispDat() {
    return dispDatKey[dispMode];

}

function hasDat(dat) {
    return _.has(dat, ['nDat', filtParam1, filtParam2])
}


function uniqColsGen(uniq_hue){
    var uniq_cols = {           // H, Sat, Light
        line: hsluv.hsluvToHex([uniq_hue, col_params.line.sat, col_params.line.light]),
        border: hsluv.hsluvToHex([uniq_hue, col_params.border.sat, col_params.border.light]),
        null_fill: hsluv.hsluvToHex([uniq_hue, col_params.null_fill.sat, col_params.null_fill.light])
    };

    return uniq_cols;
}


// function getDatActive(dat){

//     return _.filter(dat, function(o){
//         return _.has(o, ['nDat', filtParam1, filtParam2])
//     });

//     // return _.filter(dat, function(o){
//     //     return _.has(o, ['nDat', 'Japan', filtParam2])
//     // });


// }

//////
// FOr filtering
//////



function checkInActive(current, active){

    // if in active
    if (_.findIndex(active, function(ac){
        return ac == current; // current count not in active
            })==-1) {
        return true; // ie, current not active, so true for disabled
    }
    else {
        return false;
    }           

}

function checkSelected(current, filt){
    if (current == filtParams[filt]){
        return true;
    }
    else {
        return false;
    }
}




function getDatActive(dat, f1, f2){

    return _.filter(dat, function(o){
        return _.has(o, ['nDat', f1, f2])
    });

    // return _.filter(dat, function(o){
    //     return _.has(o, ['nDat', 'Japan', filtParam2])
    // });


}

function getActiveFiltOneOpts(dat, all_uniq){
    return _.filter(all_uniq, function(au){
                var optDat = getDatActive(dat, au, filtParam2);
                return optDat.length > 0;
            })

}

function getActiveFiltTwoOpts(dat, all_uniq){
    return _.filter(all_uniq, function(au){
                var optDat = getDatActive(dat, filtParam1, au);
                return optDat.length > 0;
            })

}


function getFiltOneOpts(dat){

    return _.uniq(
                _.flatten(
                        _.map(getDatActive(dat, filtParam1, filtParam2), function(o){
                            return _.keys(o['nDat'])
                            })
                        )
                )
            
}


function getFiltTwoOpts(dat){

    return _.uniq(
                _.flattenDeep(
                        _.map(getDatActive(dat, filtParam1, filtParam2), function(o){

                            return _.map(_.keys(o['nDat']), function(k){
                                return _.keys(o['nDat'][k]);
                                    })

                            })
                        )
                )

}



function getCountFiltOpts(dat){

    // var datActive = _.filter(dat, function(o){
    //     return _.has(o, ['nDat', 'Iran', 'Last'])
    // });

    // return datActive;



    return _.uniq(
                _.flatten(
                        _.map(getDatActive(dat, filtParam1, filtParam2), function(o){
                            return _.keys(o['nDat'])
                            })
                        )
                )
            
}


function getPosFiltOpts(dat){

    return _.uniq(
                _.flattenDeep(
                        _.map(getDatActive(dat, filtParam1, filtParam2), function(o){

                            // var keys = _.keys(o['nDat']);

                            return _.map(_.keys(o['nDat']), function(k){
                                return _.keys(o['nDat'][k]);
                                    })

                            })
                        )
                )


}



function getDispOpts(dat){
    return _.map(
                getDatActive(dat, filtParam1, filtParam2), 
                function(d){
                    return d[dispDatKey[dispMode]];
                }

        )
}



