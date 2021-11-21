function loggrt(log, type = 'log') {
    console[type](log)
}
export default loggrt;
// var pr = new Promise(function(dung, sai) {
//     sai()
// })
// pr.then(function() {
//     alert("đúng")
// }).catch(function() {
//     alert("sai")
// })

// function sleep(ms) {
//     return new Promise(function(dung, sai) {
//         setTimeout(dung, ms)
//     })
// }

// sleep(1000).then(function() {
//     console.log("1")
//     return sleep(1000);
// }).then(function() {
//     console.log("2")
//     return sleep(1000);
// }).then(function() {
//     console.log("3")
//     return sleep(1000);
// })
// var pro1 = new Promise(function(dung) {
//     setTimeout(function() {
//         dung([1, 2])
//     }, 2000)
// })
// var pro2 = new Promise(function(dung) {
//     setTimeout(function() {
//         dung([1, 2])
//     }, 5000)
// })

// Promise.all([pro1, pro2]).then(function(r1) {
//     console.log(r1[0].concat(r1[1]))
// })
// var users = [{
//         id: 1,
//         name: "phạm thành tú"
//     },
//     {
//         id: 2,
//         name: "phạm"
//     }

// ]
// var comments = [{
//         id: 1,
//         conten: 'ok nhé',
//         userid: 1
//     },
//     {
//         id: 2,
//         conten: 'ok nhé',
//         userid: 2
//     },

// ]

// function getComment() {
//     return new Promise(function(resole) {
//         setTimeout(function() {
//             resole(comments)
//         }, 1000)
//     })
// }
// getComment().then(function(comments) {
//     var userIds = comments.map(function(comment) {
//         return comment.userid;
//     })
//     return getUser(userIds).then(function(user) {
//         return user;
//     })
// }).then(function(user) {
//     return {
//         users: user,
//         comment: comments
//     }
// }).then(function(data) {
//     var viewscomment = document.getElementById('comment');
//     var html = '';
//     data.comment.forEach(function(item1) {
//         var user = data.users.find(function(item2) {
//             return item1.userid === item2.id;
//         })

//         html += `<li>${user.name}:${item1.conten} </li>`
//     })
//     viewscomment.innerHTML = html
// })

// function getUser(Userids) {
//     return new Promise(function(resole) {
//         var resutl = users.filter(function(user) {
//             return Userids.includegets(user.id)
//         })
//         resole(resutl)
//     })
// }

var url = 'http://localhost:3000/posts/';
var htmls = document.getElementById('comment');

function start() {
    add();
    getAllCourt(view);

}
start();

function getAllCourt(callback) {
    fetch(url).then(resutl => resutl.json()).then(callback)
}

function view(curses) {
    var html = curses.map(function(item) {
        return `<li class="item-${item.id}">${item.title} ------ ${item.author}
        <button onclick="detele(${item.id})" >xóa</button>
        <button onclick="update(${item.id})" >cập nhật</button>
        </li>
          
        `
    })
    console.log(html.join(''))
    htmls.innerHTML = html.join('');
}

function detele(id) {
    var option = {
        method: 'Delete',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url + '/' + id, option).then(function(items) {
        return items.json();
    }).then(function() {
        document.querySelector('.item-' + id).remove();
    });
}

function creat(data, callback) {

    var option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, option).then(function(items) {
        return items.json();
    }).then(callback);

}

function add() {

    var btn = document.querySelector('#btn')
    btn.onclick = function(e) {
        e.preventDefault();
        var title = document.querySelector('input[name="title"]').value;
        var author = document.querySelector('input[name="author"]').value;
        var hidden = document.querySelector('input[name="hidden"]').value;
        var dataform = {
            title: title,
            author: author
        }
        console.log(hidden.length)
        if (hidden.length = 0) {
            creat(dataform, function() {
                getAllCourt(view);
            });
        } else {
            editor(dataform, hidden, function() {
                getAllCourt(view);
                reset();
            })
        }


    }

}

function viewitem(id) {
    getid(id, function(item) {
        document.querySelector('input[name="title"]').value = item.title;
        document.querySelector('input[name="author"]').value = item.author;
        document.querySelector('input[name="hidden"]').value = item.id;
    })
}

function reset() {

    document.querySelector('input[name="title"]').value = '';
    document.querySelector('input[name="author"]').value = '';
    document.querySelector('input[name="hidden"]').value = '';

}

function getid(id, callback) {
    fetch(url + '/' + id).then(resutl => resutl.json()).then(callback)

}

function update(id, callback) {
    viewitem(id);


}

function editor(data, id, callback) {

    var option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url + '/' + id, option).then(function(items) {
        return items.json();
    }).then(function() {
        getAllCourt(view)
    }).then(callback).catch(alert('thất bại'));
}