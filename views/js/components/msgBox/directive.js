
msgBox.directive('msgBox',function()
{
    return{
	    scope:
	    {
		    peer:'=',
		    status:'='
	    },
        controller:'msgBoxController',
        templateUrl:'js/components/msgBox/template.html'
    };
});
