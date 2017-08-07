/**
 * SopiController
 *
 * @description :: Server-side logic for managing sopis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var xlsxj = require('xlsx-2-json');
var path = require('path');
module.exports = {
	find:function(req, res, next){
        ProgramSopi.find()
        .populate('sopi')
        .then(populateSo)
        .then(function(sopi){
            console.log('SopiController: find success');
            res.send(200, sopi);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function populateSo(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    So.findOne({id:item.sopi.so}).then(function(result){
                        item.sopi.so = result;
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
    },
    create:function(req, res, next){
        so(req.body)
        .then(sopi)
        .then(programSopi)
        .then(function(data){
            console.log('SopiController: create success');
            res.send(200, data)
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function so(data){
            var promise = new Promise(function(resolve, reject){
                So.find({soCode:data.soCode}).then(function(soResult){
                    if(soResult.length === 0){
                        So.create({soCode:data.soCode}).then(function(so){
                            data.so = so;
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
                        })
                    }else{
                        So.update({id:soResult[0].id}, {soCode:data.soCode}).then(function(so){
                            data.so = so[0];
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
                        })
                    }
                }).catch(function(err){
                    reject(err);
                })
            })
            return promise;
        }
        function sopi(data){
            var promise = new Promise(function(resolve, reject){
                Sopi.find({sopiCode:data.sopiCode}).then(function(sopiResult){
                    if(sopiResult.length === 0){
                        Sopi.create({sopiCode:data.sopiCode, so:data.so.id}).then(function(sopi){
                            data.sopi = sopi;
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
                        })
                    }else{
                        Sopi.update({id:sopiResult[0].id}, {sopiCode:data.sopiCode, so:sopiResult[0].so}).then(function(sopi){
                            data.sopi = sopi[0];
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
                        })
                    }
                }).catch(function(err){
                    reject(err);
                })
            })
            return promise;
        }
        function programSopi(data){
            console.log(data);
            var promise = new Promise(function(resolve, reject){
                ProgramSopi.find({sopi:data.sopi.id, program:data.program}).then(function(programSopiResult){
                    if(programSopiResult.length === 0){
                        ProgramSopi.create({sopi:data.sopi.id, program:data.program, description:data.description}).then(function(programSopi){
                            data.programSopi = programSopi;
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
                        })
                    }else{
                        ProgramSopi.update({id:programSopiResult[0].id},{program:data.program, sopi:data.sopi.id, description:data.description}).then(function(programSopi){
                            data.programSopi = programSopi[0];
                            resolve(data);
                        }).catch(function(err){
                            reject(err);
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
        parseXlsx().then(processData).then(function(data){
            console.log('SopiController: upload success');
            setTimeout(function(){
                res.send(200, data);
            },500)
        }).catch(function(err){
            console.log(err);
            res.send(200, err);
        })

        function parseXlsx(){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload(function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }else if(path.extname(uploadFiles[0].filename) != '.xlsx' && path.extname(uploadFiles[0].filename)!= '.xls'){
                        reject([{name:'uploadSopiError', message:'Invalid file..'}]);
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
                },500);

                function saveData(item, index, array){
                    var data = array[index];
                    so(data)
                    .then(sopi)
                    .then(programSopi)
                    .then(function(sopi){
                        array[index] = sopi;
                    }).catch(function(err){
                        console.log(err);
                    })
                }

                function so(data){
                    var promise = new Promise(function(resolve, reject){
                        So.find({soCode:data['SO']}).then(function(soResult){
                            if(soResult.length == 0){
                                console.log(soResult);
                                So.create({soCode:data['SO']}).then(function(so){
                                    data.so = so;
                                    resolve(data);
                                }).catch(function(err){
                                    console.log(err);
                                })
                            }else{
                                So.update({id:soResult[0].id}, {soCode:data['SO']}).then(function(so){
                                    data.so = so[0];
                                    resolve(data);
                                }).catch(function(err){
                                    console.log(err);
                                })
                            }
                        }).catch(function(err){
                            console.log(err);
                        })
                    })
                    return promise;
                }
                function sopi(data){
                    var promise = new Promise(function(resolve, reject){
                        Sopi.find({sopiCode:data['SOPI']}).then(function(sopiResult){
                            if(sopiResult.length === 0){
                                Sopi.create({sopiCode:data['SOPI'], so:data.so.id}).then(function(sopi){
                                    data.sopi = sopi;
                                    resolve(data);
                                }).catch(function(err){
                                    reject(err);
                                })
                            }else{
                                Sopi.update({id:sopiResult[0].id}, {sopiCode:data['SOPI'], so:sopiResult[0].so}).then(function(sopi){
                                    data.sopi = sopi[0];
                                    resolve(data);
                                }).catch(function(err){
                                    reject(err);
                                })
                            }
                        }).catch(function(err){
                            reject(err);
                        })
                    })
                    return promise;
                }
                function programSopi(data){
                    console.log(data);
                    var promise = new Promise(function(resolve, reject){
                        ProgramSopi.find({sopi:data.sopi.id, program:req.body.program}).then(function(programSopiResult){
                            if(programSopiResult.length === 0){
                                ProgramSopi.create({sopi:data.sopi.id, program:req.body.program, description:data['DESCRIPTION']}).then(function(programSopi){
                                    data.programSopi = programSopi;
                                    resolve(data);
                                }).catch(function(err){
                                    reject(err);
                                })
                            }else{
                                ProgramSopi.update({id:programSopiResult[0].id},{program:req.body.program, sopi:data.sopi.id, description:data['DESCRIPTION']}).then(function(programSopi){
                                    data.programSopi = programSopi[0];
                                    resolve(data);
                                }).catch(function(err){
                                    reject(err);
                                })
                            }
                        }).catch(function(err){
                            reject(err);
                        })
                    })
                    return promise;
                }

            })

            return promise;
        }
    }
};

