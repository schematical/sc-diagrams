import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import HeaderComponent from "../../components/HeaderComponent";
import axios from "axios";

import {useParams} from "react-router-dom";

import {getJwt} from "../../Util";
interface DiagramObjectEditPageState{
    loaded?: boolean;
    diagramobject?: any
}
const DiagramObjectEditPage =  () => {
    const params = useParams();

    const [state, setState] = useState<DiagramObjectEditPageState>({
        diagramobject: {

        }
    });

    const refreshData = async () => {
        if (!params.objectId) {
            setState({
                loaded: true,
                // ...state,
                diagramobject: {
                    Username: params.username
                }
            })
            return
        }
        const res = await axios.get(  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${params.objectId}`);
        setState({
            loaded: true,
           // ...state,
            diagramobject: res.data
        })
    }
/*    const setValue = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, contextStore?: ContextStore) => {
        const diagramobject = state.diagramobject;
        diagramobject.Body = value;
        console.log("setValue:", state.diagramobject);
        setState({
            ...state,
            post
        });
    }*/
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const diagramobject = state.diagramobject;
        diagramobject[event.target.name] = event.target.value;
        console.log("State.diagramobject:", state.diagramobject);
        setState({
            ...state,
            diagramobject
        });
    }
    const onSave = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const token = await getJwt();
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.diagramobject.ObjectId}`,
            state.diagramobject,
            {
                headers: {
                    Authorization: token
                }
            }
        );
        setState({
            loaded: true,
            // ...state,
            diagramobject: res.data
        })
    }
    const handleUploadChange = async (event: any) => {
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.diagramobject.ObjectId}/upload`,
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

        setState({
            ...state,
            diagramobject: {
                ...state.diagramobject,
                [event.target.name]: res.data.url
            }
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
            { state.diagramobject &&
                <div className="container-fluid pt80 pb80">
                    <div className="container">
                        <form onSubmit={onSave}>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">ObjectId</label>
                                <input name="ObjectId" className="form-control" value={state.diagramobject.ObjectId}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Title</label>
                                <input name="title" className="form-control" value={state.diagramobject.title}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Description</label>
                                <input name="description" className="form-control" value={state.diagramobject.description}  onChange={handleChange} />
                            </div>
                     {/*       <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Tags</label>
                                <input name="Tags" className="form-control" value={state.diagramobject.Tags}  onChange={handleChange} />
                            </div>*/}
            {/*                <div className="form-group">
                                <label htmlFor="exampleInputEmail1">PublicDate</label>
                                <input name="PublicDate" className="form-control" type='date' value={state.post.PublicDate}  onChange={handleChange} />
                            </div>*/}
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">ImageSRC</label>
                                <input name="imageSrc" className="form-control" type='text' value={state.diagramobject?.imageSrc}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">ImageSRC File Upload</label>
                                <input name="imageSrc" className="form-control" type='file'  onChange={handleUploadChange} />
                            </div>
                            <hr />
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">JSON SRC</label>
                                <input name="jsonSrc" className="form-control" type='text' value={state.diagramobject.jsonSrc}  onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">jsonSrc File Upload</label>
                                <input name="jsonSrc" className="form-control" type='file'  onChange={handleUploadChange} />
                            </div>

                            {/*<div className="form-group">
                                <MDEditor
                                    value={state.post.Body}
                                    onChange={setValue}
                                />
                            </div>*/}
                            {/*<MDEditor.Markdown source={state.post.Body} style={{ whiteSpace: 'pre-wrap' }} />*/}
                            <button type="submit" className="btn btn-primary" >Submit</button>
                        </form>
                    </div>

                </div>
            }


            <FooterComponent />
        </div>
    );



}

export default DiagramObjectEditPage;