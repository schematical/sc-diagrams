import React, {useState} from 'react';
import TopbarComponent from "../../components/TopbarComponent";
import FooterComponent from "../../components/FooterComponent";
import SignupComponent from "../../components/SignupComponent";
import PaymentComponent from "../../components/PaymentComponent";
import {StripeProductSelectComponent} from "../../components/stripe/StripeProductSelectComponent";
interface DiagramLandingPageState{
    productPriceId?: string;
}
const DiagramLandingPage  = () => {

    const [state, setState] = useState<DiagramLandingPageState>({});
    const onProductChange = async (productPriceId: string) => {
        setState({
            ...state,
            productPriceId
        });
    }

    function onSignupSuccess(res: any) {
        if(!state.productPriceId) {
            document.location.href = `/${res.user.username}/diagrams`;
            return;
        }
        document.location.href = `/${res.user.username}/account/plan?productPriceId=${state.productPriceId}`;
    }

    return (
        <div>
            <TopbarComponent/>
            {/* <HeaderComponent />*/}
            {/* <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <a className="navbar-brand" href="#">Cloud Diagramming Software</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="#features">Features</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#pricing">Pricing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>*/}

            <div className="container-fluid text-center background-orange pt64 pb64 x-midsection">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2>Schematical.com Cloud Diagramming Tools</h2>
                        <h4>Bring your diagrams to life</h4>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-6">

                        <p className="lead">
                            We provide a unique diagramming software focused on documenting Cloud
                            Network Maps and Swim Lane Flow Charts of the events that transpire between the resources in
                            the cloud. Furthermore we bring those diagrams to life with animation by animating on the
                            network map chronologically each individual step in the flow chart. It is all brought to
                            life with isometric pixel art animation.
                        </p>
                        <a href="#signup" className="btn btn-primary mb-4">Get Started</a>
                    </div>
                    <div className="col-lg-6">
                        {/*Placeholder for product image or video*/}
                        <iframe width="100%" height="315"
                                src="https://www.youtube.com/embed/zth11l0a-x8?si=52SPdk3livG--Ubv"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                    </div>
                </div>
            </div>

            <section id="features" className=" py-5">
                <div className="container-fluid background-gray-light pt80 pb80">
                    <div className="container">
                        <h3 className="text-center mb-4">Features</h3>
                        <div className="row">
                            <div className="col-md-4">
                                <img src={process.env.PUBLIC_URL + '/images/diagram-feature-1.png'}
                                     className="img-fluid mb-3" alt="Diagram 1"/>
                                <h3>Cloud Network Maps</h3>

                                <p>Document your cloud infrastructure with detailed network maps.</p>
                            </div>
                            <div className="col-md-4">
                                <img src={process.env.PUBLIC_URL + '/images/diagram-feature-2.png'}
                                     className="img-fluid mb-3" alt="Diagram 1"/>
                                <h3>Swim Lane Flow Charts</h3>

                                <p>Create interactive flow charts to visualize complex processes.</p>
                            </div>
                            <div className="col-md-4">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-3">
                                            <img src={process.env.PUBLIC_URL + '/images/diagram-feature-3.gif'}
                                                 className="img-fluid mb-3" alt="Diagram 1"/>
                                        </div>
                                        <div className="col-9">
                                            <img src={process.env.PUBLIC_URL + '/images/diagram-feature-3-2.gif'}
                                                 className="img-fluid mt-3" alt="Diagram 1"/>
                                        </div>
                                    </div>
                                </div>

                                <h3>Isometric Pixel Art Animation</h3>

                                <p>Bring your diagrams to life with unique isometric pixel art animation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="diagrams" className="py-5">
                <div className="container">
                    <h3 className="text-center mb-4">Example Diagrams</h3>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img src={process.env.PUBLIC_URL + '/images/diagrams-sample-1.png'}
                                 className="img-fluid mt-3" alt="Diagram 1"/>
                            <a href="/schematical/diagrams/drawnby-ai/flows/basicflow" target="_blank"
                               className="btn btn-primary">
                                Stable Diffusion As A Service
                            </a>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src={process.env.PUBLIC_URL + '/images/diagrams-sample-2.png'}
                                 className="img-fluid mt-3" alt="Diagram 2"/>
                            <a href="/schematical/diagrams/chaos-crawler/flows/consumerflow" target="_blank"
                               className="btn btn-primary">Event Driven Architecture</a>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src={process.env.PUBLIC_URL + '/images/diagrams-sample-3.png'}
                                 className="img-fluid mt-3" alt="Diagram 3"/>
                            <a href="/schematical/diagrams/redis-sharding/flows/shard-flow1" target="_blank"
                               className="btn btn-primary">Redis Sharding</a>
                        </div>
                    </div>
                </div>
            </section>


            <section id="pricing">
                <div className="container-fluid background-orange pt64 pb64 x-midsection">
                    <div className="container">
                        <h2 className="text-center mb-4">Pricing</h2>

                        <StripeProductSelectComponent onChange={onProductChange} callToAction={"Sign Up For"} productId={state.productPriceId} focusProductId={state.productPriceId}/>
                    </div>
                </div>
            </section>

            <section id="signup" className="bg-light py-5">
                <div className="container">
                    <h3 className="text-center mb-4">Sign Up</h3>
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <SignupComponent onSuccess={onSignupSuccess}/>

                        </div>
                    </div>
                </div>
            </section>

            <FooterComponent/>
        </div>
    );
}

export default DiagramLandingPage;