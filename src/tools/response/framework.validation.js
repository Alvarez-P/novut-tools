module.exports = {
    isServerless: (Context) => 'awsRequestId' in Context,
    isAzure: (Context) => 'bindings' in Context,
    isExpress: (Context) => 'socket' in Context
}
