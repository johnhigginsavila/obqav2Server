/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {
	schema: true,
  attributes: {
		username: {
			type: 'string',
			required: false,
			unique : true
		},
		email:{
		  type: 'string',
			required: true,
			email: true,
			unique: true
		},
		encryptedPassword: {
			type: 'string'
		},
		displayName: {
			type: 'string'
			
		},
		avatar: {
			type: 'string'
		},
		lastname:{
			type: 'string'
		},
		firstname:{
			type: 'string'
		},
		title:{
			type: 'string',
			enum: ['Dr.', 'Mr.','Ms']
		},
		program:{
			model: 'program'
		},
		userRestriction:{
			model: 'restriction'
		},
		class:{
			collection:'class',
			via: 'user'
		},
		logtrail: {
			collection: 'logtrail',
			via: 'user'
		}
  },
  beforeCreate: function(values, next){
    if(!values.password || values.password != values.confirmation){
      return next({err:["Password doesn't match password confirmation."]});
    }else{
      bcrypt.hash(values.password, 10).then(function(encryptedPassword){
        values.encryptedPassword = encryptedPassword;
        next();
      }).catch(function(err){
        return next(err);
      })
    }
  }
};


