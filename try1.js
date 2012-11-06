d3Try =
{
    domain: function( data, name )
    {
        var domain  = d3.extent( data, function( d, i ) { return d[ name ]; } ),
            left    = domain[ 0 ],
            right   = domain[ 1 ],
            padding = Math.abs( left - right ) * 0.2;

        domain[ 0 ] = left  + ( left  >= 0 ? padding : - padding );
        domain[ 1 ] = right + ( right >= 0 ? padding : - padding );

        return domain;
    },

    forEach: function( obj, callback, ctx )
    {
        var i = 0, length = obj.length;

        for ( ; i < length; i++ )
        {
            if ( callback.call( ctx || obj[ i ], obj[ i ], i ) === false ) { break; }
        }
    },

    copyArray: function( data )
    {
        var arr = [];

        d3Try.forEach( data, function( item, i )
        {
            d3Try.forEach( item.data, function( item, i )
            {
                arr.push( item );
            });
        });

        return arr;
    }
};

d3Try.Plot = function( plot, data, props )
{
    var w, h, svg, x, y, line, graphs_block, orig_w, orig_h,
        graphs = [], domain = {}, tip = {}, axis = {},
        margin = { top: 0, right: 0, bottom: 0, left: 0 },

    init = function()
    {
        $.extend( margin, props.margin );

        cache();
        setGraphs();
        setData( props.w, props.h );
        render();
    },

    cache = function()
    {
        svg = d3.select( plot ).append( "svg" ).attr( "class", "svg" );

        graphs_block = svg.append( "g" ).attr( "class", "graphs" );

        axis.x = svg.append( "g" ).attr( "class", "x axis" );
        axis.y = svg.append( "g" ).attr( "class", "y axis" );

        tip.g    = svg.append( "g" ).attr( "class", "tooltip" ).attr( "visibility", "hidden" );
        tip.rect = tip.g.append( "rect" ).attr( "rx", 5 ).attr( "ry", 5 );
        tip.x    = tip.g.append( "text" );
        tip.y    = tip.g.append( "text" );
    },

    setGraphs = function()
    {
        var graph;

        domain.data = d3Try.copyArray( data );
        domain.x = d3Try.domain( domain.data, "x" );
        domain.y = d3Try.domain( domain.data, "y" );

        d3Try.forEach( data, function( item, i )
        {
            graph = d3Try.Graph( item, { graphs_block: graphs_block, domain: domain, tip: tip, svg: svg, margin: margin } );
            graphs.push( graph );
        });
    },

    setData = function( width, height )
    {
        orig_w = width;
        orig_h = height;
        w = width  - ( margin.right + margin.left ),
        h = height - ( margin.top   + margin.bottom );

        x = d3.scale.linear().domain( domain.x ).range( [ 0, w ] );
        y = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        axis.x_data = d3.svg.axis().scale( x ).orient( "bottom" );
        axis.y_data = d3.svg.axis().scale( y ).orient( "left" );
    },

    render = function()
    {
        plot.style.width  = orig_w + "px";
        plot.style.height = orig_h + "px";

        svg
            .attr( "width",  w + ( margin.right + margin.left   ) )
            .attr( "height", h + ( margin.top   + margin.bottom ) );

        axis.x
            .attr( "transform", "translate(" + margin.left + "," + ( y.range()[ 0 ] + margin.top ) + ")" )
            .call( axis.x_data );

        axis.y
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )
            .call( axis.y_data );

        var x2 = axis.x.node().getBBox().width,
            y2 = axis.y.node().getBBox().height;

        axis.y.selectAll( ".tick" ).each( function()
        {
            d3.select( this ).attr( { x1: -6, y1: 0, x2: x2, y2: 0 } );
        });

        axis.x.selectAll( ".tick" ).each( function()
        {
            d3.select( this ).attr( { x1: 0, y1: - y2 } );
        });

        d3Try.forEach( graphs, function( item, i )
        {
            item.render( w, h );
        });
    };

    init();

    return {
        render: render,
        setData: setData
    };
};

d3Try.Graph = function( props, Plot )
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
            .style( props.line );

        setDots();
    },

    render = function( w, h )
    {
        x = d3.scale.linear().domain( domain.x ).range( [ 0, w ] );
        y = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        line = d3.svg.line()
            .x( function( d, i ) { return x( d.x ); } )
            .y( function( d, i ) { return y( d.y ); } );

        path.attr( "d", line( props.data ) );

        renderDots();
    },

    setDots = function()
    {
        if ( !( props.point && props.point.show ) ) { return };

        dots_block = graph.append( "g" )
            .attr( "class", "dots" )
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        dots = dots_block
            .selectAll( ".dot" )
            .data( props.data )
            .enter()
            .append( "circle" )
            .attr( "class", "dot" )
            .attr( "r", 3 )
            .style( props.point );
    },

    renderDots = function()
    {
        if ( !( props.point && props.point.show ) ) { return };

        dots
            .attr( "cx", function( d, i ) { return x( d.x ); } )
            .attr( "cy", function( d, i ) { return y( d.y ); } );
    },

    bindEvents = function()
    {
        if ( !( props.point && props.point.show ) ) { return };

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
            .style( props.tip );

        clearTimeout( tip.timer );

        tip.g.attr( "visibility", "visible" ).transition().duration( 250 ).style( "opacity", 1 );

        return d3.select( this ).transition().attr( "r", 5 );
    },

    onDotMouseOut = function( d, i )
    {
        tip.g.transition().duration( 250 ).style( "opacity", 0 );

        tip.timer = setTimeout( function()
        {
            tip.g.attr( "visibility", "hidden" );
        }, 250 );

        return d3.select( this ).transition().attr( "r", 3 );
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

(function()
{
    var data = [ [], [], [], [], [] ], root = $( window ), Plot;

    for ( var i = -20, ilen = 20; i < ilen; i += 2 )
    {
        data[ 0 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 - 2 } );
    }

    for ( i = -30, ilen = 30; i < ilen; i += 2 )
    {
        data[ 1 ].push( { x: i, y: i * 0.6 + 3 } );
    }

    for ( i = 20, ilen = 50; i < ilen; i += 1 )
    {
        data[ 2 ].push( { x: i, y: Math.exp( i / 10 ) + 30 } );
    }

    for ( i = 0, ilen = 15; i < ilen; i += 2 )
    {
        data[ 3 ].push( { x: i, y: - i * i * 0.422 - i * 0.39876 + 200 } );
    }

    for ( i = 0, ilen = 15; i < ilen; i += 2 )
    {
        data[ 4 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 + 200 } );
    }

    Plot = d3Try.Plot( $( ".plot" ).get( 0 ),
    [
        { data: data[ 0 ], line: { stroke: "red" },    point: { stroke: "red",    show: true }, tip: { stroke: "#00A9DD" } },
        { data: data[ 1 ], line: { stroke: "blue" },   point: { stroke: "blue",   show: true }, tip: { stroke: "#00A9DD" } },
        { data: data[ 2 ], line: { stroke: "green" },  point: { stroke: "green"              }, tip: { stroke: "#00A9DD" } },
        { data: data[ 3 ], line: { stroke: "grey" },   point: { stroke: "grey"               }, tip: { stroke: "#00A9DD" } },
        { data: data[ 4 ], line: { stroke: "purple" }, point: { stroke: "purple", show: true }, tip: { stroke: "#00A9DD" } }
    ],
    {
        w: root.width()  - 10,
        h: root.height() - 10,
        margin: { top: 50, right: 50, bottom: 50, left: 50 }
    });

    root.resize( function()
    {
        Plot.setData( root.width() - 10, root.height() - 10 );
        Plot.render();
    });
})();