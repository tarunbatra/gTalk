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
            getAll: {
                method: 'GET',
                url: 'user/'
            },
            getOne: {
                method: 'GET',
                url:    'user/:id'
            }
        }
    );

}]);