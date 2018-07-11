(function($) {
  $(function() {
    $('a[href^="https://"], a[href^="http://"]').not('[href^="https://' + location.hostname + '"], [href^="http://' + location.hostname + '"]').not('[target]').attr('target', '_blank');

    $('a[href^="/images/"]').not('[target]').attr('target', '_blank');

    $('table').wrap('<div class="table-wrap"></div>');
  });

  if (!navigator.doNotTrack) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-110810013-1', 'yukinote.net');
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview');
  }
})(jQuery);
