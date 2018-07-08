import * as React from "react";

export interface IMissionInfoProps {
    mission: IMission;
}

export interface IMissionInfoState {
}

export class MissionInfo extends React.Component<IMissionInfoProps, IMissionInfoState> {

    public getMissionName(): string {
        if (this.props.mission == null)
            return "";
        else
            return this.props.mission.name();
    }

    public getMissionDesc(): string {
        if (this.props.mission == null)
            return "";
        else
            return this.props.mission.description();
    }

    public getMissionImgPath(): string {
        if (this.props.mission == null)
            return "";
        else
            return this.props.mission.imgpath();
    }

    public render(): any {
        return (
            <div>
                <label>Mission: {this.getMissionName()}</label>
                <label>Desc: {this.getMissionDesc()}</label>
                <img src={this.getMissionImgPath()}/>
            </div>
        );
    }
}
