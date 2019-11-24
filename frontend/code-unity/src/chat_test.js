
// test qb functions
// var user = {
    //     id: 100104131,
    //     login: 'testuser',
    //     pass: 'testuser'
    // };
QB.init(79252, 'Ew2aXx4sYYYPgyw', 'da3XXU5JnqW2HdW');

QB.createSession({ login: "5daa6efd8805c462ef0d16e1", password: "5daa6efd8805c462ef0d16e1" }, (err, res) => {
    // console.log(res);
    
    if (res) {
        console.log(res);

        //console.log(res);
        // res.token == QB.token   ie just session token
        // 100109113
        // QBcreateGroup("test custom data");
        // QBgetGroupChats();
        // QB.chat.dialog.delete(['5dd22e60a28f9a4ae9cbb179'], { force: 1 }, function (err) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         QBdeleteProjectData(chat_id);
        //     }
        // });
    } else {
        console.log(err);
    }
});

function QBcreateProjectData(project_id, chat_id, name) {
    QB.data.create("Project", {project_id: project_id, chat_id: chat_id, name: name}, function(err, res){
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}
function QBcreateUserData(qb_id, cu_id, username) {
    QB.data.create("User", {qb_id: qb_id, cu_id: cu_id, username: username}, function(err, res){
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

function QBgetGroupChats() {
    const options = {
        'method': 'GET',
        'headers': {
            'QB-Token': QB.service.getSession().token
        }
    };

    return fetch('https://api.quickblox.com/chat/Dialog.json', options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

function QBgetUser(user_id) {
    const options = {
        'method': 'GET',
        'headers': {
            'QuickBlox-REST-API-Version': '0.1.0',
            'QB-Token': QB.service.getSession().token
        }
    }
    return fetch(`https://api.quickblox.com/users/by_login.json?login=${user_id}`, options)
        .then(response => { return response.json() })
        .then(json => {
            // console.log(json);
            return json.user;
        });
}

// function QBcreateGroup(name) {
//     const options = {
//         'method': 'POST',
//         'headers': {
//             'Content-Type': 'application/json',
//             'QB-Token': QB.service.getSession().token
//         },
//         'body': JSON.stringify({ type: 2, occupants_ids: [], name: name })
//     };

//     return fetch('https://api.quickblox.com/chat/Dialog.json', options)
//         .then(response => { return response.json() })
//         .then(json => {
//             console.log(json);
//             return json;
//         });
// }