# Talent Management System - Frontend

A modern, responsive React frontend for the Talent Management System built with Material-UI and Tailwind CSS.

## 🚀 Features

### Authentication
- **Login/Register Forms**: Clean, modern authentication interface
- **Demo Account**: Quick access with demo credentials
- **Password Visibility Toggle**: Enhanced security UX
- **Form Validation**: Real-time validation and error handling

### Employee Management
- **Employee Registration**: Add new employees with comprehensive details
- **Employee List**: View all employees in a responsive table
- **Skills Management**: Edit and manage employee skills
- **Skills Visualization**: Interactive skills distribution chart
- **Department Organization**: Categorize employees by department

### Budget Management
- **Budget Creation**: Add budgets with categories and descriptions
- **Budget Tracking**: Monitor budget allocations and spending
- **Budget Forecasting**: Visualize budget trends and predictions
- **Interactive Charts**: Custom-built forecast visualization

### Recruitment
- **Resume Screening**: Batch process and analyze resumes
- **Candidate Management**: View and manage candidate profiles
- **Match Scoring**: AI-powered candidate-job matching
- **Skills Extraction**: Automatic skills identification from resumes

## 🛠️ Technology Stack

- **React 19**: Latest React with hooks and modern patterns
- **Material-UI 7**: Comprehensive UI component library
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe development (for chart components)

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 🏗️ Project Structure

```
src/
├── features/           # Feature-based organization
│   ├── auth/          # Authentication components
│   ├── employee/      # Employee management
│   ├── budget/        # Budget management
│   └── recruitment/   # Recruitment features
├── lib/               # Shared utilities
│   └── api.js         # API integration
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🎨 UI Components

### Core Components
- **AuthForm**: Modern authentication with tabs and validation
- **EmployeeForm**: Comprehensive employee registration
- **EmployeeList**: Responsive table with skills management
- **BudgetForm**: Multi-field budget creation
- **BudgetList**: Budget overview with categories
- **ResumeUpload**: Batch resume processing interface
- **CandidateTable**: Enhanced candidate management

### Visualization Components
- **SkillsGraph**: Interactive skills distribution chart
- **ForecastChart**: Custom budget forecasting visualization

## 🔧 Configuration

### API Configuration
The frontend is configured to proxy API requests to `http://localhost:4000` through Vite's proxy configuration.

### Theme Customization
The application uses a custom Material-UI theme with:
- Primary color: `#1976d2` (Blue)
- Secondary color: `#dc004e` (Red)
- Responsive design with mobile-first approach

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebars and detailed views
- **Tablet**: Adaptive layouts with collapsible sections
- **Mobile**: Touch-friendly interface with simplified navigation

## 🎯 Key Features

### Enhanced User Experience
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear success notifications
- **Form Validation**: Real-time validation with helpful messages

### Data Visualization
- **Interactive Charts**: Custom-built visualization components
- **Color-coded Status**: Visual indicators for match scores and status
- **Responsive Tables**: Optimized for all screen sizes

### Modern UI/UX
- **Material Design**: Following Material Design principles
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode Ready**: Theme system supports dark mode

## 🔄 State Management

The application uses React hooks for state management:
- **useState**: Local component state
- **useEffect**: Side effects and API calls
- **Custom Hooks**: Reusable logic patterns

## 🚀 Performance Optimizations

- **Code Splitting**: Feature-based component organization
- **Lazy Loading**: Components loaded on demand
- **Optimized Bundles**: Vite for fast builds
- **Efficient Re-renders**: Proper dependency arrays and memoization

## 🧪 Development

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety for chart components
- **Component Structure**: Consistent component patterns

### Testing
- **Component Testing**: Ready for React Testing Library
- **API Mocking**: Easy to mock API responses
- **Error Boundaries**: Graceful error handling

## 📈 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Search and filter capabilities
- **Export Features**: PDF/Excel export functionality
- **Advanced Analytics**: More detailed reporting
- **Mobile App**: React Native version

## 🤝 Contributing

1. Follow the existing code structure
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure responsive design
6. Write clear component documentation

## 📄 License

This project is part of the Talent Management System.
