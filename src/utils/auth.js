import Cookie from 'js-cookie';

const Token = 'token';
const User = 'user';
const UserName = 'user-name'

export function getToken(){
    return Cookie.get(Token);
}

export function setToken(token){
    return Cookie.set(Token,token)
}

export function removeToken(){
    return Cookie.remove(Token)
}

export function getUser() {
    return Cookie.get(User)
}

export function setUser(user) {
    return Cookie.set(User, user)
}

export function removeUser() {
    return Cookie.remove(User)
}

export function getUserName() {
    return Cookie.get(UserName)
}

export function setUserName(username) {
    return Cookie.set(UserName, username)
}

export function removeUserName() {
    return Cookie.remove(UserName)
}