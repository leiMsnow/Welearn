const app = getApp();
const Bmob = app.globalData.Bmob;
const util = require('../utils/util.js');

let createNote = (noteInfo, success, fail) => {
    let Note = Bmob.Object.extend('Note');
    let note = new Note();

    note.set('content', noteInfo.content);
    note.set('image', noteInfo.image);
    note.set('hobbyId', noteInfo.hobbyId);
    note.set('hobbyName', noteInfo.hobbyName);
    note.set('dayStamp', util.formartTimestamp());
    note.set('openId', app.globalData.userInfo.openId);

    note.save(null, {
        success: (result) => {
            console.log("createNote-success-hobbyName: " + note.hobbyName);
            success();
        },
        error: (error) => {
            console.log('createNote-error: ' + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

let uploadFile = (filePath, success, fail) => {
    var name = util.formatFileName() + ".jpg";
    var file = new Bmob.File(name, filePath);
    file.save().then(function (res) {
        console.log('uploadFile: ' + res.url());

        if (res.url()) {
            success(res.url());
        } else {
            if (fail)
                fail();
        }

    }, function (error) {
        console.log('createNote-error: ' + error.code + " " + error.message);
        if (fail)
            fail();
    });
};

let getMyNoteCountByHobbyId = (hobbyId, success, fail) => {
    let Note = Bmob.Object.extend('Note');
    let noteQuery = new Bmob.Query(Note);
    noteQuery.equalTo('hobbyId', hobbyId);
    noteQuery.equalTo('openId', app.globalData.userInfo.openId);
    noteQuery.count({
        success: (count) => {
            success(count);
        },
        error: (error) => {
            console.log('getMyNoteCountByHobbyId-error: ' + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

module.exports = {
    createNote: createNote,
    uploadFile: uploadFile,
    getMyNoteCountByHobbyId: getMyNoteCountByHobbyId,
};