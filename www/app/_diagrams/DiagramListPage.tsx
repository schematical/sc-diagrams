import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import HeaderComponent from "../../components/HeaderComponent";
import axios from "axios";

import {useParams} from "react-router-dom";

import {getJwt} from "../../Util";
import {Diagram, getDiagrams, putDiagram} from "../../components/diagrams/util";
import {GQLService} from "../../services/GQLService";
interface DiagramListPageState {
    loaded?: boolean;
    diagrams?: Diagram[];

    selectedDiagram?: Diagram;
}

const DiagramListPage = () => {
    const params = useParams();

    const [state, setState] = useState<DiagramListPageState>({});

    const refreshData = async () => {
        if (!params.username) {

            return
        }
        const res = (await GQLService.listDiagram({
            parentUri: params.username
        }));
        setState({
            loaded: true,
            ...state,
            diagrams: res.Items
        })
    }


    useEffect(() => {
        if (state.loaded) {
            return;
        }
        /*const token = localStorage.getItem('accessToken');
        if (!token) {
            document.location.href = '/login';
        }*/
        refreshData();
    });
    async function onSave(event: any) {
        if (!state.selectedDiagram) throw new Error("Missing `state.selectedDiagram`");
        event.preventDefault();
        const res = (await GQLService.createDiagram(state.selectedDiagram));
        window.location.href = `/${state.selectedDiagram?.parentUri}/diagrams/${state.selectedDiagram?._id}`;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagram = state.selectedDiagram;
        if (!selectedDiagram) throw new Error("Missing  `state.selectedDiagram`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('_id'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedDiagram._id = value.toLowerCase()
                    .replace(' ', '-')
                    .replace(/[^a-zA-Z0-9\-]/g, '');
                break;
        }

        (selectedDiagram as any)[event.target.name] = value;
        console.log("State.selectedDiagram:", state.selectedDiagram);
        setState({
            ...state,
            selectedDiagram
        });
    }
    const onNewDiagramClick = (event: any) => {
        event.preventDefault();
        setState({
            selectedDiagram: {
                _id: 'diagram-' + Math.floor(Math.random() * 99999),
                name: "My Diagram " + Date.now().toString(),
                username: params.username as string,
                parentUri: params.username as string,
                data: {
                    tiles: [],
                    resources: []
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
                            <h3>Diagrams</h3>
                            {
                                !state.selectedDiagram &&
                                <button type="button" className="btn btn-primary" onClick={onNewDiagramClick}>New Diagram</button>
                            }
                            {
                                state.selectedDiagram &&
                                <form onSubmit={onSave}>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Name</label>
                                        <input name="name" className="form-control" value={state.selectedDiagram.name}  onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Diagram Id</label>
                                        <input name="_id" className="form-control" value={state.selectedDiagram?._id} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Description</label>
                                        <input name="description" className="form-control" value={state.selectedDiagram.description}  onChange={handleChange} />
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
                                    state.diagrams &&
                                    state.diagrams.map((diagram: Diagram) => {
                                        return <tr>
                                            <th scope="row">
                                                {diagram.username}
                                            </th>
                                            <td>
                                                {diagram._id}
                                            </td>
                                            <td>
                                                {diagram.name}
                                            </td>
                                            <td>
                                                <a href={`/${diagram.parentUri}/diagrams/${diagram._id}`} >
                                                    View
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

export default DiagramListPage;