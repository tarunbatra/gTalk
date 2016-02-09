
header.directive('header',function()
{
    return{
        templateUrl:'js/components/header/template.html',
	    link:function(s)
	    {
		    s.user=JSON.parse(localStorage.getItem('data')).username;
		    s.logout=function()
		    {
			    localStorage.removeItem('data');
			    location.href='#index';
		    };
	    }
    };
});
