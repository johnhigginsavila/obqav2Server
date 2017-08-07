/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create:function(req, res, next){
        User.create(req.body)
        .then(logUserIn)
        .then(function(user){
            var data = req.session;
			 delete data.cookie.path;
			 delete data.cookie.originalMaxAge;
            console.log('UserController: create success');
            res.status(200).send(data);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function logUserIn(user){
            var promise = new Promise(function(resolve, reject){
                if(user){
                
                    delete user.encryptedPassword;
                    delete user.createdAt;
                    delete user.updatedAt;
                    req.session.User = user;
                    req.session.token = jwToken.issue({id: user.id});
                    req.session.authenticated = true;
                    /*var token = jwt.sign(data.user, process.env.SECRET,{
                        expiresIn: 60*60*24
                    })*/
                    
                    //req.session.token = token;
                    resolve(user);
                }else{
                    var userLoginError = [{name:'userError', message:'There is a error in logging the user'}]
                    reject(userLoginError);
                }  
            })
            return promise;
        }
    }
};
