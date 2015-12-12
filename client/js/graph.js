(function() {
    var $graph = $(".graph-container");
    $(window).load(() => {
        drawGraph();
        window.onresize = drawGraph;
        function drawGraph () {
            var margin = { top: 5, right: 15, bottom: 55, left: 35};
            var width = $graph.width() - margin.left - margin.right;
            var height = $graph.height() - margin.top - margin.bottom;

            $("#graph").empty();
            var svg = d3.select("#graph")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${$graph.width()} ${$graph.height()}`)
                .attr("class", "svg-content-responsive");

            var x = d3.scale.linear()
                .range([0, width]);
            var y = d3.scale.linear()
                .range([height, 0]);
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(5);

            d3.json("./public/sample.json", (error, data) => {
                for (var key of Object.keys(data)) {
                    var obj = data[key];
                    var g = svg.append("g")
                        .attr('transform', `translate(${margin.left}, ${margin.top})`)
                        .attr("class", `graph-${key.toLowerCase()}`);
                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(d => {return x(d.dist)})
                        .y(d => {return y(d.elev)});
                    var area = d3.svg.area()
                        .interpolate("basis")
                        .x(d => {return x(d.dist)})
                        .y0(height )
                        .y1(d => {return y(d.elev)});

                    x.domain(d3.extent(obj, d => { return d.dist}));
                    y.domain(d3.extent(obj, d => { return d.elev}));

                    //g.append("g")
                    //    .attr("class", "x axis")
                    //    .attr("transform", `translate(0,${height + 10})`)
                    //    .call(xAxis);
                    //g.append("g")
                    //    .attr("class", "y axis")
                    //    .call(yAxis);
                    g.append("path")
                        .attr("class", "area")
                        .attr("d", area(obj))
                        .attr("fill", $color[key]);
                    //g.append("path")
                    //    .attr("class", "line")
                    //    .attr("d", line(obj))
                    //    .attr("stroke", $color[key])
                }

            });
        }
    });
})(window);