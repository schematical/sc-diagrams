import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import HeaderComponent from "../../components/HeaderComponent";
import axios from "axios";

import {useParams} from "react-router-dom";

import {getJwt} from "../../Util";
import {Diagram} from "../../components/diagrams/util";
interface NetworkMapEditPageState{
    loaded?: boolean;
    diagram?: Diagram
}
const NetworkMapEditPage =  () => {
    const params = useParams();

    const [state, setState] = useState<NetworkMapEditPageState>({

    });

    const refreshData = async () => {
        if (!params.diagramId) {
            setState({
                loaded: true,
                // ...state,
                diagram: {
                    _id: "",
                    username: params.username as string,
                    data: {
                        tiles: [],
                        resources: []
                    }
                }
            })
            return
        }
        const res = await axios.get(  `${process.env.REACT_APP_SERVER_URL}/api/${params.username}/diagrams/${params.diagramId}`);
        setState({
            loaded: true,
           // ...state,
            diagram: res.data
        })
    }
/*    const setValue = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, contextStore?: ContextStore) => {
        const NetworkMap = state.NetworkMap;
        NetworkMap.Body = value;
        console.log("setValue:", state.NetworkMap);
        setState({
            ...state,
            post
        });
    }*/
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const diagram = state.diagram;
        (diagram as any)[event.target.name] = event.target.value;
        console.log("State.NetworkMap:", state.diagram);
        setState({
            ...state,
            diagram
        });
    }
    const onSave = async (event: { preventDefault: () => void; }) => {
        if (!state.diagram) throw new Error("Missing `state.diagram`");
        event.preventDefault();
        const token = await getJwt();
        const res = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/${params.username}/diagrams/${state.diagram._id}`,
            state.diagram,
            {
                headers: {
                    Authorization: token
                }
            }
        );
        setState({
            loaded: true,
            // ...state,
            diagram: res.data
        })
    }



    useEffect( () => {
        if(state.loaded) {
            return;
        }
        const token = localStorage.getItem('accessToken');
        if(!token) {
            document.location.href = '/';
        }
        refreshData();
    });


    return (
        <div>
            <TopbarComponent />
            <HeaderComponent />
            { state.diagram &&
                <div className="container-fluid pt80 pb80">
                    <div className="container">
                        <form onSubmit={onSave}>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Diagram Id</label>
                                <input name="DiagramId" className="form-control" value={state.diagram._id} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Title</label>
                                <input name="name" className="form-control" value={state.diagram.name}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Description</label>
                                <input name="description" className="form-control" value={state.diagram.description}  onChange={handleChange} />
                            </div>

                            {/*<div className="form-group">
                                <label htmlFor="exampleInputEmail1">ImageSRC</label>
                                <input name="imageSrc" className="form-control" type='text' value={state.NetworkMap?.imageSrc}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">ImageSRC File Upload</label>
                                <input name="imageSrc" className="form-control" type='file'  onChange={handleUploadChange} />
                            </div>
                            <hr />
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">JSON SRC</label>
                                <input name="jsonSrc" className="form-control" type='text' value={state.NetworkMap.jsonSrc}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">jsonSrc File Upload</label>
                                <input name="jsonSrc" className="form-control" type='file'  onChange={handleUploadChange} />
                            </div>
*/}
                            {/*<div className="form-group">
                                <MDEditor
                                    value={state.post.Body}
                                    onChange={setValue}
                                />
                            </div>*/}
                            {/*<MDEditor.Markdown source={state.post.Body} style={{ whiteSpace: 'pre-wrap' }} />*/}
                            <button type="submit" className="btn btn-primary" >Save</button>
                        </form>
                    </div>

                </div>
            }


            <FooterComponent />
        </div>
    );



}

export default NetworkMapEditPage;