d3Try.Graph = function( data, Plot )
{
    var tip    = Plot.tip,
        svg    = Plot.svg,
        margin = Plot.margin,
        domain = Plot.domain, graph, dots, x, y, line, path, dots_block,

        cache = function()
        {
            graph = Plot.graphs_block.append( "g" )
                .attr( "class", "graph" );

            path = graph
                .append( "path" )
                .attr( "class", "line" )
                .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )
                .attr( "stroke", Plot.color );

            setDots();
        },

        render = function( w, h )
        {
            x = d3.scale.linear().domain( domain.x ).range( [ 0, w ] );
            y = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

            line = d3.svg.line()
                .x( function( d, i ) { return x( d.x ); } )
                .y( function( d, i ) { return y( d.y ); } );

            path.attr( "d", line( data ) );

            renderDots();
        },

        setDots = function()
        {
            dots_block = graph.append( "g" )
                .attr( "class", "dots" )
                .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

            dots = dots_block
                .selectAll( ".dot" )
                .data( data )
                .enter()
                .append( "circle" )
                .attr( { class: "dot", r: 3, fill: Plot.color } );
        },

        renderDots = function()
        {
            dots
                .attr( "cx", function( d, i ) { return x( d.x ); } )
                .attr( "cy", function( d, i ) { return y( d.y ); } );
        },

        bindEvents = function()
        {
            dots
                .on( "mouseover", onDotMouseOver )
                .on( "mouseout",  onDotMouseOut )
                .on( "click",     onDotMouseClick );
        },

        onDotMouseOver = function( d, i )
        {
            var item = d3.select( this ),
                data = item.data()[ 0 ];

            tip.x.text( "x: " + data.x );
            tip.y.text( "y: " + data.y );

            var x_w  = tip.x.node().getBBox().width  + 15,
                x_h  = tip.x.node().getBBox().height + 10,
                y_w  = tip.y.node().getBBox().width  + 15,
                y_h  = tip.y.node().getBBox().height + 10,
                cx   = parseInt( item.attr( "cx" ) ) + 5 + margin.left,
                cy   = parseInt( item.attr( "cy" ) ) - 2 * x_h - 5 + margin.top;

            tip.g.attr( "transform", "translate(" + cx + "," + cy + ")" );
            tip.x.attr( "x", 5 ).attr( "y", 15 );
            tip.y.attr( "x", 5 ).attr( "y", x_h + 15 );

            tip.rect
                .attr( "width", Math.max( x_w, y_w ) + "px" )
                .attr( "height", 2 * x_h + "px" )
                .style( "stroke", Plot.color );

            tip.g.attr( "visibility", "visible" ).style( "opacity", 1 );
            item.transition().attr( "r", 5 );
        },

        onDotMouseOut = function( d, i )
        {
            tip.g.style( "opacity", 0 );
            d3.select( this ).transition().attr( "r", 3 );
        },

        onDotMouseClick = function( d, i )
        {
            return console.log( d, i );
        };

    cache();
    bindEvents();

    return {
        render: render
    };
};