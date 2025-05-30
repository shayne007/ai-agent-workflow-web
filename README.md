# AI Agent Workflow UI

A React-based frontend for managing AI agent workflows.
##
web ui layout

![Homepage Layout](./homepage_layout.png)

## Features

- Workflow management
- Agent configuration
- Execution monitoring
- Real-time logging

## Setup

1. Install dependencies:
```bash
npm install

# use yarn instead of npm to manange dependencies to avoid conflicts
yarn install
```

2. Start development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects the app from create-react-app


# ai-agent-workflow-web
this is a web application for ai agent workflow backend
which is built by react framework

## features
1. user can chat with a robot to query information, such the investment, stock, etc.
2. user can chat with a robot to give a feedback to the financial product
3. user can sent a message to start a request to leaned money by the personal loan agent
4. the system have access to 3rd party api to query information, such as credit info, social security info, tax info, etc.
5. the loan workflow is implemented by the spring ai framework which is improved by ai, compared with the traditional workflow
6. we can transfer to human reviewer to review the loan request if the system can not give a decision

## how to run
1. npm install
2. npm start

# backend
the docs are in the directory /Users/fengshiyi/Downloads/shayne/learning/LLM/ai-agent-workflow/docs
the ai-agent-workflow is the backend project implemented by spring boot and spring ai

