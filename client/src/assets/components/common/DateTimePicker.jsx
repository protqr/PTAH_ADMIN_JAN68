import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const DateTimePicker = ({ name, label, initValue, onChange, format }) => {
    // Initialize state with the provided initial value or current date/time
    const [selectedDate, setSelectedDate] = useState(
        initValue ? dayjs(initValue).toDate() : new Date()
    );

    // Handle date change
    const handleChange = (date) => {
        setSelectedDate(date);
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: dayjs(date).toJSON(),
                },
            });
        }
    };

    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {label || name}
            </label>
            <ReactDatePicker
                selected={selectedDate}
                onChange={handleChange}
                showTimeSelect
                dateFormat={format ?? "yyyy-MM-dd HH:mm"}
                timeFormat="HH:mm"
                timeIntervals={15}
                className="form-control form-input"
            />
        </div>
    );
}

export default DateTimePicker;
