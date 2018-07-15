import * as React from "react";

export interface ILogoutButtonProps {
}

export interface ILogoutButtonState {
}

/**
 * Component for Logout. Needs to get a logOutFunction at creating!
 */
export class LogoutButton extends React.Component<ILogoutButtonProps, ILogoutButtonState> {

    public static logOutFunction: () => void;

    private logout() {
        if ( LogoutButton.logOutFunction )
            LogoutButton.logOutFunction();
    }

    public render(): any {
        return <div className={"logout"}>
            <button className={"button"} onClick={this.logout}>Logout</button>
        </div>;
    }
}
