QB.init(79252, 'Ew2aXx4sYYYPgyw', 'da3XXU5JnqW2HdW');

// test qb functions
// var user = {
//     id: 100104131,
//     login: 'testuser',
//     pass: 'testuser'
// };

// QB.createSession({ login: "realUser", password: "realuser" }, (err, res) => {
//     // console.log(res);
//     if (res) {
//         // res.token == QB.token   ie just session token
//         // 100109113
//         // QBcreateGroup("test custom data");
//     } else {
//         console.log(err);
//     }
// });


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