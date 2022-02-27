function drawDifficultyPlot() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;


    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var datacsv = d3.csv("answers.csv");

    datacsv.then( function(data) {
        let parseTime = d3.timeParse('%x');
        data.forEach( function(d) {
            d.date = parseTime(d.date);
        });
        
        xScale.domain(data.map(function(d) { return d.date; }));
        yScale.domain([0, 100 + d3.max(data, function(d) { return d.raritypercentile })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .tickValues(new Date(2021, 6, 19),
            new Date(2021, 7, 19),
            new Date(2021, 8, 19),
            new Date(2021, 9, 19),
            new Date(2021, 10, 19),
            new Date(2021, 11, 19),
            new Date(2021, 12, 19),
            new Date(2022, 1, 19),
            new Date(2022, 2, 19)
            ).tickFormat(function(d){
                return d;
            }));

        g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");
        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.date) })
        .y(function(d) { return yScale(d.raritypercentile) })
        )
        // Add the points
        svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.date) } )
        .attr("cy", function(d) { return yScale(d.raritypercentile) } )
        .attr("r", 5)
        .attr("fill", "#69b3a2")
    });
};

function drawBarGraph()  {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var selectoption = document.getElementById('lettercounttype');
    var yvariable = selectoption.value;

    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;


    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var datacsv = d3.csv("guessletterstats.csv");

    datacsv.then(function(data) {
        data.forEach(function(d) {
        d[yvariable] = parseInt(d[yvariable]);
        });

        xScale.domain(data.map(function(d) { return d.letter; }));
        yScale.domain([0, 100 + d3.max(data, function(d) { return d[yvariable] })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

        g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", '#a6a6f7')
        .attr("x", function(d) { return xScale(d.letter); })
        .attr("y", function(d) { return yScale(0); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(0); })
        
        g.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return yScale(d[yvariable]); })
        .attr("height", function(d) { return height - yScale(d[yvariable]); })
        .delay(function(d,i){console.log(i) ; return(i*100)})
    });

    var tooltip = d3.select("#lettercountgraph")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .text("I'm a circle!");

    d3.selectAll(".bar")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
};

function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr({
      fill: "orange",
      r: radius * 2
    });

    // Specify where to put label of text
    svg.append("text").attr({
       id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return xScale(d.x) - 30; },
        y: function() { return yScale(d.y) - 15; }
    })
    .text(function() {
      return [d.x, d.y];  // Value of the text
    });
}

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
      fill: "black",
      r: radius
    });

    // Select text by id and then remove
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}