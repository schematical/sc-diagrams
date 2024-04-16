import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import HeaderComponent from "../../components/HeaderComponent";

import {useParams} from "react-router-dom";

import {  DiagramFlow, putMapFlow} from "../../components/diagrams/util";
import { GQLService } from '../../services/GQLService';

interface NetworkMapFlowListPageState {
    loaded?: boolean;
    mapFlows?: DiagramFlow[];
    selectedMapFlow?: DiagramFlow;
}

const NetworkMapFlowListPage = () => {
    const params = useParams();

    const [state, setState] = useState<NetworkMapFlowListPageState>({});

    const refreshData = async () => {
        if (!params.username || !params.diagramId) {
            throw new Error("Missing `params`");
        }
        const res = (await GQLService.listDiagramFlow({
            parentUri: `${params.username}/diagrams/${params.diagramId}`
        })).Items;
        setState({
            ...state,
            loaded: true,
            mapFlows: res
        })
    }


    useEffect(() => {
        if (state.loaded) {
            return;
        }
     /*   const token = localStorage.getItem('accessToken');
        if (!token) {
            document.location.href = '/login';
        }*/
        refreshData();
    });
    async function onSave(event: any) {
        event.preventDefault();
        if(!state.selectedMapFlow) throw new Error("Missing `state.selectedMapFlow`")
        const res = (await GQLService.createDiagramFlow(state.selectedMapFlow));
        window.location.href = `/${state.selectedMapFlow?.username}/diagrams/${state.selectedMapFlow.diagramId}/flows/${state.selectedMapFlow?._id}/swimlane`;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedMapFlow = state.selectedMapFlow;
        if (!selectedMapFlow) throw new Error("Missing  `state.selectedMapFlow`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('MapFlowId'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedMapFlow._id = value.toLowerCase()
                    .replace(' ', '-')
                    .replace(/[^a-zA-Z0-9\-]/g, '');
                break;
        }

        (selectedMapFlow as any)[event.target.name] = value;
        console.log("State.selectedMapFlow:", state.selectedMapFlow);
        setState({
            ...state,
            selectedMapFlow
        });
    }
    const onNewMapFlowClick = (event: any) => {
        event.preventDefault();
        setState({
            selectedMapFlow: {
                diagramId: params.diagramId as string,
                parentUri: `${params.username}/diagrams/${params.diagramId}`,
                _id: 'mf-' + Math.floor(Math.random() * 99999),
                name: "My Flow Chart " + Date.now().toString(),
                username: params.username as string,
                data: {
                    events: [],
                    interactions: []
                }
            }
        })
    }
    return (
        <>
            <TopbarComponent/>
            <HeaderComponent/>

            <div className="container-fluid background-gray-light pt80 pb80" id="topSlide2">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h3><span>Flow Charts</span></h3>
                            {
                                !state.selectedMapFlow &&
                                <button type="button" className="btn btn-primary" onClick={onNewMapFlowClick}>New MapFlow</button>
                            }
                            {
                                state.selectedMapFlow &&
                                <form onSubmit={onSave}>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Name</label>
                                        <input name="name" className="form-control" value={state.selectedMapFlow.name}  onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Flow Id</label>
                                        <input name="FlowId" className="form-control" value={state.selectedMapFlow?._id} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Description</label>
                                        <input name="description" className="form-control" value={state.selectedMapFlow.description}  onChange={handleChange} />
                                    </div>

                                    <button type="submit" className="btn btn-primary" >Save</button>
                                </form>
                            }
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Username</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    state.mapFlows &&
                                    state.mapFlows.map((mapFlow: DiagramFlow) => {
                                        return <tr>
                                            <th scope="row">
                                                {mapFlow.username}
                                            </th>
                                            <td>
                                                {mapFlow._id}
                                            </td>
                                            <td>
                                                {mapFlow.name}
                                            </td>
                                            <td>
                                                <a
                                                    href={`/${mapFlow.username}/diagrams/${mapFlow.diagramId}/flows/${mapFlow._id}`}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa fa-map-o" aria-hidden="true"></i>
                                                </a>
                                                <a
                                                    href={`/${mapFlow.username}/diagrams/${mapFlow.diagramId}/flows/${mapFlow._id}/swimlane`}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa fa-ship" aria-hidden="true"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



            <FooterComponent/>
        </>
    );


}

export default NetworkMapFlowListPage;