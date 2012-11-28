d3Try.Graph = function( data, config ) {
    var isVis = true, tip = config.tip, state, legend, graph, dots, x, y, line, path, dotsBlock;

    function init() {
        cache();
        drawDots();
        drawLegend();
        bindEvents();
    }

    function cache() {
        graph = config.graphsBlock.append( "g" ).attr( "class", "graph" );
        path  = graph.append( "path" ).attr( "stroke", data.color );
    }

    function drawLegend() {
        legend = config.legends.append( "g" )
            .attr( "class", "legend-item" )
            .attr( "transform", "translate(0, " + ( data.index ? data.index * 16 : 0 ) + ")" );

        legend.append( "path" )
            .attr( "d", "M 0 0 15 0 z" )
            .attr( "stroke", data.color )
            .attr( "transform", "translate(0, -3)" );

        legend.append( "text" )
            .attr( "x", 20 )
            .text( data.name ? data.name : "series-" + data.index );
    }

    function drawGraph( w, h ) {
        x = d3.scale.linear().domain( config.domain.x ).range( [ 0, w ] );
        y = d3.scale.linear().domain( config.domain.y ).range( [ h, 0 ] );

        line = d3.svg.line()
            .x( function( d, i ) { return x( d.x ); } )
            .y( function( d, i ) { return y( d.y ); } );

        path.attr( "d", line( data.data ) );

        dots
            .attr( "cx", function( d, i ) { return x( d.x ); } )
            .attr( "cy", function( d, i ) { return y( d.y ); } );
    }

    function drawDots() {
        dotsBlock = graph.append( "g" ).attr( "class", "dots" );

        dots = dotsBlock
            .selectAll( ".dot" )
            .data( data.data )
            .enter()
            .append( "circle" )
            .attr( { "class": "dot", r: 4, fill: data.color } );
    }

    function bindEvents() {
        dotsBlock
            .on( "mouseover", onDotMouseOver )
            .on( "mouseout",  onDotMouseOut );

        legend
            .on( "mouseover", onLegendMouseOver )
            .on( "mouseout",  onLegendMouseOut )
            .on( "mousedown", onLegendClick );
    }

    function onLegendClick() {
        if ( isVis ) {
            isVis = false;
            path.attr( "visibility", "hidden" );
            dotsBlock.attr( "visibility", "hidden" );
            legend.select( "path" ).attr( "stroke", "#777" );
            legend.style( "fill", "#777" );
        } else {
            isVis = true;
            path.attr( "visibility", "visible" );
            dotsBlock.attr( "visibility", "visible" );
            legend.select( "path" ).attr( "stroke", data.color );
            legend.style( "fill", "" );
        }

        return false;
    }

    function onLegendMouseOver() {
        var color = d3.rgb( data.color ).brighter( 1 ).toString();

        path.attr( "stroke", color );
        dots.attr( "fill", color );
    }

    function onLegendMouseOut() {
        path.attr( "stroke", data.color );
        dots.attr( "fill", data.color );
    }

    function onDotMouseOver( d, i ) {
        if ( d3.select( d3.event.target ).attr( "class") !== "dot" ) {
            return;
        }

        var node = d3.select( d3.event.target ),
            info = node.data()[ 0 ];

        tip.x.text( "x: " + info.x );
        tip.y.text( "y: " + info.y );

        var xw = tip.x.node().getBBox().width  + 15,
            yw = tip.y.node().getBBox().width  + 15,
            xh = 24,
            cx = parseInt( node.attr( "cx" ) ) + 5 + config.margin.left,
            cy = parseInt( node.attr( "cy" ) ) - 2 * xh - 5 + config.margin.top;

        tip.g.attr( "transform", "translate(" + cx + "," + cy + ")" );
        tip.x.attr( "x", 5 ).attr( "y", 15 );
        tip.y.attr( "x", 5 ).attr( "y", xh + 15 );

        tip.rect
            .attr( "width", Math.max( xw, yw ) + "px" )
            .attr( "height", 2 * xh + "px" )
            .attr( "stroke", data.color );

        tip.g.attr( "visibility", "visible" );
        node.transition().attr( "r", 6 );
    }

    function onDotMouseOut( d, i ) {
        if ( d3.select( d3.event.target ).attr( "class") !== "dot" ) {
            return;
        }

        tip.g.attr( "visibility", "hidden" );
        d3.select( d3.event.target ).transition().attr( "r", 4 );
    }

    init();

    return {
        render: drawGraph
    };
};