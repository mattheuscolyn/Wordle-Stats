function drawPlot() {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
 
  var parseTime = d3.timeParse("%d-%b-%y");
  var formatTime = d3.timeFormat("%B %e, %Y");

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.raritypercentile); });

  d3.select("svg").selectAll('*').remove()

  var svg = d3.select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
  var xvar = 'placeholder'
  var raritytype = document.getElementById('raritytype').value
  if (raritytype == 'summative') {
    xvar = 'summativeraritypercentile'
  } else {
    xvar = 'positionalraritypercentile'
  }
  console.log(xvar)

  d3.csv("answers.csv").then(function(data) {
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d[xvar] = +d[xvar];
    });

    console.log(data.date)
  
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d[xvar]; })]);

    var dots = svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 5)
      .style('fill', '#a6a6f7')
      .style('opacity', 0)

    svg.selectAll("circle")
      .transition()
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d[xvar]); })
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .style('opacity', 1)
    
    dots.on("mouseover", function(event,d) {
        d3.select(this)
          .style('fill', '#551a8b')
          .attr("r", 7)
        d3.select('div.tooltip')
          .transition()
          .duration(200)
          .style("opacity", .9);
        d3.select('div.tooltip')
          .html(formatTime(d.date) + "<br/>" + d.word + ', ' + d[xvar])
          .style("font-size", '10pt');
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .style('fill', '#a6a6f7')
          .attr("r", 5)
        d3.select('div.tooltip')
          .transition()
          .duration(500)
          .style("opacity", 0);
        });
  
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));
  
    svg.append("g")
       .call(d3.axisLeft(y));
  });
}

function drawGraph()  {
    var selectoption = document.getElementById('lettercounttype');
    var yvariable = selectoption.value;

    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    
    svg.selectAll("*").remove()


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
        .on("mouseover", function(event,d) {
            d3.select(this)
              .style('fill', '#551a8b')
              .attr("r", 7)
            d3.select('div.tooltip')
              .transition()
              .duration(200)
              .style("opacity", .9);
            d3.select('div.tooltip')
              .html(d.letter.toUpperCase() + " appears " + d[yvariable] + " times.")
              .style("font-size", '10pt');
            })
        .on("mouseout", function(d) {
            d3.select(this)
              .style('fill', '#a6a6f7')
              .attr("r", 5)
            d3.select('div.tooltip')
              .transition()
              .duration(500)
              .style("opacity", 0);
            });
        
        g.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return yScale(d[yvariable]); })
        .attr("height", function(d) { return height - yScale(d[yvariable]); })
        .delay(function(d,i){console.log(i) ; return(i*100)})
    });
}

function calculate() {
  var userword = document.getElementById("userinput").value;
  var userwordarray = [userword.charAt(0), 
                      userword.charAt(1), 
                      userword.charAt(2),
                      userword.charAt(3),
                      userword.charAt(4)]
  var myCSV = d3.csv("validguesses.csv");

  if (userword.length == 5) {
    myCSV.then(function(data) {
      var word = [],
        totalrank = [];
      data.map(function(d) {
          word.push(d.word);
          totalrank.push(d.positionalrarityscore);
      });
      var possibleWordArray = []
      var scoreArray = []
      console.log(userwordarray)
      for (let i = 0; i < word.length; i++) {
        var iterator = 0
        for (let j = 0; j < 5; j++) {
          if (userwordarray.includes(word[i].charAt(j))) {
            //pass
          } else {
            iterator += 1
          }
        }
        if (iterator == 5) {
          possibleWordArray.push(word[i])
          scoreArray.push(totalrank[i])
        }
      }
      var minscore = Math.min( ...scoreArray)
      var minscoreindex = scoreArray.indexOf(minscore.toString())
      var minscoreword = possibleWordArray[minscoreindex]
      d3.select("input.wordcheckerresult")
        .attr("value", minscoreword)
        .transition()
        .duration(500)
        .style("opacity", .9)
    })

    document.getElementById('error').innerHTML = ''
  } else {
    document.getElementById('error').innerHTML = 'Please enter a five letter word'
  }
}