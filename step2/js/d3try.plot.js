d3Try = {};
d3Try.Plot = function( plot, config )
{
    var w, h, wOrig, hOrig,
        x, y,
        svg, gradientBlock, graphsBlock,
        graphs = [], domain = {}, axis = {},
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

        graphsBlock = svg.append( "g" ).attr( { "class": "graphs", "transform": "translate(" + margin.left + "," + margin.top + ")" } );
    }

    function initGraphs() {
        var graph, params, color = 0;

        params = { graphsBlock: graphsBlock, domain: domain, margin: margin };

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

    function draw() {
        drawPlot();
        drawAxis();
    }

    init();

    return {
        draw: draw,
        setData: setData
    };
};