d3Try.Plot = function( plot, props )
{
    var w, h, x, y, line, orig_w, orig_h,
        svg,title, subtitle, legend, gradient_block, graphs_block,
        graphs = [],
        domain = {},
        axis   = {},
        margin = { top: 0, right: 0, bottom: 0, left: 0 },
        tip    = { stroke: "#00A9DD" },
        colors = [ "#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee" ],

        init = function()
        {
            d3Try.extend( margin, props.margin );
            d3Try.extend( tip,    props.tip );

            setSvg();
            setDomain();
            setData( props.w, props.h );
            setGradient();
            setHelpers();
            setGraphs();
            setLegend();
            render();
        },

        setSvg = function()
        {
            svg = d3.select( plot ).append( "svg" ).attr( "class", "svg" );
            plot = d3.select( plot );
        },

        setDomain = function()
        {
            domain.data = d3Try.copyArray( props.series );
            domain.x = d3Try.domain( domain.data, "x" );
            domain.y = d3Try.domain( domain.data, "y" );
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

        setLegend = function()
        {
            var item;

            legend = svg.append( "g" ).attr( { "class": "legend", "transform": "translate(0, 40)" } );

            d3Try.forEach( props.series, function( val, i )
            {
                item = legend.append( "g" ).attr( { "class": "legend-item", "transform": "translate(0, " + ( i ? i * 16 : 0 ) + ")" } );
                item.append( "path" ).attr( { "d": "M 0 0 15 0 z", "stroke": val.color, transform: "translate(0, -3)" } );
                item.append( "text" ).attr( "x", 20 ).text( val.name ? val.name : "series-" + i );
            });
        },

        setGradient = function()
        {
            var gradient = svg.append( "linearGradient" )
                .attr( { x1: 0, y1: 0, x2: 0, y2: h, "gradientUnits": "userSpaceOnUse", id: "gradient-1" } );

            gradient.append( "stop" ).attr( { offset: 0, "stop-color": "rgb(96, 96, 96)", "stop-opacity": 1 } );
            gradient.append( "stop" ).attr( { offset: 1, "stop-color": "rgb(31, 31, 31)", "stop-opacity": 1 } );

            gradient_block = svg.append( "rect" )
                .attr( { "class": "gradient", rx: 15, ry: 15, fill: "url(#gradient-1)", x: 0 , y: 0, width: orig_w, height: orig_h } );
        },

        setHelpers = function()
        {
            axis.x = svg.append( "g" ).attr( "class", "x axis" );
            axis.y = svg.append( "g" ).attr( "class", "y axis" );

            graphs_block = svg.append( "g" ).attr( "class", "graphs" );

            tip.g    = svg.append( "g" ).attr( "class", "tooltip" ).attr( "visibility", "hidden" );
            tip.rect = tip.g.append( "rect" ).attr( "rx", 5 ).attr( "ry", 5 );
            tip.x    = tip.g.append( "text" );
            tip.y    = tip.g.append( "text" );

            title = svg.append( "text" ).attr( { "class": "title" } );
            title.append( "tspan" ).text( props.title.text );

            subtitle = svg.append( "text" ).attr( { "class": "subtitle" } );
            subtitle.append( "tspan" ).text( props.subtitle.text );

            axis.x_title = svg.append( "text" ).attr( { "class": "x-axis-title" } );
            axis.x_title.append( "tspan" ).text( props.x_axis.title.text );

            axis.y_title = svg.append( "text" ).attr( { "class": "y-axis-title" } );
            axis.y_title.append( "tspan" ).text( props.y_axis.title.text );
        },

        setGraphs = function()
        {
            var graph, params, color = 0;

            params = { graphs_block: graphs_block, domain: domain, tip: tip, svg: svg, margin: margin };

            d3Try.forEach( props.series, function( item, i )
            {
                color >= colors.length ? color = 0 : null;

                item.color = colors[ ++color ];
                graph = d3Try.Graph( item, params );
                graphs.push( graph );
            });
        },

        render = function()
        {
            svg.attr( { width: orig_w, height: orig_h } );

            gradient_block.attr( { width: orig_w, height: orig_h } );

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

            var coord_x = axis.x.node().getBBox().width  / 2 + margin.left - ( axis.x_title.node().getBBox().width / 2 ),
                coord_y = axis.y.node().getBBox().height / 2 + margin.top  + ( axis.y_title.node().getBBox().width / 2 );

            axis.x_title.attr( { x: coord_x, y: orig_h - 15 } );
            axis.y_title.attr( { transform: "translate(" + 20 + ", " + coord_y + "), rotate(-90)" } );

            title.attr( { x: orig_w / 2, y: 25 } );
            subtitle.attr( { x: orig_w / 2, y: 25 + title.node().getBBox().height } );

            coord_x = orig_w - margin.right - legend.node().getBBox().width;

            legend.attr( { transform: "translate(" + coord_x + ", " + margin.top + ")" } );
        };

    init();

    return {
        render: render,
        setData: setData
    };
};