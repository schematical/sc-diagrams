import {gql} from "@apollo/client";
import client from "./Apollo";
import {decodeToken, isExpired} from "react-jwt";
import {
    cancelStripeSubscription,
    createDiagram, createDiagramFlow, createDiagramObject,
    createPaymentIntent, createStripePaymentMethod, createStripeSubscription, deleteStripeSubscription,
    detachStripePaymentMethod,
    finishSignUp,
    getDiagramById,
    getDiagramFlowById, getDiagramObjectById, getProductPage,
    getStripeSubscriptionPrice,
    listDiagram, listDiagramFlow,
    listDiagramObject,
    listStripePaymentMethod,
    listStripeSubscription,
    login,
    quickSetupStripeSubscription,
    refresh,
    signUp,
    updateDiagram, updateDiagramObject
} from "./graphql";

export class GQLService {

    public static isLoggedIn() {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }

    public static async checkAuth() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }
        const isMyTokenExpired = isExpired(token);
        if (!isMyTokenExpired) {
            return;
        }
        // localStorage.removeItem("accessToken");
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error("Missing `refreshToken`");
        }
        const decodedToken: any = decodeToken(token);
        const query = {
            username: decodedToken.username,
            refreshToken
        }
        return client
            .mutate({
                mutation: gql(refresh),
                variables: {
                    input: query,
                },
            })
            .then((response) => {
                const res = response?.data?.refresh;
                localStorage.setItem("accessToken", res.accessToken);
                // localStorage.setItem("refreshToken", res.refreshToken);
                return res;
            })
            .catch(GQLService.catchError);
    }
    static catchError(res: any) {

        console.error("GQL ERROR: ", res);
        throw res; // return res;

    }

    public static signUp(query: any) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return client
            .mutate({
                mutation: gql(signUp),
                variables: {
                    input: query,
                },
            })
            .then((response) => {
                return response?.data?.signUp;
            })
            .catch(GQLService.catchError);
    }

    public static finishSignUp(query: any) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return client
            .mutate({
                mutation: gql(finishSignUp),
                variables: {
                    input: query,
                },
            })
            .then((response) => {
                const res = response?.data?.finishSignUp;
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("user", JSON.stringify(res.user, null, 3));

                return res;
            })
            .catch(GQLService.catchError);
    }

    public static login(query: any) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return client
            .mutate({
                mutation: gql(login),
                variables: {
                    input: query,
                },
            })
            .then((response) => {
                const res = response?.data?.login;
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("user", JSON.stringify(res.user));

                return res;
            })
            .catch(GQLService.catchError);
    }
    public static async listDiagram(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql( listDiagram),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.listDiagram;

    }
    public static async listDiagramObject(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql( listDiagramObject),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.listDiagramObject;

    }
    public static async getDiagramObjectById(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql( getDiagramObjectById),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.getDiagramObjectById;

    }

    public static async getDiagramById(query: { _id: string, parentUri: string }) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql( getDiagramById),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.getDiagramById;

    }
    public static async createDiagram(query: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql( createDiagram),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.createDiagram;

    }
    public static async updateDiagram(query: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql( updateDiagram),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.updateDiagram;

    }
    public static async createDiagramObject(query: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql( createDiagramObject),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.createDiagramObject;

    }
    public static async updateDiagramObject(query: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql( updateDiagramObject),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.updateDiagramObject;

    }
    public static async listDiagramFlow(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql(listDiagramFlow),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.listDiagramFlow;

    }
    public static async getDiagramFlowById(query: { _id: string, parentUri: string }) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql( getDiagramFlowById),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.getDiagramFlowById;

    }
    public static async createDiagramFlow(query: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(createDiagramFlow),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.createDiagramFlow;

    }
    public static async createPaymentIntent(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(createPaymentIntent),
                variables: {input},

            })
            .catch(GQLService.catchError);
        return response?.data?.createPaymentIntent;

    }
    public static async getStripeSubscriptionPrice(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql(getStripeSubscriptionPrice),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.getStripeSubscriptionPrice;

    }
    public static async quickSetupStripeSubscription(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(quickSetupStripeSubscription),
                variables: {input},

            })
            .catch(GQLService.catchError);
        const res = response?.data?.quickSetupStripeSubscription;
        localStorage.setItem("user", JSON.stringify(res.user));
        return res;

    }
    public static async listStripeSubscription(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql(listStripeSubscription),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.listStripeSubscription;

    }
    public static async listStripePaymentMethod(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql(listStripePaymentMethod),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data?.listStripePaymentMethod;

    }

    static getProducts() {
        let products = {
            diagramEarlyAdapter: {
                id: 'price_0Oovgaiedt1Cam9Alx6Kibbd',
                name: 'Early Adaptor Dev'
            },
            diagramMonthly: {
                id: 'price_0OoviCiedt1Cam9Aoqp6znor',
                name: 'Premium'
            }
        }
        if (process.env.NODE_ENV === 'production') {
            products = {
                diagramEarlyAdapter: {
                    id: 'price_0Oov29iedt1Cam9AbGjkZR81',
                    name: 'Early Adaptor'
                },
                diagramMonthly: {
                    id: 'price_0OouzDiedt1Cam9Ae1taOYnx',
                    name: 'Premium'
                }

            }
        }
        return products;
    }
    public static getProductFromPriceId(priceId: string) {
        const products: any = GQLService.getProducts();
        const keys = Object.keys(products);
        for(let key of keys) {
            if (products[key].id === priceId) {
                return products[key];
            }
        }
        return null;
    }
    public static user() {
        const userJSON = localStorage.getItem("user");
        if (!userJSON) {
            return null;
        }
        return JSON.parse(userJSON);
    }

    public static hasSubscription() {
        const user = this.user();
        if (!user) {
            return false;
        }
        if (!user.stripeSubscription) {
            return false;
        }
        if (user.stripeSubscription.cancel_at * 1000 < Date.now()) {
            return false;
        }
        return true;
    }

    public static async deleteStripeSubscription(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(deleteStripeSubscription),
                variables: {input},

            })
            .catch(GQLService.catchError);
        const res = response?.data?.deleteStripeSubscription;
        return res;

    }
    public static async cancelStripeSubscription(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(cancelStripeSubscription),
                variables: {
                    subscriptionId: input
                },

            })
            .catch(GQLService.catchError);
        const res = response?.data?.cancelStripeSubscription;
        return res;

    }
    public static async detachStripePaymentMethod(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(detachStripePaymentMethod),
                variables: {
                    paymentMethodId: input
                },

            })
            .catch(GQLService.catchError);
        const res = response?.data?.detachStripePaymentMethod;
        return res;

    }
    public static async createStripePaymentMethod(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(createStripePaymentMethod),
                variables: {
                    input
                },

            })
            .catch(GQLService.catchError);
        const res = response?.data?.createStripePaymentMethod;
        return res;

    }
    public static async createStripeSubscription(input: any) {
        await this.checkAuth()

        const response = await client
            .mutate({
                mutation: gql(createStripeSubscription),
                variables: {
                    input
                },

            })
            .catch(GQLService.catchError);
        const res = response?.data?.createStripeSubscription;
        return res;

    }
    public static async getProductPage(query: any) {
        await this.checkAuth()

        const response = await client
            .query({
                query: gql(getProductPage),
                variables: {
                    input: query,
                },

            })
            .catch(GQLService.catchError);

        return response?.data;

    }
}