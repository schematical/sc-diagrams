export const signUp = `
mutation signUp($input: UserCreateInput!) {
  signUp(input: $input) {
    user {
      _id
    }
  }
}
`;
export const finishSignUp = `
mutation finishSignUp($input: UserFinishSignupInput!) {
  finishSignUp(input: $input) {
    accessToken
    refreshToken
    user  {
      _id
      createdAt
      updatedAt
      email
      username
      stripeCustomerId
      stripeSubscription
    }
  }
}
`;
export const login = `
mutation login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken 
    user {
      _id
      createdAt
      updatedAt
      email
      username
      stripeCustomerId
      stripeSubscription
    }
  }
}
`;
export const refresh = `
mutation refresh($input: RefreshInput!) {
  refresh(input: $input) {
    accessToken
    refreshToken
    expiration
    issuedAt
    idToken
  }
}
`;

export const listDiagram = `
query listDiagram($input: DiagramFilterInput) {
  listDiagram(input: $input) {
    Items {
      _id
      parentUri
      createdAt
      updatedAt
      description
      name
      username
      tiles
      data
    }
  }
}
`;
export const listDiagramFlow = `
query listDiagramFlow($input: DiagramFlowFilterInput) {
  listDiagramFlow(input: $input) {
    Items {
      _id
      parentUri
      createdAt
      updatedAt
      name
      description
      username
      diagramId
      data
    }
  }
}
`;
export const listDiagramObject = `
query listDiagramObject($input: DiagramObjectFilterInput) {
  listDiagramObject(input: $input) {
    Items {
      _id
      parentUri
      createdAt
      updatedAt
      title
      imageSrc
      jsonSrc
      description
    }
  }
}
`;
export const getDiagramObjectById = `
query getDiagramObjectById($input: BasicFilterInput!) {
  getDiagramObjectById(input: $input) {
    _id
    parentUri
    createdAt
    updatedAt
    title
    imageSrc
    jsonSrc
    description
  }
}
`;

export const getDiagramById = `
query getDiagramById($input: BasicFilterInput!) {
  getDiagramById(input: $input) {
    _id
    parentUri
    description
    name
    username
    tiles
    data
  }
}
`;
export const createDiagram = `
mutation createDiagram($input: DiagramCreateInput!) {
  createDiagram(input: $input) {
    _id
    parentUri
    description
    name
    username
    tiles
    data
  }
}
`;

export const updateDiagram = `
mutation updateDiagram( $input: DiagramUpdateInput!) {
 
  updateDiagram(input: $input) {
    _id
    parentUri
    description
    name
    username
    tiles
    data
  }
}
`;

export const createDiagramObject = `
mutation createDiagramObject($input: DiagramObjectCreateInput!) {
  createDiagramObject(input: $input) {
    _id
    parentUri
    createdAt
    updatedAt
    title
    imageSrc
    jsonSrc
    description
  }
}
`;
export const updateDiagramObject = `
mutation updateDiagramObject($input: DiagramObjectUpdateInput!) {
  updateDiagramObject(input: $input) {
    _id
    parentUri
    createdAt
    updatedAt
    title
    imageSrc
    jsonSrc
    description
  }
}
`;
export const uploadDiagramObject = `
mutation uploadDiagramObject($input: DiagramObjectUploadInput!) {
  uploadDiagramObject(input: $input) {
   url
   signedUrl
  }
}
`;

export const getDiagramFlowById = `
query getDiagramFlowById($input: BasicFilterInput!) {
  getDiagramFlowById(input: $input) {
    _id
      parentUri
      name
      description
      username
      diagramId
      data
  }
}
`;
export const createDiagramFlow = `
mutation createDiagramFlow($input: DiagramFlowCreateInput!) {
  createDiagramFlow(input: $input) {
    _id
    parentUri
    createdAt
    updatedAt
    name
    description
    username
    diagramId
    data
  }
}
`;
export const createPaymentIntent = `
mutation createPaymentIntent {
  createPaymentIntent {
    client_secret
  }
}`;
export const createStripePaymentMethod = `
mutation createStripePaymentMethod($input: StripePaymentMethodCreateInput!) {
  createStripePaymentMethod(input: $input) {
    id
    type
    livemode
    customer
    object
    created
  }
}`;
export const getStripeSubscriptionPrice = `
query getStripeSubscriptionPrice($input: GetStripeSubscriptionPriceInput) {
  getStripeSubscriptionPrice(input: $input) {
    appliedPrice
    basePrice
    coupon {
      amount_off
      name
      percent_off
    }
  }
}`;
export const quickSetupStripeSubscription = `
mutation quickSetupStripeSubscription($input: StripePaymentMethodCreateInput!) {
  quickSetupStripeSubscription(input: $input) {
    user {
      _id
      createdAt
      updatedAt
      email
      username
      stripeCustomerId
      stripeSubscription
    }
    paymentMethod {
      id
      type
      livemode
      customer
      object
      created
    }
  }
}`;
export const listStripePaymentMethod = `
query listStripePaymentMethod {
  listStripePaymentMethod {
    id
    type
    livemode
    customer
    object
    created
    card
  }
}`;
export const listStripeSubscription = `
query listStripeSubscription {
  listStripeSubscription {
    id
    customer
    plan
  }
}`;
export const deleteStripeSubscription = `
mutation deleteStripeSubscription($subscriptionId: String) {
  deleteStripeSubscription(subscriptionId: $subscriptionId) 
}`;
export const cancelStripeSubscription = `
mutation cancelStripeSubscription($subscriptionId: String) {
  cancelStripeSubscription(subscriptionId: $subscriptionId) 
}`;
export const detachStripePaymentMethod = `
mutation deleteStripeSubscription($paymentMethodId: String) {
  detachStripePaymentMethod(paymentMethodId: $paymentMethodId)
}`;
export const createStripeSubscription = `
mutation createStripeSubscription($input: StripeSubscriptionCreateInput!) {
  createStripeSubscription(input: $input) {
    id
    customer
    plan
  }
}`;
export const getProductPage = `
query getProductPage {
  getBalanceTransactions
  getAWSCosts
}`;

