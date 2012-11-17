d3Try.Graph = function( data, config )
{
    var is_vis = true, state, legend, graph, dots, x, y, line, path, dots_block,

        init = function()
        {
            cache();
            setDots();
            setLegend();
            bindEvents();
        },

        cache = function()
        {
            graph = config.graphs_block.append( "g" ).attr( "class", "graph" );
            path  = graph.append( "path" ).attr( "stroke", data.color );
        },

        setLegend = function()
        {
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
        },

        render = function( w, h )
        {
            x = d3.scale.linear().domain( config.domain.x ).range( [ 0, w ] );
            y = d3.scale.linear().domain( config.domain.y ).range( [ h, 0 ] );

            line = d3.svg.line()
                .x( function( d, i ) { return x( d.x ); } )
                .y( function( d, i ) { return y( d.y ); } );

            path.attr( "d", line( data.data ) );

            dots
                .attr( "cx", function( d, i ) { return x( d.x ); } )
                .attr( "cy", function( d, i ) { return y( d.y ); } );
        },

        setDots = function()
        {
            dots_block = graph.append( "g" ).attr( "class", "dots" );

            dots = dots_block
                .selectAll( ".dot" )
                .data( data.data )
                .enter()
                .append( "circle" )
                .attr( { class: "dot", r: 4, fill: data.color } );
        },

        bindEvents = function()
        {
            dots
                .on( "mouseover", onDotMouseOver )
                .on( "mouseout",  onDotMouseOut )
                .on( "click",     onDotMouseClick );

            legend
                .on( "mouseover", onLegendMouseOver )
                .on( "mouseout",  onLegendMouseOut )
                .on( "mousedown", onLegendClick );
        },

        onLegendClick = function()
        {
            if ( is_vis )
            {
                is_vis = false;
                path.attr( "visibility", "hidden" );
                dots_block.attr( "visibility", "hidden" );
                legend.select( "path" ).attr( "stroke", "#777" );
                legend.style( "fill", "#777" );
            }
            else
            {
                is_vis = true;
                path.attr( "visibility", "visible" );
                dots_block.attr( "visibility", "visible" );
                legend.select( "path" ).attr( "stroke", data.color );
                legend.style( "fill", "" );
            }

            return false;
        },

        onLegendMouseOver = function()
        {
            var color = d3.rgb( data.color ).brighter( 1 ).toString();

            path.attr( "stroke", color );
            dots.attr( "fill", color );
        },

        onLegendMouseOut = function()
        {
            path.attr( "stroke", data.color );
            dots.attr( "fill", data.color );
        },

        onDotMouseOver = function( d, i )
        {
            var node = d3.select( this ),
                info = node.data()[ 0 ];

            config.tip.x.text( "x: " + info.x );
            config.tip.y.text( "y: " + info.y );

            var x_w  = config.tip.x.node().getBBox().width  + 15,
                x_h  = config.tip.x.node().getBBox().height + 10,
                y_w  = config.tip.y.node().getBBox().width  + 15,
                y_h  = config.tip.y.node().getBBox().height + 10,
                cx   = parseInt( node.attr( "cx" ) ) + 5 + config.margin.left,
                cy   = parseInt( node.attr( "cy" ) ) - 2 * x_h - 5 + config.margin.top;

            config.tip.g.attr( "transform", "translate(" + cx + "," + cy + ")" );
            config.tip.x.attr( "x", 5 ).attr( "y", 15 );
            config.tip.y.attr( "x", 5 ).attr( "y", x_h + 15 );

            config.tip.rect
                .attr( "width", Math.max( x_w, y_w ) + "px" )
                .attr( "height", 2 * x_h + "px" )
                .attr( "stroke", data.color );

            config.tip.g.attr( "visibility", "visible" );
            node.transition().attr( "r", 6 );
        },

        onDotMouseOut = function( d, i )
        {
            config.tip.g.attr( "visibility", "hidden" );
            d3.select( this ).transition().attr( "r", 4 );
        },

        onDotMouseClick = function( d, i )
        {
            return console.log( d, i );
        };

    init();

    return {
        render: render
    };
};