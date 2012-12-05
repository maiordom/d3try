(function( global ) {
d3Try = {};
d3Try.init = function() {
    var data = [ [], [], [], [], [] ], Plot, config;

    for ( var i = -20, ilen = 20; i < ilen; i += 3 ) {
        data[ 0 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 + 40 } );
    }

    for ( i = -30, ilen = 30; i < ilen; i += 6 ) {
        data[ 1 ].push( { x: i, y: i * 0.6 + 3 } );
    }

    for ( i = 20, ilen = 50; i < ilen; i += 4 ) {
        data[ 2 ].push( { x: i, y: Math.exp( i / 10 ) + 30 } );
    }

    for ( i = 0, ilen = 15; i < ilen; i += 3 ) {
        data[ 3 ].push( { x: i, y: - i * i * 0.422 - i * 0.39876 + 200 } );
    }

    for ( i = 0, ilen = 20; i < ilen; i += 3 ) {
        data[ 4 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 + 200 } );
    }

    config = {
        gradientPlot: [
            { offset: 0, "stop-color": "rgb(96, 96, 96)", "stop-opacity": 1 },
            { offset: 1, "stop-color": "rgb(31, 31, 31)", "stop-opacity": 1 }
        ],
        width:  800,
        height: 500,

        title: {
            text: "Graph"
        },
        subtitle: {
            text: "d3Try"
        },
        xAxis: {
            title: {
                text: "x axis title"
            }
        },
        yAxis: {
            title: {
                text: "y axis title"
            }
        },
        series: [
            { name: "Tokyo", data: data[ 0 ] },
            { data: data[ 1 ] },
            { data: data[ 2 ] },
            { data: data[ 3 ] },
            { data: data[ 4 ] }
        ]
    };

    Plot = d3Try.Plot( document.getElementById( "plot-1" ), config );
};

d3Try.forEach = function( obj, callback, ctx ) {
    var i = 0, length = obj.length;

    for ( ; i < length; i++ ) {
        if ( callback.call( ctx || obj[ i ], obj[ i ], i ) === false ) { break; }
    }
};

d3Try.concatArray = function( data ) {
    var arr = [];

    d3Try.forEach( data, function( item, i ) {
        d3Try.forEach( item.data, function( item, i ) {
            arr.push( item );
        });
    });

    return arr;
};

d3Try.Plot = function( plot, config )
{
    var w, h, wOrig, hOrig, svg, title, subtitle, legends, gradientBlock, graphsBlock,
        graphs = [], domain = {}, axis = {},
        margin = { top: 60, right: 50, bottom: 50, left: 60 },
        colors = [ "#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee" ];

    function init() {
        setDomain();
        setParams( config.width, config.height );
        setAxis();
        drawCtx();
        drawGradient();
        drawHelpers();
        initGraphs();
        draw();
    }

    function globalDomain( data, name ) {
        var domain  = d3.extent( data, function( d, i ) { return d[ name ]; } ),
            left    = domain[ 0 ],
            right   = domain[ 1 ],
            padding = Math.abs( left - right ) * 0.1;

        domain[ 0 ] = left  + ( left  >= 0 ? padding : - padding );
        domain[ 1 ] = right + ( right >= 0 ? padding : - padding );

        return domain;
    }

    function setDomain() {
        var data = d3Try.concatArray( config.series );
        domain.x = globalDomain( data, "x" );
        domain.y = globalDomain( data, "y" );
    }

    function setParams( width, height ) {
        wOrig = width;
        hOrig = height;
        w = width  - ( margin.right + margin.left );
        h = height - ( margin.top   + margin.bottom );
    }

    function setAxis() {
        var xScale = d3.scale.linear().domain( domain.x ).range( [ 0, w ] ),
            yScale = d3.scale.linear().domain( domain.y ).range( [ h, 0 ] );

        axis.x = d3.svg.axis().scale( xScale ).orient( "bottom" );
        axis.y = d3.svg.axis().scale( yScale ).orient( "left" );
    }

    function drawCtx() {
        plot = d3.select( plot );
        svg = plot.append( "svg" ).attr( "class", "svg" );
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
        legends     = svg.append( "g" ).attr( { "class": "legends", "transform": "translate(0, 40)" } );
        graphsBlock = svg.append( "g" ).attr( { "class": "graphs", "transform": "translate(" + margin.left + "," + margin.top + ")" } );
        title       = svg.append( "text" ).attr( "class", "title" ).text( config.title.text );
        subtitle    = svg.append( "text" ).attr( "class", "subtitle" ).text( config.subtitle.text );
        axis.xTitle = svg.append( "text" ).attr( "class", "x-axis-title" ).text( config.xAxis.title.text );
        axis.yTitle = svg.append( "text" ).attr( "class", "y-axis-title" ).text( config.yAxis.title.text );
    }

    function initGraphs() {
        var graph, params, color = 0;

        params = { legends: legends, graphsBlock: graphsBlock, domain: domain, margin: margin };

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

        var coordX = wOrig - margin.right - legends.node().getBBox().width;

        legends.attr( { transform: "translate(" + coordX + ", " + margin.top + ")" } );
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

    function drawTitles() {
        var coordX = axis.xBlock.node().getBBox().width  / 2 + margin.left - ( axis.xTitle.node().getBBox().width / 2 ),
            coordY = axis.yBlock.node().getBBox().height / 2 + margin.top  + ( axis.yTitle.node().getBBox().width / 2 );

        axis.xTitle.attr( { x: coordX, y: hOrig - 15 } );
        axis.yTitle.attr( { transform: "translate(" + 20 + ", " + coordY + "), rotate(-90)" } );

        title.attr( { x: wOrig / 2, y: 25 } );
        subtitle.attr( { x: wOrig / 2, y: 25 + title.node().getBBox().height } );
    }

    function draw() {
        drawPlot();
        drawAxis();
        drawTitles();
    }

    init();
};

d3Try.Graph = function( data, config ) {
    var legend, graph, dots, line, path, dotsBlock;

    function init() {
        cache();
        drawDots();
        drawLegend();
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
        var xScale = d3.scale.linear().domain( config.domain.x ).range( [ 0, w ] ),
            yScale = d3.scale.linear().domain( config.domain.y ).range( [ h, 0 ] );

        line = d3.svg.line()
            .x( function( d, i ) { return xScale( d.x ); } )
            .y( function( d, i ) { return yScale( d.y ); } );

        path.attr( "d", line( data.data ) );

        dots
            .attr( "cx", function( d, i ) { return xScale( d.x ); } )
            .attr( "cy", function( d, i ) { return yScale( d.y ); } );
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

})( window );