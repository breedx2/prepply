'use strict';

import interceptor from 'express-interceptor';

// Injects the reload.js script into body of any .html files being served...
export default interceptor((req, res) => ({
    // Only HTML responses will be intercepted
    isInterceptable: function(){
      return (res.statusCode < 300) && /text\/html/.test(res.get('Content-Type'));
    },
    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      console.log(`Inject reload js ${req.url}`);
      const result = body.replace('<body>', '<body>\n<script src="/reload/reload.js"></script>');
      send(result);
    }
}));
