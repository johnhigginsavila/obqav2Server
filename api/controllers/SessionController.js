/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
process.env.SECRET = "MY SECRET KEY";
module.exports = {
	create:function(req, res, next){
		 requireEmailAndPassword()
      .then(validateEmail)
      .then(validatePassword)
      .then(logUserIn)
      .then(updateUser)
      .then(function(data){
			 var data = req.session;
			 delete data.cookie.path;
			 delete data.cookie.originalMaxAge;
       console.log('SessionController: create success');
       res.status(200).send(data);
    }).catch(function(err){
      console.log(err);
      res.status(500).send(err);
    })
    function requireEmailAndPassword(){
      var promise = new Promise(function(resolve, reject){
        if(!req.param('email') || !req.param('password')){
          var requireEmailAndPasswordError = [{name:'requireEmailAndPassword', message:'Please input your password and email to continue..'}]
          reject(requireEmailAndPasswordError);
        }else{
          var data = {
            email:req.param('email'),
            password: req.param('password')
          }
          //console.log(data);
          resolve(data);
        }
      })
      return promise;
    }
    function validateEmail(data){
      var promise = new Promise(function(resolve, reject){
        User.findOneByEmail(data.email)
          .then(function(user){
          if(!user){
            //console.log(user);
            var validateEmailError = [{name: 'validateEmailError', message:'Email '+data.email+' is not registered'}]
            reject(validateEmailError);
          }else{
            data.user = user;
            resolve(data);
          }
        }).catch(function(err){
          reject({err:'findUserError'});
        })
      })
      return promise;
    }
    function validatePassword(data){
      var promise = new Promise(function(resolve, reject){
        bcrypt.compare(data.password, data.user.encryptedPassword).then(function(res){
          if(!res){
            var passwordMismatchError = [{name:'passwordMismatchError', message:'Invalid email and password combination'}]
            reject(passwordMismatchError);
          }else{
            resolve(data);
          }
        }).catch(function(err){
          reject({err:'comparePasswordError'});
        })
      })
      return promise;
    }
    function logUserIn(data){
      var promise = new Promise(function(resolve, reject){
        if(data.user){
          req.session.authenticated = true;
					delete data.user.encryptedPassword;
					delete data.user.createdAt;
					delete data.user.updatedAt;
          req.session.User = data.user;
					req.session.token = jwToken.issue({id: data.user.id});
					
					/*var token = jwt.sign(data.user, process.env.SECRET,{
						expiresIn: 60*60*24
					})*/
					
					//req.session.token = token;
          resolve(data);
        }else{
          var userLoginError = [{name:'userError', message:'There is a error in logging the user'}]
          reject(userLoginError);
        }  
      })
      return promise;
    }
    function updateUser(data){
        promise = new Promise(function(resolve, reject){
          User.update({id:data.user.id},{online: true})
            .then(function(user){
		    data.user = user[0];
            resolve(data);
          }).catch(function(err){
            var updateUserError = [{name:'updateUserError', message:'Unable to update user: '+user.name,err:err}]
            reject(updateUserError);
          })
        })
        return promise;
      }
	}
};

