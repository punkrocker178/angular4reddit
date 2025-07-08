# angular4reddit
Check it out: [App](https://dbqo2nayu6ql6.cloudfront.net)  
  
This app is a simple reddit's client using Angular.  
The app will call to AWS Lambda & AWS API Gateway to bypass CORS policy to get actual Reddit's API responses.  

## Features

- Log in to your Reddit account using Reddit Oauth2
- No promotional post / ads
- You can vote, comment, save posts
- Filter new/rising/hot posts, also filter by flair in subreddit
- Search posts, subreddits
- Infinite scrolling
- Responsive mobile UI
- Change themes

## Known issues

- On mobile: After login on reddit page, you will be redirected to offical reddit mobile app. You will have to go back to the app and click sign in again. However, it doesn't happen on desktop
- On mobile (maybe android only ?): After you have scrolled long enough, you will experience slightly flickering screen when you scroll up again
- Reddit `morechildren` api is returning comments without a tree structure. So when you load more comments, the app is unable to show correct indentation of those comments
- Sometimes, you will encounter duplicated posts

## Upcoming plans

- Implement classic view with virtual scrolling
- Enhance my profile page (Comments tab, Saved posts tab, Manage subreddits subscribtion)
- Enhance UI
- More themes (Color themes look like social media sites)
- Bug fixing

## Install

Run `npm i` or  
 ```docker run --rm -it -v $PWD/:/app -w /app node:latest npm i```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.  

Run in docker container  
```docker run --rm -it -p 4200:4200 -v $PWD/:/app -w /app node:latest npm start```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
