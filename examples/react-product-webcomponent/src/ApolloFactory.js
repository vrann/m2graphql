import ApolloClient, { createNetworkInterface } from 'apollo-client';

function ApolloFactory() {
     const logErrors = {
        applyAfterware({ response }, next) {
            if (!response.ok) {
                response.clone().text().then(bodyText => {
                    console.error(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
                    next();
                });
            } else {
                response.clone().json().then(({ errors }) => {
                    if (errors) {
                        console.error('GraphQL Errors:', errors.map(e => e.message));
                    }
                    next();
                });
            }
        },
    };

    const networkInterface = createNetworkInterface({
        uri: 'http://m2graphql.com/graphql',
    });
    networkInterface.useAfter([logErrors]);

    console.log('apollo');
    const client = new ApolloClient({
        connectToDevTools: true,
        networkInterface: networkInterface,
    });
    return client; 
}

export default ApolloFactory;