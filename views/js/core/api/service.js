api.factory('apiService',['$resource',function($resource)
{
    return $resource('/user/:action',
        {action:'@action'},
        {
            signIn: {
                method: 'POST',
                url: '/user/sign_in'
            },
            signUp: {
                method: 'POST',
                url: '/user/sign_up'
            },
            signOut: {
                method: 'POST',
                url: '/user/sign_out'
            }
        }
    );

}]);