import './App.css';
import BookingSlot from './pages/Booking';

function App() {
  return (
    <div className="App">
      <BookingSlot serverUrl="http://localhost:5000" />
    </div>
  );
}

export default App;
