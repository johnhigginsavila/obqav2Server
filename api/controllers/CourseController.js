/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var xlsxj = require('xlsx-2-json');
var path = require('path');
module.exports = {
	find:function(req,res,next){
        ProgramCourse.find()
        .populate('course')
        .then(function(programCourse){
            console.log('CourseController: find success!');
            res.send(200, programCourse);
        }).catch(function(err){
            res.send(500, err);
        })
    },
    create:function(req, res, next){
        courseCreate(req.body)
        .then(programCourseCreate)
        .then(function(data){
            console.log('CourseController: create success!');
            res.send(200, data);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function courseCreate(data){
            var promise = new Promise(function(resolve, reject){
                Course.find({courseCode:data.courseCode}).then(function(course){
                    if(course.length === 0){
                        Course.create({courseCode:data.courseCode}).then(function(course){
                            resolve(course);
                        }).catch(function(err){
                            reject(err);
                        })
                    }else{
                        Course.update(course[0].id, {courseCode:data.courseCode}).then(function(course){
                            resolve(course[0]);
                        }).catch(function(err){
                            reject(err);
                        })
                    }
                })
                    
            })
            return promise;
        }
        function programCourseCreate(course){
            var promise = new Promise(function(resolve, reject){
                ProgramCourse.find({program:data.program, course:course.id})
                .then(function(programCourse){
                    if(programCourse.length === 0){
                        ProgramCourse.create({program:data.program, course:course.id})
                        .then(function(programCourse){
                            programCourse[0].course = course;
                            resolve(programCourse);
                        }).catch(function(err){
                            reject(err);
                        })
                    }else{
                        ProgramCourse.update({program:data.program, course:course.id},{program:data.program, course:course.id})
                        .then(function(programCourse){
                            programCourse[0].course = course;
                            resolve(programCourse);
                        })
                    }
                }).catch(function(err){
                    reject(err);
                })
                        
            })  
            return promise;
        }
    },
    upload:function(req, res, next){
        parseXlsx()
        .then(processData)
        .then(function(data){
            console.log('CourseController: upload success!');
            setTimeout(function(){
                res.send(200, data);
            },1000)
        }).catch(function(err){
            console.log(err);
            setTimeout(function(){
                res.send(500, err);
            },1000)
        })

        function parseXlsx(){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload(function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }else if(path.extname(uploadFiles[0].filename) != '.xlsx' && path.extname(uploadFiles[0].filename) != '.xls'){
                        reject([{name:'uploadCourseError', message:'Invalid File...'}]);
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
                },500)
            })
            return promise;

            function saveData(item, index, array){
                courseCreate(array[index])
                .then(programCourseCreate)
                .then(function(result){
                    array[index] = result;
                }).catch(function(err){
                    console.log(err);
                })
            }
            function courseCreate(newCourse){
                var promise = new Promise(function(resolve, reject){
                    Course.find({courseCode:newCourse['COURSE CODE']}).then(function(course){
                        if(course.length === 0){
                            Course.create({courseCode:newCourse['COURSE CODE']}).then(function(course){
                                resolve(course);
                            }).catch(function(err){
                                reject(err);
                            })
                        }else{
                            Course.update(course[0].id, {courseCode:newCourse['COURSE CODE']}).then(function(course){
                                resolve(course[0]);
                            }).catch(function(err){
                                reject(err);
                            })
                        }
                    })
                        
                })
                return promise;
            }
            function programCourseCreate(course){
                var promise = new Promise(function(resolve, reject){
                    ProgramCourse.find({program:req.body.program, course:course.id})
                    .then(function(programCourse){
                        if(programCourse.length === 0){
                            ProgramCourse.create({program:req.body.program, course:course.id})
                            .then(function(programCourse){
                                programCourse[0].course = course;
                                resolve(programCourse);
                            }).catch(function(err){
                                reject(err);
                            })
                        }else{
                            ProgramCourse.update({program:req.body.program, course:course.id},{program:req.body.program, course:course.id})
                            .then(function(programCourse){
                                programCourse[0].course = course;
                                resolve(programCourse);
                            })
                        }
                    }).catch(function(err){
                        reject(err);
                    })
                            
                })  
                return promise;
            }    
        }
            
    }
};
