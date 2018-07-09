import * as React from "react";
import {IGameControlProps} from "./GameControl";
import {App} from "../../App";

export interface IShareRoomButtonProps {
    roomurl: string;
}

export interface IShareRoomButtonState {
    imgsource: string;
}

export class ShareRoomButton extends React.Component<IShareRoomButtonProps, IShareRoomButtonState> {

    constructor(props: IShareRoomButtonProps) {
        super(props);

        this.state = { imgsource: "../../../../img/icons/Share.png"};

        this.shareRoom = this.shareRoom.bind(this);
        this.changeImg = this.changeImg.bind(this);
    }

    private changeImg(mousein: boolean): any {
        let imgsource;
        if (mousein) {
            imgsource = "../../../../img/icons/Share_Hover.png";
        } else {
            imgsource = "../../../../img/icons/Share.png";
        }

        this.setState({imgsource});
        return null;
    }

    public shareRoom(event: any) {
        event.preventDefault();

        const el = document.createElement("textarea");
        el.value = this.props.roomurl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        App.showTextOnSnackbar("Room-URL copied to clipboard!");
    }

    public render(): any {
        return <div>
            <button className={"shareButton"} onClick={this.shareRoom}>
                <img alt="Who Squares?"
                     src={this.state.imgsource}
                     onMouseOver={this.changeImg(true)}
                     onMouseOut={this.changeImg(false)}
                     width="15em" height="15em"
                />
            </button>
        </div>;
    }
}
