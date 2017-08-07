/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path');
var xlsxj = require('xlsx-2-json');
module.exports = {
	find:function(req, res, next){
        Class.find()
        .populate('programCourse')
        .populate('user')
        .populate('classStudent')
        .populate('assessmentClass')
        .then(populateCourse)
        .then(populateStudent)
        .then(dataCleaner)
        .then(function(classes){
            console.log('ClassController: find success!');
            res.send(200, classes)
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function populateCourse(data) {
            var promise = new Promise(function (resolve, reject) {
                function course(item, index, array) {
                    ProgramCourse.find({ id: array[index].programCourse.id })
                        .populate('course')
                        .then(function (programCourse) {
                            array[index].programCourse = programCourse[0];
                        }).catch(function (err) {
                            console.log(err);
                        })
                }
                if(data.length !== 0){
                    data.forEach(course)
                    setTimeout(function(){
                        resolve(data);
                    },100)
                }else{
                    resolve(data);
                }
                
                
            })
            return promise;
        }

        function populateStudent(data){
            var promise = new Promise(function(resolve, reject){
                if(data.length !== 0){
                    data.forEach(students);
                    setTimeout(function() {
                        resolve(data);
                    }, 100);
                }else{
                    resolve(data);
                }
                
                function students(item, index, array){
                    array[index].classStudent.forEach(myData);
                    function myData(item, index, array){
                    Student.findOne({id:array[index].student}).then(function(student){
                        array[index].student = student;
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                }
                
            })
            return promise;
        }

        

        function dataCleaner(data) {
            var promise = new Promise(function (resolve, reject) {
                function deleteUnwantedData(item, index, array) {
                    try{
                        delete array[index].createdAt;
                        delete array[index].updatedAt;
                        delete array[index].programCourse.createdAt;
                        delete array[index].programCourse.updatedAt;
                        delete array[index].programCourse.course.createdAt;
                        delete array[index].programCourse.course.updatedAt;
                        delete array[index].user.createdAt;
                        delete array[index].user.updatedAt;
                        delete array[index].user.encryptedPassword;
                        delete array[index].user.userRestriction;
                    }catch(error){
                        console.log(error)
                        reject(error);
                    }
                        
                    
                }

                if(data.length !== 0){
                    data.forEach(deleteUnwantedData);
                    setTimeout(function () {
                        resolve(data);
                    }, 100)
                }else{
                    resolve(data);
                }
                    
            })
            return promise;
        }
        
    },
    findProgram:function(req, res, next){
        Class.find({program:req.headers.program, cycle:req.headers.cycle})
        .populate('programCourse')
        .populate('user')
        .populate('classStudent')
        .populate('assessmentClass')
        .then(populateCourse)
        .then(populateStudent)
        .then(dataCleaner)
        .then(function(classes){
            console.log('ClassController: findProgram success!');
            res.send(200, classes)
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function populateCourse(data) {
            var promise = new Promise(function (resolve, reject) {
                function course(item, index, array) {
                    ProgramCourse.find({ id: array[index].programCourse.id })
                        .populate('course')
                        .then(function (programCourse) {
                            array[index].programCourse = programCourse[0];
                        }).catch(function (err) {
                            console.log(err);
                        })
                }
                if(data.length !== 0){
                    data.forEach(course)
                    setTimeout(function(){
                        resolve(data);
                    },100)
                }else{
                    resolve(data);
                }
                
                
            })
            return promise;
        }

        function populateStudent(data){
            var promise = new Promise(function(resolve, reject){
                if(data.length !== 0){
                    data.forEach(students);
                    setTimeout(function() {
                        resolve(data);
                    }, 100);
                }else{
                    resolve(data);
                }
                
                function students(item, index, array){
                    array[index].classStudent.forEach(myData);
                    function myData(item, index, array){
                    Student.findOne({id:array[index].student}).then(function(student){
                        array[index].student = student;
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                }
                
            })
            return promise;
        }

        

        function dataCleaner(data) {
            var promise = new Promise(function (resolve, reject) {
                function deleteUnwantedData(item, index, array) {
                    try{
                        delete array[index].createdAt;
                        delete array[index].updatedAt;
                        delete array[index].programCourse.createdAt;
                        delete array[index].programCourse.updatedAt;
                        delete array[index].programCourse.course.createdAt;
                        delete array[index].programCourse.course.updatedAt;
                        delete array[index].user.createdAt;
                        delete array[index].user.updatedAt;
                        delete array[index].user.encryptedPassword;
                        delete array[index].user.userRestriction;
                    }catch(error){
                        console.log(error)
                        reject(error);
                    }
                        
                    
                }

                if(data.length !== 0){
                    data.forEach(deleteUnwantedData);
                    setTimeout(function () {
                        resolve(data);
                    }, 100)
                }else{
                    resolve(data);
                }
                    
            })
            return promise;
        }
        
    },
    findOne:function(req,res,next){
        Class.find({ id: req.param('id'), user:req.param('instructor') })
        .populate('programCourse')
        .populate('user')
        .populate('classStudent')
        .populate('assessmentClass')
        .populate('evidence')
        .then(populateStudent)
        .then(deletePassword)
        .then(populateCourse)
        .then(populateAssessment)
        .then(function(data){
            setTimeout(function() {
                if(data.length == 0){
                    console.log('Invalid Class')
                    res.send(400,{message:'Invalid Class'});
                }else{
                    console.log('ClassController: findeOne success!');
                    res.send(200,data);
                }
            }, 200);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function populateCourse(data) {
            var promise = new Promise(function (resolve, reject) {

                function course(item, index, array) {
                    ProgramCourse.find({ id: array[index].programCourse.id })
                        .populate('course')
                        .then(function (programCourse) {
                            array[index].programCourse = programCourse[0];
                        }).catch(function (err) {
                            console.log(err);
                        })
                }
                data.forEach(course)
                setTimeout(function(){
                    resolve(data);
                },100)
                
                
            })
            return promise;
        }
        function populateStudent(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(students);
                setTimeout(function() {
                    resolve(data);
                }, 100);
                function students(item, index, array){
                    array[index].classStudent.forEach(myData);
                    function myData(item, index, array){
                    Student.findOne({id:array[index].student})
                    .populate('grade')
                    .then(function(student){
                        array[index].student = student;
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                }
                
            })
            return promise;
        }
        function populateAssessment(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(assessmentLooper);
                setTimeout(function(){
                    resolve(data);
                }, 100)

                function assessmentLooper(item, index, array){
                    array.forEach(populateAssessmentClass)
                }

                function populateAssessmentClass(data){
                        data.assessmentClass.forEach(assessment);
                        function assessment(item, index, array){
                            AssessmentClass.findOne({id:array[index].id})
                                .populate('assessment')
                                .populate('evidence')
                                .then(getEvidence)
                                .then(getAssessment)
                                .then(function(assessmentClass){
                                    array[index] = assessmentClass;
                                }).catch(function(err){
                                    console.log(err);
                                })

                                function getAssessment(data){
                                    var promise = new Promise(function(resolve, reject){
                                        Assessment.findOne({id:data.assessment.id})
                                        .populate('programSopi')
                                        .populate('programCourse')
                                        .then(sopi)
                                        .then(function(result){
                                            data.assessment = result;
                                            resolve(data);
                                        }).catch(function(err){
                                            reject(err);
                                        })

                                        function sopi (data){
                                            var promise = new Promise(function(resolve, reject){
                                                ProgramSopi.findOne({id:data.programSopi.id})
                                                    .populate('sopi')
                                                    .then(function(result){
                                                        data.programSopi = result;
                                                        resolve(data);
                                                    }).catch(function(err){
                                                        reject(err);
                                                    })
                                            })
                                            return promise;
                                        }
                                    })
                                    return promise;
                                        
                                }

                                function getEvidence(data){
                                    var promise = new Promise(function(resolve, reject){
                                        Evidence.find({assessmentClass:data.id}).then(function(result){                                            
                                            data.evidence = result;
                                            resolve(data);
                                            
                                        }).catch(function(err){
                                            reject(err);
                                        })
                                    })
                                    return promise;
                                }
                               
                        }

                    
                }
            })
            return promise;
        }
        function deletePassword(data){
            var promise = new Promise(function(resolve,reject){
                data.forEach(password)
                resolve(data);
                function password(item, index, array){
                    if(array[index].user.encryptedPassword)delete array[index].user.encryptedPassword;
                }
            })
            return promise;
        }
    },
    create:function(req, res, next){
        course(req.body)
        .then(programCourse)
        .then(instructor)
        .then(finalizeData)
        .then(createClass)
        .then(findAssessment)
        .then(createAssessmentClass)
        .then(function(data){
            console.log('ClassController: create success!');
            res.send(200, data);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function dataTest(data){
            var promise = new Promise(function(resolve,reject){
                resolve(data);
            })
            return promise;
        }

        function course(data) {
            var promise = new Promise(function (resolve, reject) {
                Course.find({ courseCode: data.course }).then(function (course) {
                    if (course.length === 0) {
                        var courseError = [{ error: 'courseNotFoundError', message: 'Invalid Course' }];
                        reject(courseError);
                    } else {
                        data.course = course[0];
                        resolve(data);
                    }
                }).catch(function (err) {
                    var error = [{ error: 'courseFindError', message: 'Cannont Check the course at this time', err: err }];
                    reject(err);
                })
            })
            return promise;
        }

        function programCourse(data) {
            var promise = new Promise(function (resolve, reject) {
                ProgramCourse.find({ course: data.course.id, program: data.program }).then(function (programCourse) {
                    if (programCourse.length === 0) {
                        var programCourseError = [{ error: 'programCourseNotFoundError', message: 'Invalid programCourse' }];
                        reject(programCourseError);
                    } else {
                        data.programCourse = programCourse[0];
                        resolve(data)
                    }
                }).catch(function (err) {
                    var error = [{ error: 'programCourseFindError', message: 'Cannot Check the program course at this time', err: err }];
                    reject(error);
                })
            })
            return promise;
        }

        function instructor(data){
            var promise = new Promise(function(resolve, reject){
                User.find({firstname:data.firstnameInstructor, lastname:data.lastnameInstructor})
                .then(function(instructor){
                    if(instructor.length === 0){
                        var instructorError = [{error: 'instructorNotFoundError', message:'Invalid firstname or lastname or the Instructor is not on the list'}];
                        reject(instructorError);
                    }else{
                        data.instructor = instructor[0];
                        resolve(data);
                    }
                }).catch(function(err){
                    var error = [{error:'instructorFindError', message:'Cannot Check the instructor list at this time', err:err}];
                    reject(error);
                })
            })
            return promise;
        }

        function finalizeData(data){
           
            var promise = new Promise(function (resolve, reject) {
               
                var finalData = {
                    programCourse: data.programCourse.id,
                    user: data.instructor.id,
                    term: data.term,
                    academicYear: data.academicYear,
                    cycle:data.cycle
                }
                resolve(finalData);
              
            })
            return promise;
        }


        function createClass(data){
            var promise = new Promise(function(resolve, reject){
                updateOrCreateClass(data, data)
                function updateOrCreateClass(criteria, values){
                    Class.find(criteria).then(function(data){
                        if(data.length === 0){
                            Class.create(values).then(function(data){
                                resolve(data);
                            }).catch(function(err){
                                var createError = [{error:'createClassError', message: 'Cannot create Class at this time', err:err}]
                                reject(createError);
                            })
                        }else{
                            Class.update(criteria, values).then(function(data){
                                resolve(data[0]);
                            }).catch(function(err){
                                var updateError = [{error:'updateClassError', message:'Cannot update Class at this time',err:err}]
                                reject(updateError);
                            })
                        }
                    }).catch(function(err){
                        reject(err);
                    })
                  }

            })
            return promise;
        }

        function findAssessment(data){
            var promise = new Promise(function(resolve, reject){
                Assessment.find({academicYear:data.academicYear, programCourse:data.programCourse})
                .then(function(assessment){
                    if(assessment.length == 0){
                        var invalidAssessmentError = [{error:'invalidAssessmentError', message:'The assessment is not listed'}]
                        reject(invalidAssessmentError);
                    }else{
                        data.assessment = assessment;// this is an array
                        resolve(data)
                    }
                    
                }).catch(function(err){
                    var findAssessmentError = [{error:'findAssessmentError', message:'Cannot find assessment at this time', err:err}];
                    reject(findAssessmentError);
                })
            })
            return promise;
        }
        function createAssessmentClass(data){
            var promise = new Promise(function(resolve, reject){

                data.assessment.forEach(loopAssessment);
                setTimeout(function(){
                    resolve(data);
                },100)

                function loopAssessment (item, index, array){
                    array[index].class = data.id;
                    assessmentClass(array[index]).then(function(result){
                        array[index] = result;
                    }).catch(function(err){
                        console.log(err);
                    })
                }

                function assessmentClass(data){
                    var promise = new Promise(function(resolve, reject){
                        AssessmentClass.find({assessment:data.id, class:data.class}).then(function(result){
                            if(result.length === 0){
                                AssessmentClass.create({assessment:data.id, class:data.class}).then(function(assessment){
                                    data = assessment;
                                    resolve(data);
                                }).catch(function(err){
                                    var createAssessmentClassError = [{error:'createAssessmentClassError', message:'Cannot CreateAssessment at this time', err:err}];
                                    reject(createAssessmentClassError);
                                })
                            }else{
                                AssessmentClass.update({id:result[0].id},{assessment:data.id, class:data.class}).then(function(assessment){
                                    data = assessment[0];
                                    resolve(data);
                                }).catch(function(err){
                                    var updateAssessmentClassError = [{error:'updateAssessmentClassError', message:'Cannot Update Assessment at this time', err:err}];
                                    reject(updateAssessmentClassError);
                                })
                            }
                        })
                    })
                    return promise;
                }
                        
            })
            return promise;
        }
        
    },
    upload:function(req, res, next){
         parseXlsx()
         .then(processData)
         .then(function(result){
             setTimeout(function(){
                 console.log('ClassController: upload success!');
                res.send(200, result);
             }, 1000)
        }).catch(function(err){
            console.log(err);
            setTimeout(function(){
                res.send(500, err);
             }, 1000)
        })
        function parseXlsx(){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload(function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }else if(path.extname(uploadFiles[0].filename) != '.xlsx' && path.extname(uploadFiles[0].filename) != '.xls'){
                        reject([{name:'uploadClassError', message:'Invalid File...'}]);
                    }else{
                        var fd = uploadFiles[0].fd;
                        xlsxj({
                            input: fd,
                            output: null
                        },function(err, result){
                            if(err){
                                reject(err);
                            }else{
                                resolve(result);
                            }
                        })
                    }
                })
            })
            return promise;
        }
        function processData(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(saveData);
                setTimeout(function(){
                    resolve(data);
                },100)
                function saveData(item, index, array){
                    formatData(array[index])
                    .then(course)
                    .then(programCourse)
                    .then(instructor)
                    .then(finalizeData)
                    .then(createClass)
                    .then(findAssessment)
                    .then(createAssessmentClass)
                    .then(function(result){
                        array[index] = result;
                    }).catch(function(err){
                        console.log(err);
                    })
                    function formatData(data){
                        var promise = new Promise(function(resolve, reject){
                            var formattedData = {
                                course:data['COURSE'],
                                term:data['TERM'],
                                academicYear: data['ACADEMIC YEAR'],
                                firstnameInstructor: data['FIRSTNAME OF INSTRUCTOR'],
                                lastnameInstructor: data['LASTNAME OF INSTRUCTOR'],
                                cycle:data['CYCLE'],
                                program:req.body.program
                            }
                            resolve(formattedData);
                        })
                        return promise;
                    }
                    function course(data) {
                        var promise = new Promise(function (resolve, reject) {
                            Course.find({ courseCode: data.course }).then(function (course) {
                                if (course.length === 0) {
                                    var courseError = [{ error: 'courseNotFoundError', message: 'Invalid Course' }];
                                    reject(courseError);
                                } else {
                                    data.course = course[0];
                                    resolve(data);
                                }
                            }).catch(function (err) {
                                var error = [{ error: 'courseFindError', message: 'Cannont Check the course at this time', err: err }];
                                reject(err);
                            })
                        })
                        return promise;
                    }
                    function programCourse(data) {
                        var promise = new Promise(function (resolve, reject) {
                            ProgramCourse.find({ course: data.course.id, program: data.program }).then(function (programCourse) {
                                if (programCourse.length === 0) {
                                    var programCourseError = [{ error: 'programCourseNotFoundError', message: 'Invalid programCourse' }];
                                    reject(programCourseError);
                                } else {
                                    data.programCourse = programCourse[0];
                                    resolve(data)
                                }
                            }).catch(function (err) {
                                var error = [{ error: 'programCourseFindError', message: 'Cannot Check the program course at this time', err: err }];
                                reject(error);
                            })
                        })
                        return promise;
                    }
                    function instructor(data){
                        var promise = new Promise(function(resolve, reject){
                            User.find({firstname:data.firstnameInstructor, lastname:data.lastnameInstructor})
                            .then(function(instructor){
                                if(instructor.length === 0){
                                    var instructorError = [{error: 'instructorNotFoundError', message:'Invalid firstname or lastname or the Instructor is not on the list'}];
                                    reject(instructorError);
                                }else{
                                    data.instructor = instructor[0];
                                    resolve(data);
                                }
                            }).catch(function(err){
                                var error = [{error:'instructorFindError', message:'Cannot Check the instructor list at this time', err:err}];
                                reject(error);
                            })
                        })
                        return promise;
                    }
                    function finalizeData(data){
                        var promise = new Promise(function (resolve, reject) {
                            var finalData = {
                                programCourse: data.programCourse.id,
                                user: data.instructor.id,
                                term: data.term,
                                academicYear: data.academicYear,
                                program:data.program,
                                cycle:data.cycle
                            }
                            resolve(finalData);
                        
                        })
                        return promise;
                    }
                    function createClass(data){
                        var promise = new Promise(function(resolve, reject){
                            updateOrCreateClass(data, data)
                            function updateOrCreateClass(criteria, values){
                                Class.find(criteria).then(function(data){
                                    if(data.length === 0){
                                        Class.create(values).then(function(data){
                                            resolve(data);
                                        }).catch(function(err){
                                            var createError = [{error:'createClassError', message: 'Cannot create Class at this time', err:err}]
                                            reject(createError);
                                        })
                                    }else{
                                        Class.update(criteria, values).then(function(data){
                                            resolve(data[0]);
                                        }).catch(function(err){
                                            var updateError = [{error:'updateClassError', message:'Cannot update Class at this time',err:err}]
                                            reject(updateError);
                                        })
                                    }
                                }).catch(function(err){
                                    reject(err);
                                })
                            }

                        })
                        return promise;
                    }
                    function findAssessment(data){
                        var promise = new Promise(function(resolve, reject){
                            Assessment.find({cycle:data.cycle, programCourse:data.programCourse})
                            .then(function(assessment){
                                if(assessment.length == 0){
                                    var invalidAssessmentError = [{error:'invalidAssessmentError', message:'The assessment is not listed'}]
                                    reject(invalidAssessmentError);
                                }else{
                                    data.assessment = assessment;// this is an array
                                    resolve(data)
                                }
                                
                            }).catch(function(err){
                                var findAssessmentError = [{error:'findAssessmentError', message:'Cannot find assessment at this time', err:err}];
                                reject(findAssessmentError);
                            })
                        })
                        return promise;
                    }
                    function createAssessmentClass(data){
                        var promise = new Promise(function(resolve, reject){

                            data.assessment.forEach(loopAssessment);
                            setTimeout(function(){
                                resolve(data);
                            },100)
                            function loopAssessment (item, index, array){
                                array[index].class = data.id;
                                assessmentClass(array[index]).then(function(result){
                                    array[index] = result;
                                }).catch(function(err){
                                    console.log(err);
                                })
                            }
                            function assessmentClass(data){
                                var promise = new Promise(function(resolve, reject){
                                    AssessmentClass.find({assessment:data.id, class:data.class}).then(function(result){
                                        if(result.length === 0){
                                            AssessmentClass.create({assessment:data.id, class:data.class}).then(function(assessment){
                                                data = assessment;
                                                resolve(data);
                                            }).catch(function(err){
                                                var createAssessmentClassError = [{error:'createAssessmentClassError', message:'Cannot CreateAssessment at this time', err:err}];
                                                reject(createAssessmentClassError);
                                            })
                                        }else{
                                            AssessmentClass.update({id:result[0].id},{assessment:data.id, class:data.class}).then(function(assessment){
                                                data = assessment[0];
                                                resolve(data);
                                            }).catch(function(err){
                                                var updateAssessmentClassError = [{error:'updateAssessmentClassError', message:'Cannot Update Assessment at this time', err:err}];
                                                reject(updateAssessmentClassError);
                                            })
                                        }
                                    })
                                })
                                return promise;
                            }     
                        })
                        return promise;
                    }
                }
            })
            return promise;

                
        }
    }
};

