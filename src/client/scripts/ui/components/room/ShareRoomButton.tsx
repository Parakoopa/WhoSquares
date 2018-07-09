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

        this.shareRoom = this.shareRoom.bind(this);
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
                <img alt="Share Room"
                     src="../../../../img/icons/Share.png"
                     width="15em" height="15em"
                />
            </button>
        </div>;
    }
}