# hooks-graphql-example

> Example use of the FeathersJS fgraphql hook.

## About

This app shows the use of the fgraphql hook from @feathers-plus/feathers-hooks-common.

This app was generated using @feathers-plus/cli (a.k.a. cli+).

## Getting Started

1. Clone the repo to your machine.

2. Install your dependencies

    ```
    cd path/to/hooks-graphql-example
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

4. The console will display populated data from the users service.    

## Other commands

```
npm install -g @feathers-plus/cli       # Install cli+
feathers-plus generate fakes            # Generate new fake data with cli+

npm start                               # Start the server.
npm run start:seed                      # Start the server and reseed the database with the fake data.
```

## Modules of interest

```
src/services/users/users.populate.js    # Configure the fgraphql hook for the users service.
src/services/users/users.hooks.js       # Attach the fgraphql hook to the users service.
src/index.js                            # Run users.find() on startup.
```

## cli+

Feathers-plus has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathers-plus/cli     # Install cli+

$ feathers-plus generate options        # Specify options for this app
$ feathers-plus generate app            # Generate scaffolding for app
$ feathers-plus generate authentication # Generate authentication and user-entity service
$ feathers-plus generate secret         # Generate a new secret for authentication
$ feathers-plus generate service        # Generate a new service with its model
$ feathers-plus generate hook           # Generate a hook
$ feathers-plus generate graphql        # Generate a GraphQL endpoint for the services
$ feathers-plus generate fakes          # Generate fake data
$ feathers-plus generate test           # Generate a test
$ feathers-plus generate all            # Regenerate the entire app
```

## Help

For more information on all the things you can do, visit [the generator](https://generator.feathers-plus.com/), [FeathersJS](http://docs.feathersjs.com) and [extensions](https://feathers-plus.github.io/).

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
