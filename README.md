<img width="80" src="https://github.com/AdenWhitworth/PlantPal_Front-End/raw/master/src/Images/PlantPal%20Logo.svg" alt="PlantPal Logo">

# PlantPal Front-End

Welcome to the **PlantPal Front-End**! This repository contains the code for the web-based user interface of the PlantPal application, designed to help plant enthusiasts monitor and manage their plants through a seamless and interactive experience.

## Table of Contents
- [Overview](#overview)
- [PlantPal Live Demo](#plantpal-live-demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Documentation](#documentation)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)

## Overview

The PlantPal Front-End is built using React and provides an intuitive user interface that connects to the PlantPal back-end. Users can view their plants, monitor conditions, and manage their settings through this interactive application.

## PlantPal Live Demo

The PlantPal application is live and can be accessed at [PlantPal Demo](https://www.plantpalhome.com/). This application integrates seamlessly with the PlantPal back-end, offering an intuitive experience for managing your plants remotely.

<img width="600" src="https://github.com/AdenWhitworth/aden_whitworth_portfolio/raw/master/src/Images/plantpal_demo.png" alt="PlantPal Demo">

### Test User Credentials

You can explore the full functionality of the PlantPal application using the following demo account:

- **Email:** support@plantpalhome.com
- **Password:** testpassword123

Please note that this test account is connected to an actual PlantPal device in my kitchen, so any interactions may affect its operation. Feel free to explore, but please be considerate of its usage!

## Features

- **User Authentication**: Secure login and registration for users.
- **Plant Dashboard**: View and manage all your plants in one place.
- **Real-Time Updates**: Receive live updates on plant conditions and statuses.
- **Device Integration**: Connects with IoT devices for monitoring.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Automated CI/CD Pipeline**: Ensures code quality with automated testing, builds, and deployments. Features seamless integration with GitHub Actions and Vercel for frontend deployment, providing a streamlined and reliable development workflow.

## Technologies Used

- **React**: A powerful JavaScript library for building user interfaces, enabling the development of dynamic and responsive web applications.
- **TypeScript**: A strongly typed superset of JavaScript that enhances code quality and provides better tooling and type safety during development.
- **HTML/JSX**: The foundational markup language used for structuring the components of the React application, ensuring semantic and accessible content.
- **Web Bluetooth**: A JavaScript library that enables communication with Bluetooth Low Energy (BLE) devices directly from the web, enhancing the application's connectivity features.
- **Axios**: A promise-based HTTP client that simplifies making API requests and handling responses, making it easier to interact with back-end services.
- **CSS**: Styles the application with a modern aesthetic, allowing for flexible and maintainable design.
- **React Router**: A library that enables dynamic routing in the application, providing a seamless navigation experience for users.
- **Figma**: A collaborative design tool used for crafting the application's UI/UX, allowing for prototyping and feedback before implementation.
- **MUI (Material-UI)**: A popular React component library that implements Google's Material Design, providing pre-designed components for charts, gauges, and more, enhancing visual consistency.
- **Socket.IO**: A library that facilitates real-time, bidirectional communication between clients and servers, crucial for features like live updates and notifications.
- **Jest**: A delightful JavaScript testing framework that ensures the reliability of the application by allowing developers to write unit tests for their functions and components.
- **TypeDoc**: A documentation generator for TypeScript projects that creates consistent and user-friendly API documentation, making it easier for developers to understand and use the codebase.
- **GitHub Actions**: A robust CI/CD platform that automates workflows such as testing, building, and deploying the application. GitHub Actions ensures consistent code quality and streamlines deployments to production environments.
- **Vercel**: A cloud platform for hosting front-end applications. Vercel handles building and deploying the application, providing a seamless and fast experience for hosting React-based projects.


## Getting Started

Follow the instructions below to set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdenWhitworth/PlantPal_Front-End.git
   cd PlantPal_Front-End
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and define the following variables:

  ```plain text
  # Application Configuration
  REACT_APP_BASE_URL=your_back-end_url  # url for the server application

  #BLE Configuration
  REACT_APP_BLE_SERVICE_UUID=your_ble_service_uuid # Unique BLE service UUID
  REACT_APP_BLE_CHARACTERISTIC_UUID=your_ble_characteristic_uuid # Unique BLE characteristic UUID

  #API Configuration
  REACT_APP_API_CLIENT_KEY=your_client_api_key #API key to communicate with backend server
  ```
### Running the Application

Once the environment variables are configured and dependencies are installed, you can start the application with:
```bash
npm start
```
## Testing

The project uses `Jest` and `Supertest` for unit and integration testing.
Run the test suite with:
```bash
npm test
```

You can view test coverage reports with:
```bash
npm run coverage
```

## CI/CD Pipeline

The project uses **GitHub Actions** to automate testing, building, and deployment to **Vercel**. 

### Vercel Setup

1. **Vercel Projects**:  
   - Ensure your frontend is set up as a Vercel Project.
     
2. **Restrict Automatic Builds**: Automatic builds from Git commits are disabled through the projects `vercel.json`.

```json
   {
     "github": {
       "enabled": false
     }
   }
```

3. **Environment Variables**: Configure the same environment variables in Vercel's project settings as defined locally in the `.env` file. These include:
- `REACT_APP_BASE_URL`
- `REACT_APP_BLE_SERVICE_UUID`
- `REACT_APP_BLE_CHARACTERISTIC_UUID`
- `REACT_APP_API_CLIENT_KEY`

3. **Vercel Token**:  
   - Generate an token in the Vercel dashboard under **My Account > Account Settings > Tokens**.  
   - Add this token to your GitHub repository's secrets as `VERCEL_TOKEN` along with the project name as `VERCEL_NAME`

### GitHub Actions Deployment

#### Setup

Ensure that the following variables are added to the GitHub repository's secrets:

- `VERCEL_TOKEN`
- `VERCEL_NAME`

#### Pipeline

The deployment process is triggered through the CI/CD pipeline, which performs the following steps:

1. **Code Checkout**: Fetches the latest changes from the repository.
2. **Dependency Installation**: Installs all required dependencies using `npm install`.
3. **Testing**: Runs the test suite with `Jest` to validate code quality and functionality.
4. **Build Process**: Creates an optimized production build using `npm run build`.
5. **Deployment**: Deploys the application to Vercel for hosting.

The CI/CD pipeline is defined in `.github/workflows/deploy.yml`

## Documentation

This project uses [TypeDoc](https://typedoc.org/) to generate documentation from the TypeScript code comments. To generate and view the documentation, follow these steps:

1. Ensure TypeDoc is installed:
   ```bash
   npm install --save-dev typedoc
   ```
2. Generate the documentation:
   ```bash
   npm run type-docs
   ```
3. The generated documentation will be located in the `docs/` directory. You can open the `index.html` file in your browser to view it.

## Future Features

We're excited about the upcoming features that will enhance the PlantPal experience:

1. **Stripe Checkout**: Streamline the purchasing process for PlantPal devices, making PlantPal commercially available to help people care for their plants.
2. **Notification System**: Implement text or push notifications to keep users updated on their plants' status, ensuring they never miss important alerts.
3. **Battery Management**: Introduce a battery indicator and management feature for PlantPal devices, helping users monitor power levels and extend device longevity.

## Contributing

If you want to contribute to this project, feel free to open an issue or submit a pull request. Any contributions, from bug fixes to new features, are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
