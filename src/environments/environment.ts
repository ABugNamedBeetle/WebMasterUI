export const environment = {
    production: false
};

export const WEB_SOCKET_LIST = new Map<string, boolean>([
    ["localhost:5000", true],
    ["localhost1:5000", false],
    ["localhost2ks:5000", false],
]);