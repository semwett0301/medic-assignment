# Gerimedica Frontend Assignment

A modern Angular application for client management with a clean, feature-based architecture. Built with Angular 19.2.0, featuring reactive state management, comprehensive validation, and extensive unit testing.

## ✨ Features

- **Client Management**: Create, read, update, and delete clients
- **Real-time Search**: Search clients by first or last name
- **Status Filtering**: Filter clients by active/inactive status
- **Form Validation**: Comprehensive validation with custom date validators
- **Responsive Design**: Mobile-first, modern UI components
- **Reactive State**: Angular signals for efficient state management
- **Unit Testing**: Comprehensive test coverage with Jest

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

### Architecture Principles

#### 1. **Feature-Based Organization**
- Each feature is self-contained with its own components, services, and models
- Clear separation between smart (page) and dumb (presentational) components
- Feature-specific routing and lazy loading

#### 2. **Smart/Dumb Component Pattern**
- **Smart Components (Pages)**: Handle state, business logic, and data fetching
- **Dumb Components**: Pure presentational components with inputs/outputs only
- Clear data flow from smart to dumb components

#### 3. **Reactive State Management**
- Angular signals for reactive state management
- Computed signals for derived state
- Service-based state management with clear APIs

#### 4. **Reusable UI Components**
- Shared UI component library in `shared/ui/`
- Consistent design system across the application
- Form integration with ControlValueAccessor

#### 5. **Validation Strategy**
- Custom validators for business logic (date validation)
- Reactive form validation with real-time feedback
- Centralized validation rules and error messages

## 🧪 Testing Strategy

### Test Coverage

The application includes comprehensive unit tests covering:

- **Services**: Business logic, API interactions, state management
- **Components**: UI behavior, form handling, user interactions
- **Validators**: Custom validation logic and edge cases
- **Utilities**: Helper functions and data transformations

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
