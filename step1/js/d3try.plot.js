d3Try.Plot = function( plot, config )
{
    var w, h, wOrig, hOrig,
        x, y,
        svg, gradientBlock,
        domain = {}, axis = {},
        margin = { top: 60, right: 50, bottom: 50, left: 60 };

    function init() {
        drawCtx();
        setDomain();
        setData( config.width, config.height );
        drawGradient();
        drawHelpers();
        draw();
    }

    function drawCtx() {
        plot = d3.select( plot );
        svg = plot.append( "svg" ).attr( "class", "svg" );
    }

    function setDomain() {
        var data = d3Try.concatArray( config.series );
        domain.x = d3Try.domain( data, "x" );
        domain.y = d3Try.domain( data, "y" );
    }

    function setData( width, height ) {
        wOrig = width;
        hOrig = height;
        w = width  - ( margin.right + margin.left );
        h = height - ( margin.top   + margin.bottom );

        x = d3.scale.linear().domain( domain.x ).range( [ 0, w ] );
        y = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        axis.xScale = d3.svg.axis().scale( x ).orient( "bottom" );
        axis.yScale = d3.svg.axis().scale( y ).orient( "left" );
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
    }

    function drawPlot() {
        svg.attr( { width: wOrig, height: hOrig } );
        gradientBlock.attr( { width: wOrig, height: hOrig } );
    }

    function drawAxis() {
        axis.x
            .call( axis.xScale )
            .attr( "transform", "translate(" + margin.left + "," + ( y.range()[ 0 ] + margin.top ) + ")" );

        axis.y
            .call( axis.yScale )
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