export class Utility {

    /**
     * MOVE INTO SOME NEW UTILITY CLASS
     * Generate Unique Identifier
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

        //
        // const ms = new Date().getTime();
        //
        // switch (ms % 10) {
        //     case 0: return "Bob";
        //     case 1: return "Stella";
        //     case 2: return "Marco";
        //     case 3: return "Tim";
        //     case 4: return "Alex";
        //     case 5: return "Robin";
        //     case 6: return "Udo";
        //     case 7: return "Freddy";
        //     case 8: return "Inge";
        //     case 9: return "Spongebob";
        //     default: return "MS-" + ms;
        // }
    }

}
