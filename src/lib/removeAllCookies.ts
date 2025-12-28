function deleteAllCookies() {
    let allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++) {
        let cookie = allCookies[i].trim();
        let name = cookie.split('=');
        document.cookie = name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
    }
}

export {deleteAllCookies};