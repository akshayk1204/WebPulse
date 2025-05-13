import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import ReportView from './pages/ReportView'; 

const theme = createTheme({
  typography: {
    fontFamily: '"Lexend Deca", Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#2d3e50',
      contrastText: '#fff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/share/:guid" element={<ReportView />} /> {/* ✅ Add this line */}
          <Route path="*" element={<Home />} /> {/* Fallback route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;