d3Try = {};
d3Try.init = function() {
    var data = [ [], [], [], [], [] ], root = window, Plot, params, config;

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

    function getParams() {
        var w = root.innerWidth  - 110,
            h = root.innerHeight - 110;

        w = w < 500 ? 500 : w;
        h = h < 500 ? 500 : h;

        return [ w, h ];
    }

    params = getParams();

    config = {
        gradientPlot: [
            { offset: 0, "stop-color": "rgb(96, 96, 96)", "stop-opacity": 1 },
            { offset: 1, "stop-color": "rgb(31, 31, 31)", "stop-opacity": 1 }
        ],
        width: params[ 0 ],
        height: params[ 1 ],

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

    root.onresize = function() {
        params = getParams();

        Plot.setParams( params[ 0 ], params[ 1 ] );
        Plot.draw();
    };
};

d3Try.domain = function( data, name ) {
    var domain  = d3.extent( data, function( d, i ) { return d[ name ]; } ),
        left    = domain[ 0 ],
        right   = domain[ 1 ],
        padding = Math.abs( left - right ) * 0.2;

    domain[ 0 ] = left  + ( left  >= 0 ? padding : - padding );
    domain[ 1 ] = right + ( right >= 0 ? padding : - padding );

    return domain;
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