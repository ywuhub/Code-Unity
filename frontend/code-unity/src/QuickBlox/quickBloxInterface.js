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
// for simplicity   login = password = user id 
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

// create group chat when group created
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
            return json;
        });
}

// get all group chats of current user
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
            return json;
        });
}

// get a group chat's messages      
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
    var toUpdateParams = {
        name: newName,
        push_all: { occupants_ids: newMembers },
        pull_all: { occupants_ids: byebye }
    };

    QB.chat.dialog.update(project_id, toUpdateParams, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

// change group chat name      call when project group name changes
function QBupdateGroupName(project_id, newName) {
    var toUpdateParams = {
        name: newName
    };

    QB.chat.dialog.update(project_id, toUpdateParams, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

// add members and remove members from group chat       call when project groups members are changed
// pass in empty list for members to not add/remove anyone
function QBupdateMembers(project_id, newMembers, byebye) {
    var toUpdateParams = {
        push_all: { occupants_ids: (newMembers || []) },
        pull_all: { occupants_ids: (byebye || []) } 
    };

    QB.chat.dialog.update(project_id, toUpdateParams, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
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

function QBleaveGroup(project_id) {
    QB.chat.dialog.delete([project_id], function (err) {
        if (err) {
            console.log("err: " + err);
        } else {
            console.log("deleted qb group");
        }
    });

    //     var dialogId = "53aac645535c12bd3b008a40";

    // var toUpdateParams = {
    //   name: "My school friends",
    //   pull_all: {occupants_ids: [curr_id]},
    // };

    // QB.chat.dialog.update(dialogId, toUpdateParams, function(err, res) {
    //   if (err) {
    //       console.log(err);
    //   } else {

    //   }
    // });
}

// send message to a chat       
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

export { QBcreateSession, QBinitChatUser, QBgetGroupChats, QBgetGroupChatHistory, QBcreateGroup, QBsendMessage, QBdeleteGroup, QBleaveGroup, QBupdateMembers, QBgetUser };