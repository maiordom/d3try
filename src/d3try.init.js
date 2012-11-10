d3Try.init = function()
{
    var data = [ [], [], [], [], [] ], root = window, Plot, params;

    for ( var i = -20, ilen = 20; i < ilen; i += 2 )
    {
        data[ 0 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 - 2 } );
    }

    for ( i = -30, ilen = 30; i < ilen; i += 2 )
    {
        data[ 1 ].push( { x: i, y: i * 0.6 + 3 } );
    }

    for ( i = 20, ilen = 50; i < ilen; i += 2 )
    {
        data[ 2 ].push( { x: i, y: Math.exp( i / 10 ) + 30 } );
    }

    for ( i = 0, ilen = 15; i < ilen; i += 3 )
    {
        data[ 3 ].push( { x: i, y: - i * i * 0.422 - i * 0.39876 + 200 } );
    }

    for ( i = 0, ilen = 15; i < ilen; i += 2 )
    {
        data[ 4 ].push( { x: i, y: i * i * 0.422 - i * 0.39876 + 200 } );
    }

    function getParams()
    {
        var w = root.innerWidth  - 110,
            h = root.innerHeight - 110;

        w = w < 500 ? 500 : w;
        h = h < 500 ? 500 : h;

        return [ w, h ];
    }

    params = getParams();

    Plot = d3Try.Plot( document.getElementById( "plot-1" ),
    {
        w: params[ 0 ], h: params[ 1 ],

        title: { text: "Graph" },
        subtitle: { text: "d3Try" },
        x_axis: { title: { text: "x axis title" } },
        y_axis: { title: { text: "y axis title" } },
        margin: { top: 60, right: 50, bottom: 50, left: 60 },
        series:
        [
            { name: "Tokyo", data: data[ 0 ] },
            { data: data[ 1 ] },
            { data: data[ 2 ] },
            { data: data[ 3 ] },
            { data: data[ 4 ] }
        ]
    });

    root.onresize = function()
    {
        params = getParams();

        Plot.setData( params[ 0 ], params[ 1 ] );
        Plot.render();
    };
};