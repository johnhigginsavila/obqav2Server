/**
 * GradeController
 *
 * @description :: Server-side logic for managing grades
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var xlsxj = require('xlsx-2-json');
var path = require('path');
module.exports = {
	find:function(req, res, next){
        Student.find().populate('grade')
        .then(function(students){
            console.log('GradeController: find success!');
            res.send(200, students);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
    },
    upload:function(req, res, next){
        parseXlsx()
        .then(processData)
        .then(function(result){
            console.log('GradeController: upload success');
            res.send(200, result);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function parseXlsx(){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload(function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }else if(path.extname(uploadFiles[0].filename) != '.xls' && path.extname(uploadFiles[0].filename) != '.xlsx'){
                        reject([{name:'uploadGradeError', message:'Invalid file...'}]);
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
        /*****************************************/
        function processData(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(dataLoop);
                setTimeout(function() {
                    resolve(data);
                }, 1000);

                function dataLoop(item, index, array){
                    //get one item from xlsx upload

                    fetchData(array[index])
                    .then(getAssessmentClass)
                    .then(populateProgramSopi)
                    .then(pluginGrade)
                    .then(createUpdateStudent)
                    .then(giveGrades)
                    .then(function(result){
                        array[index] = result;
                    }).catch(function(err){
                        var setUpGradeError = [{name:'setUpGradeError', message:'An Error occured while formatting the data', error:err}];
                        console.log(setUpGradeError);
                    })

                    function fetchData(data){
                        var promise = new Promise(function(resolve, reject){
                            resolve(data);
                        })
                        return promise;
                    }
                    function getAssessmentClass(data){
                        var promise = new Promise(function(resolve, reject){
                            AssessmentClass.find({class:req.body.classId}).populate('assessment').then(function(assessmentClass){
                                if(assessmentClass.length !== 0){
                                    data.assessmentClass = assessmentClass;
                                    resolve(data);
                                }else{
                                    var assessmentClassFindError = [{error:'assessmentClassFindError', message:'Invalid Class id'}];
                                    reject(assessmentClassFindError);
                                }
                            }).catch(function(err){
                                reject(err);
                            })
                        })
                        return promise;
                    } // getAssessmentClass()

                    function populateProgramSopi(data){
                        var promise = new Promise(function(resolve, reject){
                            data.assessmentClass.forEach(sopi);
                            setTimeout(function(){
                                resolve(data);
                            }, 500)
                            function sopi(item, index, array){
                                ProgramSopi.find({id:array[index].assessment.programSopi})
                                .populate('sopi')
                                .then(function(programSopi){
                                    if(programSopi.length !== 0){
                                        array[index].assessment.programSopi = programSopi[0]
                                    }else{
                                        console.log('Invalid programSopi');
                                    }
                                }).catch(function(err){
                                    console.log(err);
                                })
                            }
                        })
                        return promise;
                    } //populateProgramSopi()

                    function pluginGrade(data){
                        var promise = new Promise(function(resolve, reject){
                            const myData = data;
                            data.assessmentClass.forEach(grade);
                            setTimeout(function(){
                                resolve(data);
                            },600)
                            function grade(item, index, array){
                                //console.log(array[index].assessment.programSopi.sopi.sopiCode);
                                array[index].grade = data[array[index].assessment.programSopi.sopi.sopiCode];
                            }
                        })
                        return promise;
                    } //pluginGrade() //pluginGrade()

                    function createUpdateStudent(data){
                        var promise = new Promise(function(resolve, reject){
                            Student.find({studentNumber:data['STUDENT NUMBER']}).then(function(student){
                                if(student.length === 0){
                                    Student.create({studentNumber:data['STUDENT NUMBER'], program:req.body.program, lastname:data['STUDENT LASTNAME'], firstname:data['STUDENT FIRSTNAME']})
                                        .then(function(student){
                                            data.student = student;
                                            ClassStudent.find({student:student.id, class:req.body.classId}).then(function(enrollee){
                                                if(enrollee.length === 0){
                                                    ClassStudent.create({student:student.id, class:req.body.classId}).then(function(enrolled){
                                                        
                                                        resolve(data);
                                                    }).catch(function(err){
                                                        reject(err);
                                                    })
                                                }else{
                                                    ClassStudent.update({student:student.id, class:req.body.classId},{student:student.id, class:req.body.classId}).then(function(enrolled){
                                                        
                                                        resolve(data);
                                                    })
                                                }
                                            }).catch(function(err){
                                                reject(err);
                                            })
                                        }).catch(function(err){
                                            reject(err);
                                        })
                                }else{
                                    data.student = student[0];
                                    Student.update({id:student[0].id},{studentNumber:data['STUDENT NUMBER'], program:req.body.program, lastname:data['STUDENT LASTNAME'], firstname:data['STUDENT FIRSTNAME']}).then(function(student){
                                        
                                        ClassStudent.find({student:student[0].id, class:req.body.classId}).then(function(enrollee){
                                                if(enrollee.length === 0){
                                                    ClassStudent.create({student:student[0].id, class:req.body.classId}).then(function(enrolled){
                                                        
                                                        resolve(data);
                                                    }).catch(function(err){
                                                        reject(err);
                                                    })
                                                }else{
                                                    ClassStudent.update({student:student[0].id, class:req.body.classId},{student:student[0].id, class:req.body.classId}).then(function(enrolled){
                                                        
                                                        resolve(data);
                                                    })
                                                }
                                            }).catch(function(err){
                                                reject(err);
                                            })
                                    }).catch
                                }
                            }).catch(function(err){
                                reject(err);
                            })
                        })
                        return promise;
                    } //createUpdateStudent()

                    function giveGrades(data){
                        var promise = new Promise(function(resolve,reject){
                            var myData = data;
                            data.assessmentClass.forEach(grade)
                            setTimeout(function(){
                                resolve(data);
                            }, 200)
                            function grade(item, index, array){
                                Student.findOne({studentNumber:myData['STUDENT NUMBER']}).then(function(student){
                                    Grade.find({student:student.id, assessment:array[index].assessment.id}).then(function(gradeRecord){
                                        if(gradeRecord.length === 0){
                                            Grade.create({student:student.id, assessment:array[index].assessment.id,programSopi:array[index].assessment.programSopi.id, grade:array[index].grade}).then(function(grade){
                                                array[index].grade = grade;
                                            }).catch(function(err){
                                                reject(err);
                                            })
                                        }else{
                                            Grade.update({student:student.id, assessment:array[index].assessment.id},{student:student.id, assessment:array[index].assessment.id,programSopi:array[index].assessment.programSopi.id, grade:array[index].grade})
                                                .then(function(grade){
                                                    console.log('update grade success!');
                                                array[index].grade = grade[0]
                                            }).catch(function(err){
                                                    //console.log('update grade failed');
                                                    console.log(err);
                                                reject(err);
                                            })
                                        }
                                    }).catch(function(err){
                                        reject(error);
                                    })
                                }).catch(function(err){
                                    reject(err);
                                })
                            }
                        })
                        return promise;
                    } //giveGrades()
                                    
                }// dataLoop()

            })
            return promise;// processData()
        }
        /*****************************************/
    },
    statussummary:function(req, res, next){
        Assessment.find()
        .populate('grade')
        .then(sortByProgram)
        .then(function(result){
            console.log('GradeController: statussummary success');
            setTimeout(function() {
                res.send(200, result);
            }, 300);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function sortByProgram(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    che:[],
                    ce:[],
                    cpe:[],
                    ece:[],
                    ie:[],
                    mem:[],
                    me:[]
                }

                data.forEach((item, index, array) => {
                    switch(item.program){
                        case 1:
                            newData.che.push(array[index]);
                            break;
                        case 2:
                            newData.ce.push(array[index]);
                            break;
                        case 3:
                            newData.cpe.push(array[index]);
                            break;
                        case 4:
                            newData.ece.push(array[index]);
                            break;
                        case 5:
                            newData.ie.push(array[index]);
                            break;
                        case 6:
                            newData.mem.push(array[index]);
                            break;
                        case 7:
                            newData.me.push(array[index]);
                            break;
                        default:
                            console.log("Invalid Program");
                    }
                });
                setTimeout(function(){
                    resolve(newData);
                }, 200);
            })
            return promise;
        }
    },
    statusperprogram:function(req,res,next){
        Assessment.find({program:req.body.program})
        .populate('grade')
        .populate('programSopi')
        .then(populateProgramSopi)
        .then(sortByCycle)
        .then(function(result){
            console.log('GradeController: statusperprogram success');
            setTimeout(function(){
                res.send(200, result);
            }, 500)
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function populateProgramSopi(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    ProgramSopi.findOne({id:item.programSopi.id})
                    .populate('sopi')
                    .then(function(result){
                        item.programSopi = result;
                    }).catch(function(err){
                        console.log(err);
                    })
                })
                setTimeout(function(){
                    resolve(data);
                }, 200)
            })
            return promise;
        }

        function sortByCycle(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    cycle1:[],
                    cycle2:[],
                    cycle3:[],
                    cycle4:[],
                    cycle5:[]
                }
                data.forEach((item, index, array) => {
                    switch(item.assessmentCycle){
                        case 1:
                            newData.cycle1.push(item);
                            break;
                        case 2:
                            newData.cycle2.push(item);
                            break;
                        case 3:
                            newData.cycle3.push(item);
                            break;
                        case 4:
                            newData.cycle4.push(item);
                            break;
                        case 5:
                            newData.cycle5.push(item);
                            break;
                        default:
                            console.log("Invalid Cycle.");
                    }
                })
                setTimeout(function(){
                    resolve(newData);
                }, 200)
            })
            return promise;
        }
    },
    statusperstudent:function(req, res, next){
        Student.find()
        .then(populateSopi)
        .then(populateGradePerStudent)
        //.then(sortByProgram)
        .then(function(result){
            setTimeout(function() {
                res.send(200, result);
                console.log("GradeController: statusperstudent success");
            }, 500);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function populateSopi(data){
            let newData = [];
            var promise = new Promise(function(resolve, reject){
                //data represent 1 student
                data.forEach((item, index, array) => {
                    var student = {
                        program:item.program,
                        studentNumber:item.studentNumber,
                        lastname:item.lastname,
                        firstname:item.firstname,
                        id:item.id,
                        grade:[]
                    }
                    ProgramSopi.find({program:item.program})
                    .populate('sopi')//need to be sorted
                    .then(populateProgramSopi)
                    .then(populateGradePerStudent)
                    .catch(function(err){
                        console.log(err);
                    })
                    newData.push(student);

                    //functions for each student data
                    function populateProgramSopi(data){
                        var promise = new Promise(function(resolve, reject){
                            data.forEach((item1, index1, array1) => {
                                var grade = {
                                    sopi:item1.sopi.sopiCode,
                                    programSopi:item1.id,
                                    grades:[],
                                    average:0
                                }
                                student.grade.push(grade);
                            })
                            resolve(data);
                        })
                        return promise;
                    }

                    
                })// end of data.forEach
                



                setTimeout(function(){
                    resolve(newData);
                }, 200)
            })
            return promise;
        }
        function populateGradePerStudent(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    item.grade.forEach((item1, index1, array1) => {
                        Grade.find({student:item.id,programSopi:item1.programSopi})
                        .populate('assessment')
                        .then(function(result){
                            result.forEach((item2, index2, array2) => {
                                item1.grades.push(item2.grade);
                            })
                        })
                        .then(function(){
                            let sum;
                            if(item1.grades.length === 0){
                                item1.average = 0;
                            }else{
                                sum = item1.grades.reduce(function(total, currentValue){
                                    return total + currentValue;
                                }, 0)
                                item1.average = sum / item1.grades.length;
                            }
                            
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    })
                })
                setTimeout(function() {
                    resolve(data);
                }, 500);
            })
            return promise;
        }
        function sortByProgram(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    che:[],
                    ce:[],
                    cpe:[],
                    ece:[],
                    ie:[],
                    mem:[],
                    me:[]
                }

                data.forEach((item, index, array) => {
                    switch(item.program){
                        case 1:
                            newData.che.push(array[index]);
                            break;
                        case 2:
                            newData.ce.push(array[index]);
                            break;
                        case 3:
                            newData.cpe.push(array[index]);
                            break;
                        case 4:
                            newData.ece.push(array[index]);
                            break;
                        case 5:
                            newData.ie.push(array[index]);
                            break;
                        case 6:
                            newData.mem.push(array[index]);
                            break;
                        case 7:
                            newData.me.push(array[index]);
                            break;
                        default:
                            console.log("Invalid Program");
                    }
                });
                setTimeout(function(){
                    resolve(newData);
                }, 400);
            })
            return promise;
        }
        
    }
};

