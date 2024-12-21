import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
  ListGroup,
} from "react-bootstrap";
import './Booking.css'

const Booking = () => {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch available slots for a given date
  const fetchSlots = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/slots?date=${date}`);
      setSlots(response.data.availableSlots);
    } catch (err) {
      setError("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!name || !phone || !date || !selectedSlot) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/book", {
        name,
        phone,
        date,
        timeSlot: selectedSlot,
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setDate("");
      setSelectedSlot("");
      setSlots([]);
    } catch (err) {
      setError("Slot already booked or invalid data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Appointment Booking</Card.Title>

              {/* Date Picker */}
              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={fetchSlots}
                />
              </Form.Group>

              {/* Name Input */}
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              {/* Phone Input */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              {/* Time Slot Selector */}
              <Form.Group className="mb-3">
                <Form.Label>Select Time Slot</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  disabled={!slots.length}
                >
                  <option value="">Choose a slot</option>
                  {slots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Loading Spinner */}
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              {/* Success and Error Alerts */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Appointment booked successfully!
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                variant="primary"
                block
                onClick={handleBooking}
                disabled={loading || !slots.length}
              >
                Book Appointment
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Slots (If any) */}
      {slots.length > 0 && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <Card>
              <Card.Body>
                <Card.Title>Available Slots</Card.Title>
                <ListGroup>
                  {slots.map((slot, index) => (
                    <ListGroup.Item key={index}>{slot}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Booking;
