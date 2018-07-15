import * as React from "react";

export interface IMissionInfoProps {
    mission: IMission;
}

export interface IMissionInfoState {
}

/**
 * Defines the MissionInfo-Component, that shows the Mission to the User.
 */
export class MissionInfo extends React.Component<IMissionInfoProps, IMissionInfoState> {

    /**
     * Gets the MissionName. Empty if Mission is null!
     *
     * @returns {string}
     */
    public getMissionName(): string {
        if (this.props.mission == null)
            return "";
        else
            return this.props.mission.name();
    }

    /**
     * Gets the MissionName. Empty if Mission is null!
     *
     * @returns {string}
     */
    public getMissionDesc(): string {
        if (this.props.mission == null)
            return "";
        else
            return this.props.mission.description();
    }

    /**
     * Gets the MissionImageSource. Empty if Mission is null!
     *
     * @returns {string}
     */
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
