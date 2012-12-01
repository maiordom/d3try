d3Try.Plot = function( plot, config )
{
    var w, h, wOrig, hOrig, svg, gradientBlock,
        domain = {}, axis = {},
        margin = { top: 60, right: 50, bottom: 50, left: 60 };

    function init() {
        setDomain();
        setParams( config.width, config.height );
        drawCtx();
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

    function setParams( width, height ) {
        wOrig = width;
        hOrig = height;
        w = width  - ( margin.right + margin.left );
        h = height - ( margin.top   + margin.bottom );

        var xScale = d3.scale.linear().domain( domain.x ).range( [ 0, w ] ),
            yScale = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        axis.x = d3.svg.axis().scale( xScale ).orient( "bottom" );
        axis.y = d3.svg.axis().scale( yScale ).orient( "left" );
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
        axis.xBlock = svg.append( "g" ).attr( "class", "x axis" );
        axis.yBlock = svg.append( "g" ).attr( "class", "y axis" );
    }

    function drawPlot() {
        svg.attr( { width: wOrig, height: hOrig } );
        gradientBlock.attr( { width: wOrig, height: hOrig } );
    }

    function drawAxis() {
        axis.xBlock
            .call( axis.x )
            .attr( "transform", "translate(" + margin.left + "," + ( h + margin.top ) + ")" );

        axis.yBlock
            .call( axis.y )
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        var x2 = axis.xBlock.node().getBBox().width,
            y2 = axis.yBlock.node().getBBox().height;

        axis.yBlock.selectAll( ".tick" ).attr( { x1: -6, y1: 0, x2: x2, y2: 0 } );
        axis.xBlock.selectAll( ".tick" ).attr( { x1: 0, y1: - y2 } );
    }

    function draw() {
        drawPlot();
        drawAxis();
    }

    init();

    return {
        draw: draw,
        setParams: setParams
    };
};