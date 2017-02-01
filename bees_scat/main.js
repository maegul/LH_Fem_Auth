

//
// !! Some of the interpolated GR data is out of range? (beyond 100%)


// Click to see deeper data

// Disp filters
	// Overall Disp
	// Filter of overall disp

// select discipline to open journals underneath

// Have journls with same line plot (layout?!)

// start thinking about data constructor functions


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
	margin_line = {top:40, right:40, bottom:40, left:40},
	width_line = line.attr('width') - margin_line.left-margin_line.right,
	height_line = line.attr('height') - margin_line.top - margin_line.bottom;

var g_line = line.append('g')
		.attr('transform',
			'translate('+margin.left+','+margin.top+')');






// For axis tick text percentage
var formatValue = d3.format(",d");

var perc_scale = d3.scaleLinear()
    				.rangeRound([0, height]);

var col_scale = d3.scaleSequential(d3.interpolateRdYlBu)
					.domain([0, 100]);

var radius = d3.scaleSqrt()
          .range([5, 22]);


// For curve plotting.  Max year to which it goes
var yr_max = 2045

var line_yr_scale = d3.scaleLinear()
						.range([0, width_line])
						.domain([2000, yr_max]); // may make flexible later


g_line.append('g')
		.classed('axis x', true)
		.attr('transform', 'translate(0,'+height_line+')')
		.call(d3.axisBottom(line_yr_scale).ticks(10, d3.format('.4')))
		.selectAll("text")
			.attr("y", 0)
			.attr("x", 0)
			.attr("dy", "1em")
			.attr('dx', '0.7em')
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start");


d3.json('data_no_list_no_dup_disc.json', function(main_data){



	interpolate_years(main_data)
	console.log(main_data)


	// Core Variables

	perc_scale.domain([100, 0])

	var year = 2016;

	// For proto - display Discipline, Overall, allCountry




	var dat = _.filter(main_data, function(o){
		return (o.Discipline != 'allDisciplines') & 
				(o.Country == 'allCountries') &
				(o.Journal == 'allJournals') & 
				(o.Position == 'Overall')		
	});

	console.log(

		_.filter(main_data, function(o){
				return (o.Discipline == 'AIDS') & 
						// (o.Country == 'United Kingdom') &
						(o.Journal != 'allJournals') & 
						(o.Position == 'Overall')		
			})


		)


	radius.domain(n_range(dat));



	var simulation = d3.forceSimulation(dat)
		.force("x", d3.forceX(width/2).strength(0.075))
		.force("y", d3.forceY(function(d){
			return perc_scale(
				pnt_by_yr(d, year, 'GR')
				)
			}).strength(0.9)
		)
		.force("collide", 
			d3.forceCollide(function(d){
				return radius(
					pnt_by_yr(d, year, 'n')
						)
					}
				))
		// .alphaTarget(0.2)
		.alphaDecay(0.011)
		.on('tick', tick);
		// .stop();


	function tick(){
		// console.log(simulation.alpha());
		d3.selectAll('.pnt')


			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return d.y})


	}


	var pnt = g_bee_swarm.selectAll('.pnt')
				.data(dat, function(d){return d['Discipline'];})


	var scat_line = d3.line().curve(d3.curveBasis)
	    .x(function(d) { return parseFloat(line_yr_scale(d['year'])); })
	    .y(function(d) { return parseFloat(perc_scale(d['perc'])); });

    var scat_ci_line = d3.line()
    	.x(function(d){return line_yr_scale(d['year'])})
    	.y(function(d){return perc_scale(d['perc'])})



	pnt.enter().append('circle').classed('pnt', true)
		.attr('r', function(d){
			return radius(pnt_by_yr(d, year, 'n'))})
		.attr('cx', function(d){return d.x})
		.attr('cy', function(d){return height/2})
		.style('fill', function(d){
			return col_scale(pnt_by_yr(d, year, 'GR'))
		})
		.on('mouseover', function(d){

			console.log(
					_.filter(main_data, function(md){
						return (md['Discipline'] == d['Discipline']) &
						(md['Discipline'] != 'allJournals')
					}).map(function(md){return md['Journal']})
					)

			var point_dat = _.filter(d['Points'], 
									function(o){return o['intp']==0}
									)

			var scat_ci = g_line.selectAll('.scat_ci')
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
				



			var scat = g_line.selectAll('.scat')
						.data(point_dat,
						 	function(p){return p['Y']}
						 	);

			scat.enter().append('circle').classed('scat', true)
				.attr('r', 5)
				.attr('cx', function(d){
					return line_yr_scale(d['Y']);
				})
				.attr('cy', function(d){
					return perc_scale(d['GR'])
				})
				.style('fill', function(d){
					return col_scale(d['GR'])
				})


			g_line.append("path").classed('scat_line', true)
				.datum(line_dat_gen(d['Curve'], yr_max))
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-linejoin", "round")
				.attr('stroke-miterlimit', 2)
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 3)
				.attr("d", scat_line);


		})
		.on('mouseout', function(d){
			d3.selectAll('.scat').remove();

			d3.selectAll('.scat_line').remove();
			d3.selectAll('.scat_ci').remove();
		})



	d3.select('#year_slider').on("input", function(){

		year = parseInt(this.value);

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
			}).strength(0.9)
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


		simulation.alpha(0.07)
					.restart();


	})


	// .on('mouseover', function(d){
	// var perc = d[year]['prop_'+auth_pos];
	// var num = d[year]['ntot_'+auth_pos];

	// tooltip.style('visibility', 'visible')
	//               .text(d.discipline+'\n'+d3.format(".0%")(perc)+'\n' + d3.format(',')(num) +' papers');
	// d3.select(this)
	//     .style('opacity', 1);
	// })
	// .on('mousemove', function() {
	// return tooltip
	//         .style('top', (d3.event.pageY-80)+'px')
	//         .style('left', (d3.event.pageX-35)+'px');


	// })
	// .on('mouseout', function(){
	// tooltip.style('visibility', 'hidden');
	// d3.select(this)
	//     .style('opacity', 0.6);

	// })
	// .on('click', function(p){
	// if (d3.select(this).attr('val') != 1) {
	//   d3.select(this).style('fill', 'red').attr('val', 1)

	//   var disc_sel_vals = $('.disc_sel').val();
	//   disc_sel_vals.push(p.discipline);
	//   $('.disc_sel').val(disc_sel_vals).trigger("change");
	// }

	// else {
	//   d3.select(this).style('fill', '#ad3d8f').attr('val', 0)

	//   var disc_sel_vals = $('.disc_sel').val();

	//   _.remove(disc_sel_vals, function(d){
	//     return d == p.discipline;
	//   })




	// }
	// })




// End file callback
}
)