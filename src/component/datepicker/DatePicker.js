import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import locale from "date-fns/locale/zh-TW/index.js";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const SingleDatePicker = ({
  startDate,
  setStartDate,
  dateFormat = "dd-MMM, yyyy"
}) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(moment(date).valueOf())}
      locale={locale}
      dateFormat={dateFormat}
    />
  );
};

const SingleDateWithTimePicker = ({ startDate, setStartDate }) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showTimeSelect
      dateFormat="MMMM d, yyyy h:mm aa"
      locale={locale}
    />
  );
};

const MonthRangePicker = ({ dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange;

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        const [start, endDate] = update;
        
        setDateRange([start, moment(endDate).endOf("month").valueOf()]);
      }}
      showMonthYearPicker
      dateFormat="MMM, yyyy"
      locale={locale}
    />

  );
};

MonthRangePicker.propTypes = {
  dateRange: PropTypes.array.isRequired,
  setDateRange: PropTypes.func.isRequired,
};

export { SingleDatePicker, SingleDateWithTimePicker, MonthRangePicker };
