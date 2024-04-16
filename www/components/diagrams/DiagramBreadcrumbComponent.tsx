import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {Breadcrumb} from "react-bootstrap";

interface DiagramBreadcrumbComponentProps{
    params: any;
}

const DiagramBreadcrumbComponent = (props: DiagramBreadcrumbComponentProps) => {

    return (
        <Breadcrumb>
            <Breadcrumb.Item href={`/${props.params.username}/diagrams`}>{
                props.params.username
            }</Breadcrumb.Item>
            <Breadcrumb.Item href={`/${props.params.username}/diagrams`}>Diagrams</Breadcrumb.Item>
            {
                props.params.diagramId &&
                <Breadcrumb.Item href={`/${props.params.username}/diagrams/${props.params.diagramId}`}>{
                    props.params.diagramId
                }</Breadcrumb.Item>
            }
            {
                props.params.diagramId &&
                <Breadcrumb.Item href={`/${props.params.username}/diagrams/${props.params.diagramId}/flows`}>
                    Flows
                </Breadcrumb.Item>
            }
            {
                props.params.flowId &&
                <Breadcrumb.Item href={`/${props.params.username}/diagrams/${props.params.diagramId}/flows/${props.params.flowId}`}>
                    {props.params.flowId}
                </Breadcrumb.Item>
            }
        </Breadcrumb>
    );

}

export default DiagramBreadcrumbComponent;