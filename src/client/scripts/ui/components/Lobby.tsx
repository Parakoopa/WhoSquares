import * as React from "react";
import {Link} from "react-router-dom";
import {Routes} from "../Routes";
import {App} from "../App";
import {GameManager} from "../../game/GameManager";

export interface ILobbyProps {
    username: string;
}

export interface ILobbyState {
    roomlist: string[];
    roomnameNew: string;
}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {

    constructor(props: ILobbyProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {roomlist: [], roomnameNew: "Room"};

        App._socket.emit("joinLobby");
        App._socket.once("joinLobby", (resp: IJoinLobbyEvent) => {
            this.setState({roomlist : resp.rooms});
        });
    }

    private getGameURL(roomid: string) {
        return Routes.linkToGame(this.props.username, roomid);
    }

    private handleSubmit(event: any) {
        event.preventDefault();

        this.createRoom();
    }

    private createRoom() {
        window.location.href = Routes.linkToGameHREF( this.props.username, this.state.roomnameNew);
    }

    private validateForm() {
        return this.state.roomnameNew.length > 0;
    }

    private handleChange(event: any) {
        this.setState({roomnameNew: event.target.value});
    }

    public componentDidMount() {
    }

    public render() {

        let roomlist;
        if (this.state.roomlist === null || this.state.roomlist.length !== 0 ) {
            roomlist = this.state.roomlist.map((name, i) =>
                <div key={i}>
                    <Link to={this.getGameURL(name)}>
                        <button className={"button"}>
                            {name}
                        </button>
                    </Link>
                </div>
            );
        } else {
            roomlist = <h2>No rooms...</h2>;
        }

        const inputStyle = {
            "width": "fit-content",
            "padding": "5px",
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "font-size": "0.75em",
            "color": "White",
            "text-align": "center"
        };

        const submitStyle = {
            "backgroundColor": "#162856",
            "border": "3px solid #7887AB",
            "font-size": "0.75em",
            "color": "White",
            "margin": "5px",
            "padding-top": "5px",
            "text-align": "center"
        };

        return <div className={"content"}>
            <h3 className={"description"}> Available Rooms: </h3>
            {roomlist}
            <form onSubmit={this.handleSubmit}>
                <h3>CREATE ROOM</h3>
                <input style={inputStyle} type="text" value={this.state.roomnameNew} onChange={this.handleChange}/>
                <br/>
                <input style={submitStyle} type="submit" disabled={!this.validateForm()} value="Create"/>
            </form>
        </div>;
    }
}
