/**
 * ClassStudentController
 *
 * @description :: Server-side logic for managing classstudents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:function(req,res,next){
        ClassStudent.find({id:1}).populate('student').then(function(student){
            res.send(student);
        })
    }
};
