msgBox.directive('msgBox', function() {
  return {
    scope: {
      peer: '=',
      status: '=',
      count: '='
    },
    controller: 'msgBoxController',
    templateUrl: 'js/components/msgBox/template.html'
  };
});
