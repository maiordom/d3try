d3Try =
{
    extend: function( obj, target )
    {
        for ( var i in target )
        {
            obj[ i ] = target[ i ];
        }
    },

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