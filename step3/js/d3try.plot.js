d3Try.Plot = function( plot, config )
{
    var w, h, wOrig, hOrig,
        x, y,
        svg, title, subtitle, legends, gradientBlock, graphsBlock,
        graphs = [], domain = {}, axis = {}, tip = {},
        margin = { top: 60, right: 50, bottom: 50, left: 60 },
        colors = [ "#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee" ];

    function init() {
        drawCtx();
        setDomain();
        setData( config.width, config.height );
        drawGradient();
        drawHelpers();
        initGraphs();
        draw();
    }

    function drawCtx() {
        plot = d3.select( plot );
        svg = plot.append( "svg" ).attr( "class", "svg" );
    }

    function setDomain() {
        domain.data = d3Try.copyArray( config.series );
        domain.x = d3Try.domain( domain.data, "x" );
        domain.y = d3Try.domain( domain.data, "y" );
    }

    function setData( width, height ) {
        wOrig = width;
        hOrig = height;
        w = width  - ( margin.right + margin.left );
        h = height - ( margin.top   + margin.bottom );

        x = d3.scale.linear().domain( domain.x ).range( [ 0, w ] );
        y = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        axis.xData = d3.svg.axis().scale( x ).orient( "bottom" );
        axis.yData = d3.svg.axis().scale( y ).orient( "left" );
    }

    function drawGradient() {
        var gradient = svg.append( "linearGradient" )
            .attr( { x1: 0, y1: 0, x2: 0, y2: h, "gradientUnits": "userSpaceOnUse", id: "gradient-1" } );

        d3Try.forEach( config.gradientPlot, function( item, i ) {
            gradient.append( "stop" ).attr( item );
        });

        gradientBlock = svg.append( "rect" )
            .attr( { "class": "gradient", rx: 15, ry: 15, fill: "url(#gradient-1)", x: 0, y: 0, width: wOrig, height: hOrig } );
    }

    function drawHelpers() {
        axis.x = svg.append( "g" ).attr( "class", "x axis" );
        axis.y = svg.append( "g" ).attr( "class", "y axis" );

        legends = svg.append( "g" ).attr( { "class": "legends", "transform": "translate(0, 40)" } );
        graphsBlock = svg.append( "g" ).attr( { "class": "graphs", "transform": "translate(" + margin.left + "," + margin.top + ")" } );

        tip.g    = svg.append( "g" ).attr( { "class": "tooltip", "visibility": "hidden" } );
        tip.rect = tip.g.append( "rect" ).attr( { "rx": 5, "ry": 5 } );
        tip.x    = tip.g.append( "text" );
        tip.y    = tip.g.append( "text" );

        title       = svg.append( "text" ).attr( "class", "title" ).text( config.title.text );
        subtitle    = svg.append( "text" ).attr( "class", "subtitle" ).text( config.subtitle.text );
        axis.xTitle = svg.append( "text" ).attr( "class", "x-axis-title" ).text( config.xAxis.title.text );
        axis.yTitle = svg.append( "text" ).attr( "class", "y-axis-title" ).text( config.yAxis.title.text );
    }

    function initGraphs() {
        var graph, params, color = 0;

        params = { legends: legends, graphsBlock: graphsBlock, domain: domain, margin: margin };

        d3Try.forEach( config.series, function( item, i ) {
            color >= colors.length ? color = 0 : null;

            item.color = colors[ ++color ];
            item.index = i;
            graph = d3Try.Graph( item, params );
            graphs.push( graph );
        });
    }

    function drawPlot() {
        svg.attr( { width: wOrig, height: hOrig } );
        gradientBlock.attr( { width: wOrig, height: hOrig } );

        d3Try.forEach( graphs, function( item, i ) {
            item.render( w, h );
        });

        var coordX = wOrig - margin.right - legends.node().getBBox().width;

        legends.attr( { transform: "translate(" + coordX + ", " + margin.top + ")" } );
    }

    function drawAxis() {
        axis.x
            .call( axis.xData )
            .attr( "transform", "translate(" + margin.left + "," + ( y.range()[ 0 ] + margin.top ) + ")" );

        axis.y
            .call( axis.yData )
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        var x2 = axis.x.node().getBBox().width,
            y2 = axis.y.node().getBBox().height;

        axis.y.selectAll( ".tick" ).attr( { x1: -6, y1: 0, x2: x2, y2: 0 } );
        axis.x.selectAll( ".tick" ).attr( { x1: 0, y1: - y2 } );
    }

    function drawTitles() {
        var coordX = axis.x.node().getBBox().width  / 2 + margin.left - ( axis.xTitle.node().getBBox().width / 2 ),
            coordY = axis.y.node().getBBox().height / 2 + margin.top  + ( axis.yTitle.node().getBBox().width / 2 );

        axis.xTitle.attr( { x: coordX, y: hOrig - 15 } );
        axis.yTitle.attr( { transform: "translate(" + 20 + ", " + coordY + "), rotate(-90)" } );

        title.attr( { x: wOrig / 2, y: 25 } );
        subtitle.attr( { x: wOrig / 2, y: 25 + title.node().getBBox().height } );
    }

    function draw() {
        drawPlot();
        drawAxis();
        drawTitles();
    }

    init();

    return {
        draw: draw,
        setData: setData
    };
};