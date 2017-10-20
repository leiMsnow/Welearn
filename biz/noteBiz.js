const app = getApp();
const Bmob = app.globalData.Bmob;

let createNote = (noteInfo,success, fail) => {
    let Note = Bmob.Object.extend('Note');
    let note = new Note();

    note.set('content', noteInfo.content);
    note.set('images',noteInfo.images);
    note.set('hobbyId', noteInfo.hobbyId);
    note.set('hobbyName', noteInfo.hobbyName);

    note.save(null, {
        success:(result) => {
            console.log("createNote-success-hobbyName: " + note.hobbyName);
            success();
        },
        error:() => {
            console.log('createNote-error: ' + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

module.exports = {
    createNote: createNote,
};

