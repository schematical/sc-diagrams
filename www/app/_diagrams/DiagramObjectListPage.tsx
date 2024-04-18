import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import HeaderComponent from "../../components/HeaderComponent";
import axios from "axios";

import {useParams} from "react-router-dom";

import {getJwt} from "../../Util";
import {Diagram, DiagramObject, getDiagramObjects, getDiagrams, putDiagram, putDiagramObject} from "../../components/diagrams/util";
import {GQLService} from "../../services/GQLService";
import {createDiagramObject} from "../../services/graphql";

interface DiagramObjectListPageState {
    loaded?: boolean;
    diagramObjects?: DiagramObject[];

    selectedDiagramObject?: DiagramObject;
}
interface DiagramObjectListPageProps{
    new?: boolean;
}
const DiagramObjectListPage = (props: DiagramObjectListPageProps) => {
    const params = useParams();

    const [state, setState] = useState<DiagramObjectListPageState>({});

    const refreshData = async () => {
        if (!params.username) {

            return
        }
        const res: DiagramObject[] = (await GQLService.listDiagramObject(params.username)).Items;
        let selectedDiagramObject; // = null;
        if(params.objectId) {
            selectedDiagramObject = res.find((diagramObject) => diagramObject._id === params.objectId);
        } else if (props.new) {
            selectedDiagramObject = {
                _id: 'do-' + Math.floor(Math.random() * 99999),
                    title: "My DiagramObject " + Date.now().toString(),
                    // username: params.username as string,
                    parentUri: params.username as string,
                    imageSrc: "",
                    jsonSrc: "",
                    x: 0,
                    y: 0
            }
        }
        setState({
            loaded: true,
            ...state,
            diagramObjects: res,
            selectedDiagramObject
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
        if (!state.selectedDiagramObject) throw new Error("Missing `state.selectedDiagramObject`");
        event.preventDefault();
        const res = (await GQLService.createDiagramObject(state.selectedDiagramObject));
        window.location.href = `/${state.selectedDiagramObject?.parentUri}/diagramobjects/${state.selectedDiagramObject?._id}`;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagramObject = state.selectedDiagramObject;
        if (!selectedDiagramObject) throw new Error("Missing  `state.selectedDiagramObject`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('_id'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedDiagramObject._id = value.toLowerCase().replace(/[^a-zA-Z0-9\-]]/g, '');
                break;
        }

        (selectedDiagramObject as any)[event.target.name] = value;
        console.log("State.selectedDiagramObject:", state.selectedDiagramObject);
        setState({
            ...state,
            selectedDiagramObject
        });
    }
   /* const onNewDiagramClick = (event: any) => {
        event.preventDefault();
        setState({
            selectedDiagramObject: {
                ObjectId: 'do-' + Math.floor(Math.random() * 99999),
                title: "My DiagramObject " + Date.now().toString(),
                Username: params.username as string,
                imageSrc: "",
                jsonSrc: "",
                x: 0,
                y: 0
            }
        })
    }*/
    const handleUploadChange = async (event: any) => {
        if (!state.selectedDiagramObject) throw new Error("Missing `state.selectedDiagramObject`");

        event.preventDefault();

        const token = await getJwt();
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        const extension = files[0].name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
            reader.onload = async () => {
                resolve()
            }
            reader.readAsDataURL(files[0]);
        });
        let key = event.target.name;
        switch (key) {
            case('imageSrc'):
                key = files[0].name.substr(0, files[0].name.length - (extension.length + 1))
                break;
        }
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.selectedDiagramObject._id}/upload`,
            {
                extension,
                key
            },
            {
                headers: {
                    Authorization: token
                }
            }
        );
        const signedUrl = res.data.signedUrl;
        const result = await fetch(signedUrl, {
            method: "PUT",
            body: dataURItoBlob(reader.result as string),
        });
        const selectedDiagramObject = state.selectedDiagramObject;

        (selectedDiagramObject as any) = {
            ...state.selectedDiagramObject,
            [event.target.name]: res.data.url
        }
        setState({
            ...state,
            selectedDiagramObject
        });
    }

    function dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
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
                                state.selectedDiagramObject &&
                                <form onSubmit={onSave}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">ObjectId</label>
                                        <input name="_id" className="form-control"
                                               value={state.selectedDiagramObject?._id}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Title</label>
                                        <input name="title" className="form-control"
                                               value={state.selectedDiagramObject?.title} onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Description</label>
                                        <input name="description" className="form-control"
                                               value={state.selectedDiagramObject?.description}
                                               onChange={handleChange}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">ImageSRC</label>
                                        <input name="imageSrc" className="form-control" type='text'
                                               value={state.selectedDiagramObject?.imageSrc}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">ImageSRC File Upload</label>
                                        <input name="imageSrc" className="form-control" type='file'
                                               onChange={handleUploadChange}/>
                                    </div>
                                    <hr/>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">JSON SRC</label>
                                        <input name="jsonSrc" className="form-control" type='text'
                                               value={state.selectedDiagramObject?.jsonSrc}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">jsonSrc File Upload</label>
                                        <input name="jsonSrc" className="form-control" type='file'
                                               onChange={handleUploadChange}/>
                                    </div>


                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>

                            }

                            <a
                                className="btn btn-primary"
                                // onClick={onNewDiagramClick}
                                href={`/${params.username}/diagramobjects/new`}
                            >
                                New Diagram
                            </a>


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
                                    state.diagramObjects &&
                                    state.diagramObjects?.map((diagramObject: DiagramObject) => {
                                        return <tr>
                                            <th scope="row">
                                                {diagramObject.parentUri}
                                            </th>
                                            <td>
                                                {diagramObject._id}
                                            </td>
                                            <td>
                                                {diagramObject.title}
                                            </td>
                                            <td>
                                                <a href={`/${diagramObject.parentUri}/diagramobjects/${diagramObject._id}`}>
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

export default DiagramObjectListPage;
