home.controller('homeController',['$scope','apiService', function ($scope,user)
{
	console.log('homeController');

	if(!localStorage.getItem('data'))
	{
		location.href='#index';
	}
}]);


/*

	users from api {peers.elemMatch thisUser}
	messages from api


 */