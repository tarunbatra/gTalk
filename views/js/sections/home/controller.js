home.controller('homeController',['$scope','apiService','socketService', function ($scope,user,socket)
{
	console.log('homeController');

	if(!localStorage.getItem('data'))
	{
		location.href='#index';
	}
	var me=JSON.parse(localStorage.getItem('data'));
	user.getOne({id:me.username},function(res)
	{
		socket.emit('connection',me);
	});
}]);


/*

	users from api {peers.elemMatch thisUser}
	messages from api

 */