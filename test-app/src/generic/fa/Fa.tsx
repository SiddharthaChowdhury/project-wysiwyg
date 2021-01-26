import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface IFa {
    icon: any;
    className?: string;
    title?: string;
    [index: string]: any
}

// TODO: Replace all <FontAwesomeIcon ... with <Fa .. in project
export const Fa: React.FC<IFa> = ({icon, className, title, ...rest}) => {
    return <FontAwesomeIcon title={title} icon={icon} className={`${className}`} {...rest}/>
};