d3Try.Graph = function( item, Plot )
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
            graph = Plot.graphs_block.append( "g" ).attr( "class", "graph" );

            path = graph.append( "path" )
                .attr( "stroke", item.color )
                .attr( "transform", "translate(" + Plot.margin.left + "," + Plot.margin.top + ")" );
        },

        setLegend = function()
        {
            legend = Plot.legends.append( "g" )
                .attr( "class", "legend-item" )
                .attr( "transform", "translate(0, " + ( item.index ? item.index * 16 : 0 ) + ")" );

            legend.append( "path" )
                .attr( "d", "M 0 0 15 0 z" )
                .attr( "stroke", item.color )
                .attr( "transform", "translate(0, -3)" );

            legend.append( "text" )
                .attr( "x", 20 )
                .text( item.name ? item.name : "series-" + item.index );
        },

        render = function( w, h )
        {
            x = d3.scale.linear().domain( Plot.domain.x ).range( [ 0, w ] );
            y = d3.scale.linear().domain( Plot.domain.y ).range( [ h, 0 ] );

            line = d3.svg.line()
                .x( function( d, i ) { return x( d.x ); } )
                .y( function( d, i ) { return y( d.y ); } );

            path.attr( "d", line( item.data ) );

            dots
                .attr( "cx", function( d, i ) { return x( d.x ); } )
                .attr( "cy", function( d, i ) { return y( d.y ); } );
        },

        setDots = function()
        {
            dots_block = graph.append( "g" )
                .attr( "class", "dots" )
                .attr( "transform", "translate(" + Plot.margin.left + "," + Plot.margin.top + ")" );

            dots = dots_block
                .selectAll( ".dot" )
                .data( item.data )
                .enter()
                .append( "circle" )
                .attr( { class: "dot", r: 3, fill: item.color } );
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
                .on( "mousedown", onPathClick );
        },

        onPathClick = function()
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
                legend.select( "path" ).attr( "stroke", item.color );
                legend.style( "fill", "" );
            }

            return false;
        },

        onLegendMouseOver = function()
        {
            var color = d3.rgb( item.color ).brighter( 1 ).toString();

            path.attr( "stroke", color );
            dots.attr( "fill", color );
        },

        onLegendMouseOut = function()
        {
            path.attr( "stroke", item.color );
            dots.attr( "fill", item.color );
        },

        onDotMouseOver = function( d, i )
        {
            var node = d3.select( this ),
                data = node.data()[ 0 ];

            Plot.tip.x.text( "x: " + data.x );
            Plot.tip.y.text( "y: " + data.y );

            var x_w  = Plot.tip.x.node().getBBox().width  + 15,
                x_h  = Plot.tip.x.node().getBBox().height + 10,
                y_w  = Plot.tip.y.node().getBBox().width  + 15,
                y_h  = Plot.tip.y.node().getBBox().height + 10,
                cx   = parseInt( node.attr( "cx" ) ) + 5 + Plot.margin.left,
                cy   = parseInt( node.attr( "cy" ) ) - 2 * x_h - 5 + Plot.margin.top;

            Plot.tip.g.attr( "transform", "translate(" + cx + "," + cy + ")" );
            Plot.tip.x.attr( "x", 5 ).attr( "y", 15 );
            Plot.tip.y.attr( "x", 5 ).attr( "y", x_h + 15 );

            Plot.tip.rect
                .attr( "width", Math.max( x_w, y_w ) + "px" )
                .attr( "height", 2 * x_h + "px" )
                .attr( "stroke", item.color );

            Plot.tip.g.attr( "visibility", "visible" );
            node.transition().attr( "r", 5 );
        },

        onDotMouseOut = function( d, i )
        {
            Plot.tip.g.attr( "visibility", "hidden" );
            d3.select( this ).transition().attr( "r", 3 );
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