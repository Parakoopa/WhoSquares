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
                <label className={"title"}>Mission</label>
                <img alt="Mission"
                     className={"iconMission"}
                     src={"../../img/icons/Mission.png"}
                     width="30em" height="30em"
                />
                <div className={"missionBlock"}>
                    <label className={"directive"}>{this.getMissionDesc()}</label>
                    <div className={"missionImg"}>
                        <img src={this.getMissionImgPath()}/>
                    </div>
                </div>
            </div>
        );
    }
}
