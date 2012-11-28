d3Try.Graph = function( data, config ) {
    var graph, dots, x, y, line, path, dotsBlock;

    function init() {
        cache();
        drawDots();
    }

    function cache() {
        graph = config.graphsBlock.append( "g" ).attr( "class", "graph" );
        path  = graph.append( "path" ).attr( "stroke", data.color );
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

    init();

    return {
        render: drawGraph
    };
};