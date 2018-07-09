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
                <div>
                    <label>Your Mission: </label>
                    <label className={"directive"}>{this.getMissionName()}</label>
                </div>
                <div>
                    <label>What to do: </label>
                    <label className={"directive"}>{this.getMissionDesc()}</label>
                </div>
                <div className={"missionImg"}>
                    <img src={this.getMissionImgPath()}/>
                </div>
            </div>
        );
    }
}
