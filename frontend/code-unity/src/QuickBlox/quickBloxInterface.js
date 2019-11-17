// QBcreateSession  QBinitChatUser  
// QBcreateGroup   QBdeleteGroup
// QBgetGroupChats     QBgetGroupChatHistory  
// QBupdateGroup   QBupdateGroupName   QBupdateMembers   
// QBsendMessage


// login = password  for simplicity
function QBcreateSession(login) {
    QB.createSession({ login: login, password: login }, (err, res) => {
        console.log(res);
        if (res) {
            // res.token == QB.token   ie just session token
            QB.chat.connect({ userId: res.user_id, password: login }, (err, roster) => {
                if (err) {
                    console.log(err);
                } else {
                }
            });
        } else {
            console.log(err);
        }
    });
}

// QB.chat.disconnect();

// var session = QB.service.getSession();
// if (session) {
//    session.token     // token used in below functions     
// }

// sign up user for chat        call when user signs up for codeunity  
// for simplicity   login = password
// QBinitChatUser(res.token, "realUser", "realUser");
function QBinitChatUser(login) {
    const options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'QuickBlox-REST-API-Version': '0.1.0',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({
            user: {
                login: login,
                password: login
            }
        })
    }
    return fetch('https://api.quickblox.com/users.json', options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

// create group chat when group created
// QBcreateGroup(res.token, "test");
function QBcreateGroup(name) {
    const options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({ type: 2, occupants_ids: [], name: name })
    };

    return fetch('https://api.quickblox.com/chat/Dialog.json', options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

// get all group chats of current user
// QBgetGroupChats(res.token);
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

// get a group chat's messages      
// QBgetGroupChatHistory(res.token, "5dcf8a83a28f9a783dcbb176");
function QBgetGroupChatHistory(chat_id) {
    const options = {
        'method': 'GET',
        'headers': {
            'QB-Token': QB.service.getSession().token
        }
    };
    return fetch(`https://api.quickblox.com/chat/Message.json?chat_dialog_id=${chat_id}`, options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json.items;
        });

    // OR
    // var params = { chat_dialog_id: chat_id, sort_desc: 'date_sent', limit: 100, skip: 0 };
    // QB.chat.message.list(params, function (err, messages) {
    //     if (messages) {
    //         console.log(messages);
    //     } else {
    //         console.log(err);
    //     }
    // });
}

// change group name, remove members, add members       call when project's groups name changes and members are also changed
// pass in empty list for members to not add/remove anyone
function QBupdateGroup(project_id, newName, newMembers, byebye) {
    // var toUpdateParams = {
    //     name: newName,
    //     push_all: { occupants_ids: newMembers },
    //     pull_all: { occupants_ids: byebye }
    // };

    // QB.chat.dialog.update(project_id, toUpdateParams, function (err, res) {
    //     if (err) {
    //         console.log(err);
    //     } else {

    //     }
    // }); OR 
    const options = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({ name: newName, push_all: newMembers, pull_all: byebye })
    };

    return fetch(`https://api.quickblox.com/chat/Dialog/${project_id}.json`, options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

// change group chat name      call when project group name changes
function QBupdateGroupName(project_id, newName) {
    const options = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({ name: newName })
    };

    return fetch(`https://api.quickblox.com/chat/Dialog/${project_id}.json`, options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

// add members and remove members from group chat       call when project groups members are changed
// pass in empty list for members to not add/remove anyone
function QBupdateMembers(project_id, newMembers, byebye) {
    const options = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({ push_all: newMembers, pull_all: byebye })
    };

    return fetch(`https://api.quickblox.com/chat/Dialog/${project_id}.json`, options)
        .then(response => { return response.json() })
        .then(json => {
            console.log(json);
            return json;
        });
}

// delete group chat        call when project group is deleted      
function QBdeleteGroup(project_id) {
    QB.chat.dialog.delete([project_id], { force: 1 }, function (err) {
        if (err) {
            console.log("err: " + err);
        } else {
            console.log("deleted qb group");
        }
    });
}

// send message to a chat       
// QBsendMessage(res.token, "5dcf8a83a28f9a783dcbb176", "test send msg");
function QBsendMessage(chat_id, message) {
    var params = {
        message: message,
        chat_dialog_id: chat_id,
        send_to_chat: "1"
    };

    QB.chat.message.create(params, function (err, res) {
        if (res) {
            console.log(res);
        } else {
            console.log(err);
        }
    });
}

export { QBcreateSession, QBinitChatUser, QBgetGroupChats, QBgetGroupChatHistory, QBcreateGroup, QBsendMessage };