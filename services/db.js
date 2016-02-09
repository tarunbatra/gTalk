const mongoose=require('mongoose');
const config=require('./../config');
const db=mongoose.connection;
module.exports=function()
{
	mongoose.connect(config.database);
	db.on('error',function(err)
		{
			console.log(err.message);
		});
	db.once('open', function()
	{
		console.log('Database Connected.')
	});
};
