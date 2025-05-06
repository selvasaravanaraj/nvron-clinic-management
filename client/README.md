# Clinic Token System - Frontend

This is the frontend React application for the Clinic Token Management System.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

### Patient Interface
- Online token generation
- Live queue status tracking
- Estimated wait time display

### Doctor Interface
- Current patient display
- Next patient queue
- Token management controls

### Reception Interface
- Full token list management
- VIP patient handling
- Token editing and deletion

## Development

The application uses Create React App for development. To start the development server:

```bash
npm start
```

For production build:
```bash
npm run build
```

## Dependencies

- React
- Material-UI
- React Router
- Axios
- Socket.IO Client

## Mobile Responsiveness

The application is fully responsive and works well on both desktop and mobile devices. The UI components automatically adjust based on screen size.
