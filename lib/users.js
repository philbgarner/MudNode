let users = {}
let map = new Map();

function getUsers() {
    return users;
}

function getUser(username) {
    for (let u in users) {
        if (users[u].username === username) {
            return users[u];
        }
    }
    return null;
}

function addUser(user) {
    users[user.uuid] = user;
}

function loadUsers(buffer) {
    users = JSON.parse(buffer.toString());
}

function setUserWs(userId, ws) {
    map.set(userId, ws);
}

function getUserWs(userId) {
    return map.get(userId);
}

function deleteUserWs(userId) {
    map.delete(userId);
}

function getUserWsList() {
    return map;
}

export { getUsers, getUser, addUser, loadUsers, setUserWs, getUserWs, deleteUserWs, getUserWsList }
export default { getUsers: getUsers, getUser: getUser, loadUsers: loadUsers, setUserWs: setUserWs, getUserWs: getUserWs, deleteUserWs: deleteUserWs, getUserWsList: getUserWsList }