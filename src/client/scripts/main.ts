// DAS HIER IST NUR EIN BEISPIEL. Bitte strukturiert das einigermaßen sinnvoll in den eigentlichen Tickets
// und packt das nicht einfach so untereinander...

import {bla} from "./test";

export function main() {
    let textMessage = "warte auf server";

    let textElement: Phaser.Text = null;

    const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
        create() {
            textElement = game.add.text(
                game.world.centerX,
                game.world.centerY,
                textMessage,
                { font: "65px Arial", fill: "#ff0044", align: "center" }
            );
            textElement.anchor.setTo(0.5, 0.5);
        },

        update() {
            textElement.text = textMessage;
        }
    });

    const socket = io();
    socket.on("connection", function(resp: Response) {
        const guid: string = resp.guid;
        textMessage = resp.response + ":\n" + guid;
        console.log(textMessage);
        bla();
    });
}
