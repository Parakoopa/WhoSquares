// DAS HIER IST NUR EIN BEISPIEL. Bitte strukturiert das einigermaßen sinnvoll in den eigentlichen Tickets
// und packt das nicht einfach so untereinander...

  import {Grid} from "./Grid";
  import {bla} from "./test";

  export function main() {
    let textMessage = "warte auf server";
    let textElement: Phaser.Text = null;
    const grid: Grid = new Grid(8, 8, 40);

    const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
        preload() {
            // Center Game Canvas
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.refresh();

            // Load Grid
            game.load.image("gridTile", "./img/square32_grey.png");

        },
        create() {
            grid.CreateGrid(game, "gridTile");

            textElement = game.add.text(
                game.world.centerX,
                game.world.centerY,
                textMessage,
                { font: "32px Arial", fill: "#ff0044", align: "center" }
            );
            textElement.anchor.setTo(0.5, 3.5);
        },

        update() {
            textElement.text = textMessage;
        }
    });
    const socket = io();
    socket.on("connection", (resp: Response) => {
        const guid: string = resp.guid;
        textMessage = resp.response + ":\n" + guid;
        console.log(textMessage);
        bla();
    });

}
