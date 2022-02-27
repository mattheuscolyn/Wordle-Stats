function drawGraph()  {
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
}