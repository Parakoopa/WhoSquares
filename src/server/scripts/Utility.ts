export class Utility {

    /**
     * Generate Unique Identifier
     * (Not guaranteed but sufficient for now)
     * @returns {string}
     * @constructor
     */
    public static getGUID(): string {
        // src: https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

}
