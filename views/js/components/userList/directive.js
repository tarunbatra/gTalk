userList.directive('userList', function() {
  return {
    scope: {
      active: '=',
      code: '=',
      unread: '='
    },
    controller: 'userListController',
    templateUrl: 'js/components/userList/template.html'
  };
});
