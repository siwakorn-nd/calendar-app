// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './App.css';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    activity: 'Running', // Default activity
    description: '',
  });

  const [memos, setMemos] = useState({}); // Memo data structure { date: [memos] }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleActiveStartDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = selectedDate.toDateString();

    // Create a copy of the memos for the selected date
    const memosForDate = [...(memos[formattedDate] || [])];
    memosForDate.push({ ...formData, date: formattedDate });
    
    // Update the memos state with the new memo
    setMemos({
      ...memos,
      [formattedDate]: memosForDate,
    });

    // Reset the form
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      activity: 'Running',
      description: '',
    });

    closeModal();
  };

  const hasMemos = (date) => {
    const formattedDate = date.toDateString();
    return memos[formattedDate] && memos[formattedDate].length > 0;
  };

  // Function to render the dot indicator for dates with memos
  const renderTileContent = ({ date }) => {
    if (hasMemos(date)) {
      return <div className="event-indicator" />;
    }
    return null;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Calendar App</h1>
      </header>
      <main className="app-main">
        <div className="calendar-and-memos">
          <div className="calendar-container">
          <Calendar
              className="custom-calendar"
              tileClassName={({ date }) => 
                date === selectedDate ? 'custom-tile selected' : 'custom-tile'
              }
              tileContent={renderTileContent}
              onClickDay={handleDateChange}
              defaultActiveStartDate={currentDate}
              onActiveStartDateChange={handleActiveStartDateChange}
              defaultView="month"
              formatShortWeekday={(locale, date) => {
                return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
              }}
              formatLongWeekday={(locale, date) => {
                return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
              }}
              calendarClassName="centered-day-names"
            />
            <button onClick={() => setIsModalOpen(true)} className="add-memo-button">
              +
            </button>
          </div>

          {isModalOpen && (
            <div className="modal-container">
              <div className="modal-box">
                <div className="modal-header">
                  <h2>Create Memo</h2>
                  <button onClick={closeModal} className="modal-close-button">
                    &times;
                  </button>
                </div>
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Title:</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date:</label>
                      <span>{selectedDate ? selectedDate.toDateString() : 'Select a date'}</span> {/* Display selected date */}
                    </div>
                    <div className="form-group">
                      <label>Start Time:</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time:</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Select Activity:</label>
                      <select
                        name="activity"
                        value={formData.activity}
                        onChange={handleInputChange}
                      >
                        <option value="Running">Running</option>
                        <option value="Walking">Walking</option>
                        <option value="Cycling">Cycling</option>
                        <option value="Swimming">Swimming</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedDate && memos[selectedDate.toDateString()] && (
          <div className="memo-list">
            <h3>Memos for {selectedDate.toDateString()}</h3>
            <ul>
              {memos[selectedDate.toDateString()].map((memo, index) => (
                <li key={index}>
                  <strong>{memo.title}</strong> ({memo.startTime} - {memo.endTime})
                  <br />
                  Activity: {memo.activity}
                  <br />
                  Description: {memo.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; 2023 Siwakorn Nudang</p>
      </footer>
    </div>
  );
};

export default App;
