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
//         var params = {
//             message: "Hey Me?",
//             chat_dialog_id: '5dcf8a83a28f9a783dcbb176',
//             send_to_chat: "1",
//         };
//         QB.chat.message.create(params, function (err, res) {
//             if (res) {
//                 var dialogId = "5dcf8a83a28f9a783dcbb176";
//                 var params = { chat_dialog_id: dialogId, sort_desc: 'date_sent', limit: 100, skip: 0 };
//                 QB.chat.message.list(params, function (err, messages) {
//                     if (messages) {
//                         console.log(messages);
//                     } else {
//                         console.log(err);
//                     }
//                 });
//             } else {
//                 console.log(err);
//             }
//         });
//         QB.chat.connect({ userId: res.user_id, password: "realuser" }, (err, roster) => {
//             if (err) {
//                 console.log(err);
//             } else {
//             }
//         });
//     } else {
//         console.log(err);
//     }
// });

