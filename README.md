# Github Repos info

This application listens on port 8080 and exposes APIs that allow users to access information about public repositories on Github.

## Available APIs

- GET /repos 

Retrieves a list of all public repositories on Github using the public URL https://api.github.com/repositories. 

Please be advised that this API comes with a rate limit, which is why the application retrieves the repository list until the limit is met and then ceases. In the future, the application will wait for the designated time window to continue collecting all the data.

Once the list is fetched, it prints the name of the repositories in alphabetical order. It also prints a list of the owners (login) and the amount of repositories they have.
 - Response:
Response code: 200 on success,  and 500 on an error

## Installation

Github repos requires [Node.js](https://nodejs.org/) to run.

1. Clone or download the Github Repos repository to your local machine.
2. Open the terminal and navigate to the project directory.
3. Run ```npm i``` to install the dependencies and devDependencies.
4. Start the server using ```npm start``` command.

