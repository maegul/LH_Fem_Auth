

//
// !! Some of the interpolated GR data is out of range? (beyond 100%)



// Display modes
	// disp variable

// Filters (+ highlight)

// Click to see deeper data

// Disp filters
	// Overall Disp
	// Filter of overall disp







var bckg = d3.select('#background');

// Beeswarm set up

var bee_swarm = d3.select("#plot"),
    margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = bee_swarm.attr("width") - margin.left - margin.right,
    height = bee_swarm.attr("height") - margin.top - margin.bottom;



var g_bee_swarm = bee_swarm.append("g")
    .attr("transform", 
    	"translate(" + margin.left + "," + margin.top + ")");



// Line set up
var line = d3.select('#line_plot'),
	margin_line = {top:40, right:140, bottom:40, left:140},
	width_line = line.attr('width') - margin_line.left-margin_line.right,
	height_line = line.attr('height') - margin_line.top - margin_line.bottom;

// To move line svg element across as needed
line.attr('x', width)

var g_line = line.append('g')
		.attr('transform',
			'translate('+margin_line.left+','+margin_line.top+')');






// For axis tick text percentage
var formatValue = d3.format(",d");

var perc_scale = d3.scaleLinear()
    				.rangeRound([0, height]);
 	perc_scale.domain([100, 0])

var col_scale = d3.scaleSequential(d3.interpolateRdYlBu)
					.domain([100, 0]);


// TO use a single hue sequential col scale

// function col_scale(v){
// 	var cs = d3.scaleSequential(d3.interpolateGnBu)
// 					.domain([0, 50])
// 	return cs(Math.abs(v-50))

// }

var radius = d3.scaleSqrt();


// For curve plotting.  Max year to which it goes

var year = 2016;

d3.select('#year_slider').attr('value', year);

var yr_max = 2045,
	yr_min = 2000;

var line_yr_scale = d3.scaleLinear()
						.range([0, width_line])
						.domain([yr_min, yr_max]); // may make flexible later




// Line plot Year Text elements

line.append('text')
	.text(''+yr_min)
	.attr('y', perc_scale(50))
	.attr('x', margin_line.left)
	.attr("font-family", "sans-serif")
	.attr("font-size", "20px")
	.attr('dy', '0em')
	.attr('font-weight', 900)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'end');

line.append('text')
	.text(''+yr_max)
	.attr('y', perc_scale(50))
	.attr('x', width_line + margin_line.left)
	.attr('dy', '0em')
	.attr("font-family", "sans-serif")
	.attr("font-size", "20px")
	.attr('font-weight', 900)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'start');


// Background percentage lines

var g_bckg = bckg.insert('g', 'svg')
				.attr('transform',
					'translate(0,'+margin.top+')');

g_bckg.insert('rect', 'svg')
	.attr('height', (perc_scale(37.5)-perc_scale(62.5)))
	.attr('width', bckg.attr('width'))
	.attr('y', perc_scale(62.5))
	.attr('fill', '#F6F4F8')

g_bckg.insert("line", 'svg')
	.attr("x1", 0)
	.attr("y1", perc_scale(50))
	.attr("x2", bckg.attr('width'))
	.attr("y2", perc_scale(50))
	.attr("stroke-width", 1)
	.attr("stroke", "#A3A0A6");



g_bckg.insert("line", 'svg')
	.attr("x1", 0)
	.attr("y1", perc_scale(25))
	.attr("x2", bckg.attr('width'))
	.attr("y2", perc_scale(25))
	.attr("stroke-width", 1)
	.attr("stroke", "#A3A0A6")
	.attr('d')

g_bckg.insert("line", 'svg')
	.attr("x1", 0)
	.attr("y1", perc_scale(75))
	.attr("x2", bckg.attr('width'))
	.attr("y2", perc_scale(75))
	.attr("stroke-width", 1)
	.attr("stroke", "#A3A0A6");

g_bckg.insert('text', 'svg')
	.text('50%')
	.attr('y', perc_scale(50))
	// .attr('x',)
	.attr('dy', '-0.5em')
	.attr("font-family", "sans-serif")
	.attr("font-size", "15px")
	// .attr('font-weight', 900)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'start');

g_bckg.insert('text', 'svg')
	.text('75% Male')
	.attr('y', perc_scale(25))
	// .attr('x',)
	.attr('dy', '-0.5em')
	.attr("font-family", "sans-serif")
	.attr("font-size", "15px")
	// .attr('font-weight', 900)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'start');

g_bckg.insert('text', 'svg')
	.text('75% Female')
	.attr('y', perc_scale(75))
	// .attr('x',)
	.attr('dy', '-0.5em')
	.attr("font-family", "sans-serif")
	.attr("font-size", "15px")
	// .attr('font-weight', 900)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'start');	


var year_text = bckg.insert('text', 'svg')
	.text(''+year)
	.attr('y', perc_scale(95))
	// .attr('x',)
	.attr('dy', '+1em')
	.attr("font-family", "sans-serif")
	.attr("font-size", "35px")
	.attr('font-weight', 700)
	.attr("fill", "#A3A0A6")
	// .attr('stroke', '#A3A0A6')
	.attr('text-anchor', 'start');


// Scat Plot Unique Colours

var border_plot_col_angles = [
0.0, 30, 124, 258, 280, 310 
];

var border_plot_col_count = 0;



var dispDatKey = {
	D: 'Discipline',
	J: 'Journal',
	C: 'Country',
	P: 'Position'
};


var dispOpts = ['J', 'D', 'C', 'P'];

var dispMode = 'D';


// ASYNC Data Function

d3.json('data_no_list_no_dup_disc.json', function(main_data){


	for (var i = 0; i < dispOpts.length; i++) {
		
		d3.select('#controls').append('div')
			.text(dispOpts[i])
			.style('cursor', 'pointer')
			.on('mouseover', function(){
				d3.select(this).style('color', 'red')
			})
			.on('mouseout', function(){
				d3.select(this).style('color', '')
			})
			.on('click', function(){
				g_bee_swarm.selectAll('*').remove();
				g_line.selectAll('*').remove();

				dat = dispDatGen(main_data, d3.select(this).text());
				dispMode = d3.select(this).text();

				console.log(dispMode)
				console.log(dat)

				disp()
			});

	};


	interpolate_years(main_data)
	// console.log(main_data)







	var dat = dispDatGen(main_data, dispMode);
	var dat_length = dat.length;


	console.log(dat);



	// Filt D: C, P
	// Filt J: D, C, P
	// Filt C: P, D
	// Filt P: C, D



	// radius.range([5, 20])

	var abs_max_rad = 23;
	var n_dep_max_rad = 0.5* (width / (dat.length* 0.1));

	if (n_dep_max_rad > abs_max_rad){
		radius.range([5, abs_max_rad]);
	}

	else {
		radius.range([5, n_dep_max_rad])
	}


	

	radius.domain(n_range(dat));


	// For generating curve and CI lines

	var scat_line = d3.line().curve(d3.curveBasis)
	    .x(function(d) { return parseFloat(line_yr_scale(d['year'])); })
	    .y(function(d) { return parseFloat(perc_scale(d['perc'])); });

    var scat_ci_line = d3.line()
    	.x(function(d){return line_yr_scale(d['year'])})
    	.y(function(d){return perc_scale(d['perc'])})








	function tick(){
		// console.log(simulation.alpha());
		d3.selectAll('.pnt')
			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return d.y})
	}





	// Tool TIp set up
	var tooltip = d3.select('body')
		.append('div')
		.classed('tooltip', true)
		.style('position', 'absolute')
		.style('visibility', 'hidden')
		.style('white-space', 'pre')
		.style('font-family', 'sans-serif');


	disp();

	function disp(){ //in: dat, g_swarm, g_line; out: sim, pnt


		// disp
		var simulation = d3.forceSimulation(dat)
			.force("x", d3.forceX(width/2).strength(0.07))
			.force("y", d3.forceY(function(d){
				return perc_scale(
					pnt_by_yr(d, year, 'GR')
					)
				}).strength(0.99)
			)
			.force("collide", 
				d3.forceCollide(function(d){
					if(pnt_by_yr(d, year, 'intp')==0){
						return radius(
							pnt_by_yr(d, year, 'n')
								)
							}
					else {
						return radius(
							d['mean_n']
								)

						}

					}
				))
			// .alphaTarget(0.2)
			.velocityDecay(0.45)
			.alphaDecay(0.011)
			.on('tick', tick);
			// .stop();


		// disp

		var pnt = g_bee_swarm.selectAll('.pnt')
					.data(dat, function(d){return d[getDispDat()];})// dispDat

		// disp
		pnt.enter().append('circle').classed('pnt', true)
			.attr('r', function(d){
					if(pnt_by_yr(d, year, 'intp')==0){
						return radius(
							pnt_by_yr(d, year, 'n')
								)
							}
					else {
						return radius(
							d['mean_n']
								)

						}
				})
			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return height/2})
			.style('stroke-dasharray', function(d){

				if(pnt_by_yr(d, year, 'intp')==1){
					return '3 1';
						}
			})

			.style('fill', function(d){
				return col_scale(pnt_by_yr(d, year, 'GR'))
			})
			.on('mouseover', function(d){

				//Tool-Tip

				d3.select(this).style('stroke-width', '3px');

				tt_fill(d, tooltip);

				if(d3.select(this).attr('value')=='clicked'){
					g_line.selectAll('.scat_plot')
						.filter(function(od){return od[getDispDat()]!=d[getDispDat()]}) //dispDat
						.style('opacity', '0.2');

					d3.selectAll('.pnt')
						.style('opacity', '0.6');
					d3.select(this)
						.style('opacity', '');			

				}


			})
			.on('mousemove', function(){
		        tooltip
	                .style('top', (d3.event.pageY-150)+'px')
	                .style('left', (d3.event.pageX+5)+'px');

			})
			.on('mouseout', function(d){

				

				if (d3.select(this).attr('value') != 'clicked'){

					d3.select(this).style('stroke-width', '1px');

				}

				else {

					g_line.selectAll('.scat_plot')
						.style('opacity', '');

					d3.selectAll('.pnt')
						.style('opacity', '');
				}

				tooltip.style('visibility', 'hidden');
				tooltip.selectAll('*').remove();
			})
			.on('click', function(d){


				if (d3.select(this).attr('value')=='clicked') {


					d3.select(this).attr('value', 'not_clicked');
					d3.select(this)
						.style('stroke-width', '')
						.style('stroke', '');

					g_line.selectAll('.scat_plot')
						.filter(function(od){return od[getDispDat()]==d[getDispDat()]}) //dispDat
						.remove();

					g_line.selectAll('.scat_plot')
						.style('opacity', '');

					d3.selectAll('.pnt')
						.style('opacity', '');

					border_plot_col_count -= 1


				} 

				else { //ie if not clicked

					var uniq_hue = border_plot_col_angles[(border_plot_col_count % border_plot_col_angles.length)];
					border_plot_col_count += 1;


					// var uniq_hue = _.random(0, 310);

					var uniq_cols = {			// H, Sat, Light
						line: hsluv.hsluvToHex([uniq_hue, 90, 50]),
						border: hsluv.hsluvToHex([uniq_hue, 90, 40]),
						null_fill: hsluv.hsluvToHex([uniq_hue, 20, 90])
					};

					
					d3.select(this).attr('value', 'clicked');
					d3.select(this)
						.style('stroke-width', '3px')
						.style('stroke', uniq_cols.border);

		      		var scat_plot = g_line.append('g')
		      				.classed('scat_plot', true)
		      				.datum(d);

		      		

					var point_dat = _.filter(d['Points'], 
											function(o){return o['intp']==0}
											)
					var line_dat = line_dat_gen(d['Curve'], yr_max);

					// Con Interval error bars - line generator
					var scat_ci = scat_plot.selectAll('.scat_ci')
								.data(ci_line_dat_gen(point_dat),
								 	function(p){return p['Y']}
								 	);

					scat_ci.enter().append('path').classed('scat_ci', true)
						.attr("fill", "none")
						.attr("stroke", "#565556FF")
						.attr("stroke-linejoin", "round")
						.attr('stroke-miterlimit', 2)
						.attr("stroke-linecap", "round")
						.attr("stroke-width", 1.5)
						.attr('d', scat_ci_line)
						



					var scat = scat_plot.selectAll('.scat')
								.data(point_dat,
								 	function(p){return p['Y']}
								 	);

					scat.enter().append('circle').classed('scat', true)
						.attr('data-swarmDisp', d[getDispDat()]+'') //dispDat
						.attr('r', function(d){
							return radius(d['n'])})
						.attr('cx', function(d){
							return line_yr_scale(d['Y']);
						})
						.attr('cy', function(d){
							return perc_scale(d['GR'])
						})
						.style('fill', '#E1DFE3')
						.style('stroke', uniq_cols.border)
						.on('mouseover', function(d){

							d3.select(this.parentNode).raise();

							swarmAtt = d3.select(this).attr('data-swarmDisp'); //dispDat

							d3.selectAll('.pnt').filter(function(p){
								return p[getDispDat()] != swarmAtt;
							}).style('fill', '#E1DFE3')
							.style('opacity', '0.6');

							var swarm_point = d3.selectAll('.pnt').filter(function(p){
											return p[getDispDat()] == swarmAtt; //dispDat
									})


							tt_fill(
								swarm_point.datum(),
								tooltip
								);

							g_line.selectAll('.scat_plot')
								.filter(function(od){return od[getDispDat()]!=swarmAtt}) //dispDat
								.style('opacity', '0.2');					

					        tooltip
				                .style('top', (d3.event.pageY-150)+'px')
				                .style('left', (d3.event.pageX+5)+'px');
						})
						.on('mouseout', function(d){
							d3.selectAll('.pnt')
								.style('fill', function(d){
									return col_scale(pnt_by_yr(d, year, 'GR'))
								})
								.style('opacity', '');

							g_line.selectAll('.scat_plot')
								.filter(function(od){return od[getDispDat()]!=swarmAtt}) //dispDat
								.style('opacity', '');					


							tooltip.style('visibility', 'hidden');
							tooltip.selectAll('*').remove();


						});

					var current_point = scat_plot.selectAll('.scat')
										.filter(function(d){return d['Y'] == year});


					if (current_point.size() == 1) {
						scat_plot.selectAll('.scat').filter(function(d){return d['Y'] == year})
							.raise()
							.style('stroke-width', '3px')
							.style('fill', 
								col_scale(scat_plot.selectAll('.scat').filter(function(d){return d['Y'] == year})
									.datum()['GR'])
								);
					}

					else {


						scat_plot.append('circle').classed('scat_inter', true)
							.attr('r', radius(d['mean_n']))
							.attr('cy', perc_scale(_.filter(line_dat, function(o){
								return o['year'] == year;
							})[0]['perc']))
							.attr('cx', line_yr_scale(year))
							.attr('stroke-width', 3)
							.attr('stroke', 'black')
							.style('stroke-dasharray', '3 1')
							.style('fill-opacity', '0');
					};


					scat_plot.append("path").classed('scat_line', true)
						.datum(line_dat)
						.attr('data-swarmDisp', d[getDispDat()]+'') //dispDat
						.attr("fill", "none")
						.attr("stroke", uniq_cols.line)
						.attr("stroke-linejoin", "round")
						.attr('stroke-miterlimit', 2)
						.attr("stroke-linecap", "round")
						.attr("stroke-width", 4)
						.style('stroke-dasharray', '4 6')
						.attr("d", scat_line)
						.style('opacity', '0.65')
						.raise()
						.on('mouseover', function(d){

							d3.select(this.parentNode).raise();

							swarmAtt = d3.select(this).attr('data-swarmDisp'); //dispDat
							d3.selectAll('.pnt').filter(function(p){
								return p[getDispDat()] != swarmAtt; //dispDat
							}).style('fill', '#E1DFE3')
							.style('opacity', '0.6');

							var swarm_point = d3.selectAll('.pnt').filter(function(p){
											return p[getDispDat()] == swarmAtt; //dispDat
									})

							g_line.selectAll('.scat_plot')
								.filter(function(od){return od[getDispDat()]!=swarmAtt}) //dispDat
								.style('opacity', '0.2');						

							tt_fill(
								swarm_point.datum(),
								tooltip
								);

					        tooltip
				                .style('top', (d3.event.pageY-150)+'px')
				                .style('left', (d3.event.pageX+5)+'px');
						})
						.on('mouseout', function(d){
							d3.selectAll('.pnt')
								.style('fill', function(d){
									return col_scale(pnt_by_yr(d, year, 'GR'))
								})
								.style('opacity', '');

							g_line.selectAll('.scat_plot')
								.filter(function(od){return od[getDispDat()]!=swarmAtt}) //dispDat
								.style('opacity', '');							

							tooltip.style('visibility', 'hidden');
							tooltip.selectAll('*').remove();
						});



				} // end else "not clicked"




			})

		// Year Slider

		d3.select('#year_slider').on("input", function(){

			year = parseInt(this.value);

			year_text.text(year);


		d3.selectAll('.scat_inter').remove();

		d3.selectAll('.scat_plot').each(function(d){


			var this_scat = d3.select(this);

			var current_point = this_scat.selectAll('.scat').filter(function(d){return d['Y'] == year});

			if (current_point.size() == 1){

				this_scat.selectAll('.scat')
					.sort(function(a, b) {
					  return a['Y'] < b['Y'] ? -1 : a['Y'] > b['Y'] ? 1 : a['Y'] >= b['Y'] ? 0 : NaN;
					})
					.style('fill', '#E1DFE3')
					.style('stroke-width', 'initial');

				current_point
					.raise()
					.style('stroke-width', '3px')
					.style('fill', 
					col_scale(current_point.datum()['GR'])
					);

				this_scat.selectAll('.scat_line').raise();
			} 
			else {

				this_scat.selectAll('.scat')
					.style('fill', '#E1DFE3')
					.style('stroke-width', 1);
				interp_dat = this_scat.selectAll('.scat_line').datum();



				this_scat.append('circle').classed('scat_inter', true)
					.attr('r', radius(d['mean_n']))
					.attr('cy', perc_scale(_.filter(interp_dat, function(o){
						return o['year'] == year;
					})[0]['perc']))
					.attr('cx', line_yr_scale(year))
					.attr('stroke-width', 3)
					.attr('stroke', 'black')
					.style('stroke-dasharray', '3 1')
					.style('fill-opacity', '0');
			};


		});

			d3.selectAll('.pnt')
				.attr('r', function(d){
					if(pnt_by_yr(d, year, 'intp')==0){
						return radius(
							pnt_by_yr(d, year, 'n')
								)
							}
					else {
						return radius(
							d['mean_n']
								)

						}
					}
				)
				.style('stroke-dasharray', function(d){

					if(pnt_by_yr(d, year, 'intp')==1){
						return '3 1';
							}
					else {
						return 'initial';

						}

					}
				)
				.style('stroke-dashoffset', function(d){

					if(pnt_by_yr(d, year, 'intp')==1){
						return '3';
							}
					else {
						return 'initial';

						}

					}
				)
				.style('fill', function(d){
						return col_scale(pnt_by_yr(d, year, 'GR'))
						}
				)
				// .style('opacity', function(d){
				// 		if(pnt_by_yr(d, year, 'intp')==0){
				// 			return 0.6
				// 				}
				// 		else {
				// 			return 0.4;

				// 		}
				// 		}

				// )


			simulation.force("y", 
				d3.forceY(function(d){
					return perc_scale(
						pnt_by_yr(d, year, 'GR')
						)
				}).strength(0.99)
			)
			.force("collide", 
				d3.forceCollide(function(d){

					if(pnt_by_yr(d, year, 'intp')==0){
						return radius(
							pnt_by_yr(d, year, 'n')
								)
							}
					else {
						return radius(
							d['mean_n']
								)


					}
					}
			))
			.force('repulsion', d3.forceManyBody().strength(-15 * Math.sqrt((100 / dat_length))))


			simulation.alpha(0.03)
						.restart();

			setTimeout(function(){
				simulation.force('repulsion', d3.forceManyBody().strength(0))
			}, 700)

			setTimeout(function(){
				simulation.alpha(0.04).restart();
			}, 1300)


		})



	}
















// End file callback
}
)