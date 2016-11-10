self.onmessage = function (e) {
  switch ( e.data.command ) {
    case 'ping':
      global.postMessage( { reply: 'pong' } );
      break;
    case 'encode':
      if ( !global.FlacEncoder )  {
        importScripts( 'FlacEncoder.js' );
      }
      FlacEncoder.encode( e.data );
      break;
    case 'prefetch':
      if ( !global.FlacEncoder )  {
        importScripts( 'FlacEncoder.js' );
        FlacEncoder.prefetch( e.data );
      }
      break;
  }
};