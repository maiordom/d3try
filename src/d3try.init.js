d3Try.init = function()
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

    Plot = d3Try.Plot( $( ".plot" ).get( 0 ),
    {
        w: root.width()  - 110,
        h: root.height() - 110,

        title:    { text: "Graph" },
        subtitle: { text: "d3Try" },
        x_axis:   { title: { text: "x axis title" } },
        y_axis:   { title: { text: "y axis title" } },
        series:   [ { data: data[ 0 ] }, { data: data[ 1 ] }, { data: data[ 2 ] }, { data: data[ 3 ] }, { data: data[ 4 ] } ],
        margin:   { top: 60, right: 50, bottom: 50, left: 60 }
    });

    root.resize( function()
    {
        Plot.setData( root.width() - 110, root.height() - 110 );
        Plot.render();
    });
};