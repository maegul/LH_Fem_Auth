

//

// Vertical Beeswarm for Disciplines with Overall-allCount
// With interpolated data into the future

// Get adjacent line plot

// select discipline to open journals underneath

// Have journls with same line plot (layout?!)

// start thinking about data constructor functions



var svg = d3.select("#plot"),
    margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;


// For axis tick text percentage
var formatValue = d3.format(",d");

var perc_scale = d3.scaleLinear()
    .rangeRound([0, height]);

var radius = d3.scaleSqrt()
          .range([5, 22]);

var g = svg.append("g")
    .attr("transform", 
    	"translate(" + margin.left + "," + margin.top + ")");



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


	radius.domain(n_range(dat));

	console.log(
			pnt_by_yr(dat[0], year, 'Y')

		)


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
		.attr('r', function(d){
				if(pnt_by_yr(d, year, 'intp')==0){
					return radius(
						pnt_by_yr(d, year, 'n')
							)
						}
				else {
					return radius(
						pnt_by_yr(d, 2002, 'n')
							)

				}
				}
			)

		.attr('cx', function(d){return d.x})
		.attr('cy', function(d){return d.y})
		.style('opacity', function(d){
				if(pnt_by_yr(d, year, 'intp')==0){
					return 0.6
						}
				else {
					return 0.4;

				}
				}

		)

	}


	var pnt = g.selectAll('.pnt').data(dat, function(d){return d['Discipline'];})


	pnt.enter().append('circle').classed('pnt', true)
		.attr('r', function(d){
			return radius(pnt_by_yr(d, year, 'n'))})
		.attr('cx', function(d){return d.x})
		.attr('cy', function(d){return height/2})



	d3.select('#year_slider').on("input", function(){

		year = parseInt(this.value);

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
						pnt_by_yr(d, 2002, 'n')
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