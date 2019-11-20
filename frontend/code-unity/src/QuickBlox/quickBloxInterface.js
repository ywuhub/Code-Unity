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

// sign up user for chat        call when user signs up for codeunity  
// for simplicity   login = password = user id 
function QBinitChatUser(user_id, username) {
    const options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'QuickBlox-REST-API-Version': '0.1.0',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({
            user: {
                login: user_id,
                password: user_id,
                full_name: username
            }
        })
    }
    return fetch('https://api.quickblox.com/users.json', options)
        .then(response => { return response.json() })
        .then(json => {
            QBcreateUserData(json.user.id, user_id, username);
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

function QBgetUserData(qb_id) {
    const options = {
        'method': 'GET',
        'headers': {
            'QB-Token': QB.service.getSession().token
        }
    }
    return fetch(`https://api.quickblox.com/data/User.json?qb_id=${qb_id}`, options)
        .then(response => { return response.json() })
        .then(json => {
            return json.items[0];
        });
}

function QBgetProjectData(project_id) {
    const options = {
        'method': 'GET',
        'headers': {
            'QB-Token': QB.service.getSession().token
        }
    }
    return fetch(`https://api.quickblox.com/data/Project.json?project_id=${project_id}`, options)
        .then(response => { return response.json() })
        .then(json => {
            return json.items[0];
        });
}

// create group chat when group created
function QBcreateGroup(data) {
    const options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'QB-Token': QB.service.getSession().token
        },
        'body': JSON.stringify({ type: 2, occupants_ids: [], name: data })
    };

    return fetch('https://api.quickblox.com/chat/Dialog.json', options)
        .then(response => { return response.json() })
        .then(json => {
            QBcreateProjectData(json._id, data.project_id, data.name);
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
        })
    // .then()

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

function QBupdateGroupName(project_id, newName) {
    return QBgetProjectData(project_id)
        .then(project => {
            var toUpdateParams = { name: newName };
            QB.chat.dialog.update(project.chat_id, toUpdateParams, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    const project_json = JSON.parse(res.name.replace(/"=>"/g, '": "'));
                    QB.data.update("Project", {_id: project._id, name: project_json.name}, function(err, res){
                        if (err) {
                            console.log(err);
                            // window.location.reload();
                        } else {
                            // window.location.reload();
                        }
                    });
                }
            });
        })
}

function QBaddMembers(chat_id, newMembers) {
    var toUpdateParams = {
        push_all: { occupants_ids: (newMembers || []) },
    };

    QB.chat.dialog.update(chat_id, toUpdateParams, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

function QBremoveMembers(project_id, members) {
    QBgetProjectData(project_id)
        .then(project => {
            var toUpdateParams = {
                pull_all: { occupants_ids: members }
            };

            QB.chat.dialog.update(project.chat_id, toUpdateParams, function (err, res) {
                if (err) {
                    console.log(err);
                    window.location.reload();
                } else {
                    console.log(res);
                    window.location.reload();
                }
            });
        })
}

// delete group chat        call when project group is deleted      
function QBdeleteGroup(chat_id, project_id) {
    QB.chat.dialog.delete([chat_id], { force: 1 }, function (err) {
        if (err) {
            console.log(err);
            window.location.reload();
        } else {
            QBdeleteProjectData(chat_id, project_id);
        }
    });
}

function QBdeleteProjectData(chat_id, project_id) {
    QB.data.delete("Project", { chat_id: chat_id, project_id: project_id }, function (err, res) {
        if (err) {
            console.log(err);
            window.location.reload();
        } else {
            console.log("deleted qb group");
            window.location.reload();
        }
    });
}

function QBleaveGroup(project_id, user_id) {
    var toUpdateParams = {
        pull_all: { occupants_ids: [user_id] },
    };

    QB.chat.dialog.update(project_id, toUpdateParams, function (err, res) {
        if (err) {
            console.log(err);
            window.location.reload();
        } else {
            console.log("left qb chat");
            window.location.reload();
        }
    });
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

/**
 * 
 * @param {*} qb_id         quickblox id
 * @param {*} cu_id         code unity id
 * @param {*} username      user username
 */
function QBcreateUserData(qb_id, cu_id, username) {
    QB.data.create("User", { qb_id: qb_id, cu_id: cu_id, username: username }, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

/**
 * 
 * @param {*} project_id 
 * @param {*} chat_id       quickblox chat id
 * @param {*} name          project name
 */
function QBcreateProjectData(chat_id, project_id, name) {
    QB.data.create("Project", { project_id: project_id, chat_id: chat_id, name: name }, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

export { QBcreateSession, QBinitChatUser, QBgetGroupChats, QBgetGroupChatHistory, QBcreateGroup, QBsendMessage, QBdeleteGroup, QBleaveGroup, QBaddMembers, QBremoveMembers, QBgetUser, QBgetUserData, QBupdateGroupName, QBgetProjectData };