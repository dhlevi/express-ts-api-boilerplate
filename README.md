# Typescript/ExpressJs API Boilerplate

This repo contains a boilerplate application for an Express JS API written in typescript.

## Getting it to run

Pretty straightforward. Clone the repo, then:

```bash
npm install
```

To build it and generate swagger.json documentation

```bash
npm run build
```

Or without swagger

```bash
npm run build-no-swagger
```

You can run the api in the vscode debugger with the provided debug config. If you just want to run the build:

```bash
node build/index.js
```

And you can hit the running API at <http://localhost:1337>. You might have to supply some configurations in the /config/application.properties file for logging output, etc.

## Webade

This example includes a Webade singleton as an example of not only how to use webade with the API, but mainly as an example for how to include oracle queries and MyBatis xml support. COnfigurations for webade can be found in `config/application.properties`.

Once configured, webade will create collections for your application actions, roles, and proxy database connections. Proxy database connections that include pooling will have a pool created

## Service Controllers

The basic API structure is based off of Controller classes that implement `Controller` and use decorators to define the API properties, much like the standard Java/Spring API's.

There are a number of decorators, so take a look at the `ServiceController` example in the application `controllers` folder.

Here's an example of a simple controller that does nothing useful:

```Typescript
import { Controller } from '../core/Controller'
import { Route, SuccessResponse, Get, Path, Query } from '../core/Decorators'

@Route('root/endpoint')
export class MyController extends Controller {
  @Get('other/endpoint/{argument}')
  @SuccessResponse('200', 'OK')
  public async getFunction (@Path() argument: string, @Query() queryStringVal: string) {
    // do stuff
    return { my: 'valid response' }
  }
}
```

#### Important things to note:

- All endpoint functions must be `public async`. MUST. No promise, no endpoint
- All endpoints must contain a `@Get`, `@Put`, `@Post`, `@Patch` or `@Delete` decorator at least, or they wont be registered
- `@Path` and `@Query` argument names can be overriden by supplying an override in the decorator function, if your callers will be creating requests with a different name than your function arguments
- `@Body` can't be used with `@Get`, and it will fail if you try.
- You don't need to start your paths with a slash.
- If you don't include a value in `@Route`, `@Get`, `@Put`, `@Post`, `@Patch` or `@Delete`, I assume you meant `/`.
- You can add as many properties as you want to `application.properties`. They'll be fetchable via the AppProperties static accessor.
- It is vital that you import your decorators from `core/Decorators`. There's another package in the application, called `tsoa` which includes a number of identically named decorators. `tsoa` is used for generating the swagger documentation, and using the base implementation will cause route registration to fail (you can always do it manually if you want though). I could directly override the tsoa implementation, but I wanted to leave it relatively seperated in case we implement our own swagger generator in the future.
- If you exclude the decorators, or do not extend `Controller`, swagger generation and/or route autowiring will not work.
- Your endpoints won't register if you don't instantiate the controller class before Routes are created. Read on to learn how to do that

### Registering Routes

To ensure your routes to the controller get created, you currently need to update the routes file in `routes/Routes.ts` (note that I am working on changing this implementation in the future so it either won't be needed, or will be defined a bit cleaner).

You add your service class to Routes.ts and instantiate it before (BEFORE!!!) the call to `RouteManager.initializeRoutes(router)`

```Typescript
RouteManager.initControllers(new MyController(), new MyOtherController())
// other controllers...
// then...
RouteManager.initializeRoutes(router)
```

And RouteManager will take care of the rest. The endpoints you defined should now display in the log when you rebuild and re-run your application. If you define a controller after, it will not autowire and you'll be responsible for route registration.

Note that you don't need to use the RouteManager at all. Feel free to supply manual endpoint routing or custom endpoints handlers as needed, they're plenty of good cases for doing it, if the automatic controller management doesn't fit your needs for some reason (it should for 95% of your use cases, and if you find a case it doesn't work for, let me know and I can make it work).

### Query Configs

Included in the API are some examples of using myBatis v3 mappers to generate queries. Take a look at the webade.ts loaders for examples on how they're used, until I create some example endpoints that actually hit a DB.

### Security

A Decorator exists called `@Security`. Currently it's a basic implementation that will automatically inject JWT validation and webade authentication: `@Security('BearerAuth', ['some', 'required', 'scopes'])`

It's simple for now, so expect these examples to expand to support a broader range, likely with an implementation of the passport library for expressjs. In the meantime, it's pretty simple to add more support to the existing Security decorator for other types if you need them. Just create a new middleware and wire it up in the decorator.

## Default Endpoints

### Health Check

Familiar to anyone who's used our standard Java Spring API templates, included in this example is a default endpoint called `/healthCheck`. Running the Health Check will return some status information about the current health of the application and subcomponents.

You can create your own Health Checks by extending the `HealthValidator` class, and adding instantiating your validator in the `HealthCheckLoader.ts` file in the `./health-checks` folder. Documentation and examples are found there as well.

### OpenAPI

If you use the swagger generator, a swagger.json file will be created by default and placed in the `/public` directory. When your API is running, you can hit the pre-defined `/openapi` endpoint. This will open up a swagger document viewer allowing you to view the generated swagger spec. It's cool, check it out!

## More to come as I get the time to add things!
