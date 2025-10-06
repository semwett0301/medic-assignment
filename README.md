# Gerimedica Frontend Assignment

## 🏗️ Architecture

### Project Structure

```
src/
├─ app/
│  ├─ app.routes.ts              # Application routing
│  ├─ app.config.ts              # Application configuration
│  ├─ layout/                    # Layout components
│  │  └─ shell.component.*       # Main shell layout
│  ├─ shared/                    # Shared utilities
│  │  ├─ ui/                     # Reusable UI components
│  │  │  ├─ button/              # Button component
│  │  │  ├─ input/               # Input component
│  │  │  ├─ card/                # Card component
│  │  │  ├─ checkbox/            # Checkbox component
│  │  │  └─ radio/               # Radio component
│  │  ├─ validators/             # Custom validators
│  │  │  └─ date.validator.ts    # Date validation logic
│  │  └─ pipes/                  # Shared pipes
│  └─ features/                  # Feature modules
│     ├─ home/                   # Home feature
│     │  └─ home.page.*          # Home page component
│     └─ clients/                # Clients feature
│        ├─ clients.page.*       # Smart page component
│        ├─ clients.service.ts   # Business logic service
│        ├─ client.model.ts      # Data models
│        ├─ clients.routes.ts    # Feature routing
│        └─ components/          # Dumb components
│           ├─ clients-filters/  # Search & filter component
│           ├─ clients-list/     # List display component
│           ├─ client-card/      # Individual client card
│           └─ client-form/      # Client creation form
└─ styles/                      # Global styles
   ├─ reset.css                 # CSS reset
   └─ normalize.css             # CSS normalization
```

## 🧪 Testing Strategy

### Test Structure

```
src/
├─ app/
│  ├─ features/
│  │  └─ clients/
│  │     ├─ clients.service.spec.ts    # Service tests
│  │     └─ clients.page.spec.ts       # Page component tests
│  └─ shared/
│     ├─ ui/
│     │  ├─ checkbox/
│     │  │  └─ checkbox.component.spec.ts
│     │  └─ radio/
│     │     └─ radio.component.spec.ts
│     └─ validators/
│        └─ date.validator.spec.ts     # Validator tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Categories

#### 1. **Service Tests**
- API integration testing with HTTP mocking
- State management and signal updates
- Error handling and edge cases
- Search and filtering logic

#### 2. **Component Tests**
- Component initialization and lifecycle
- User interaction handling
- Form validation and submission
- Input/output event handling

#### 3. **Validator Tests**
- Date validation edge cases
- Age calculation accuracy
- Future date prevention
- Boundary condition testing

## 🚀 Getting Started

### Install Dependencies

Before running the project, make sure to install the necessary packages:

P.S: You need to have the latest versions of Node.js and npm installed on your machine.

```bash
npm install
```

### Start the Development Server

To run the application locally, use the following command:

```bash
npm start
```

This will launch the app at [http://localhost:4200](http://localhost:4200). The development server supports hot-reloading, so any changes to the source files will automatically refresh the browser.

The mock API server is also available at [http://localhost:3000](http://localhost:3000), with endpoints powered by `db.json` file.

## 🧪 Running Tests

To execute unit tests using Jest test runner, run:

```bash
npm test
```

## 📡 API Routes

The mock API routes (powered by `db.json`) include the following:

### Client Routes

```http
GET     /clients
GET     /clients/:id
POST    /clients
PUT     /clients/:id
DELETE  /clients/:id
```

## 📚 Additional Resources

- Usefull example about [JSON-Server](https://jsonplaceholder.typicode.com/)
