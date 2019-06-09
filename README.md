# Local Setup

It's a [next.js](https://nextjs.org/) project, using a node server. Next.js uses React.

## Installation

To use this project, you'll need to install few things first.

### Installing MongoDB

You need to have MongoDB running locally on your machine. Community edition of MongoDB can be downloaded from [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition).

If you have MongoDB already installed, make sure it's version 3.6 or higher.
Here's MongoDB is used to run a [radiks](https://github.com/blockstack-radiks/radiks) server, which helps in quering and indexing the data stored on user's gaia hub. Curious about how radiks work? [GitHub](https://github.com/blockstack-radiks/radiks)

### Installing Node.js

Node.js is required to run this project. LTS version should work fine for this project, download it from [here](https://nodejs.org/).
This project was tested with node.js version 10.15.0

### Intalling yarn

[Yarn](https://yarnpkg.com/) is a package manager similar to npm.

## Downloading the project

Open the terminal and download the project using git. Once the project is downloaded, run `yarn` to download all dependencies.

```
git clone git@github.com:hKedia/dShare-blockstack.git
cd dShare-blockstack
yarn
```

## Configuration

### Environment Variables

Rename `.env.default` to `.env` and supply the below values.

- `RADIKS_API_SERVER` -> The Url for the radiks server. By default its the server from where your application is server.\
- `MONGODB_URI` -> The locally running MongoDB Url.

## Running the project

Make sure before running the project, MongoDB is already running.

### In `dev` mode

In the root directory run `yarn run dev` to start the application in development mode.

### In `production` mode

Before running the application in production mode, you need to build the application first.\
 In the root directory run `yarn run build` to build the application.\
 Once the build process is complete, run `yarn run start` to start the application.
