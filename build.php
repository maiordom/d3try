<?php
$files = Array(
    "d3try.plot.js",
    "d3try.graph.js",
    "d3try.init.js",
    "d3try.utils.js"
);

function createBundle( $files, $path, $bundle ) {
    $file_str = "";

    for ( $i = 0, $ilen = count( $files ); $i < $ilen; $i++ ) {
        $file_str .= file_get_contents( $path . "/js/". $files[ $i ] ) . "\r\n\r\n";
    }

    $file_str = preg_replace( "/window/", "global", $file_str );

    $file_handle = fopen( $bundle, "w+" );
    fwrite( $file_handle, "(function( global ) {\r\n" );
    fwrite( $file_handle, $file_str );
    fwrite( $file_handle, "})( window );" );
    fclose( $file_handle );
}

function getIndex( $path ) {
    header( "HTTP/1.0 200 OK" );
    header( "Content-Type: text/html" );
    echo file_get_contents( $path . "/index.html" );
}

function route( $files ) {
    if ( isset( $_GET[ "path" ] ) ) {
        $path = $_GET[ "path" ];

        if ( is_dir( $path ) ) {
            createBundle( $files, $path, $path . "/" . "d3try.js" );
            getIndex( $path );
        }
    }
}

route( $files );