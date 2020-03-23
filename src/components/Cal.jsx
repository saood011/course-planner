import React from "react";
import moment from "moment";
import "./calendar.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import TableToExcel from "@linways/table-to-excel";

export default class Calendar extends React.Component {
  state = {
    today: moment(),
    year: 2020,
    calendarName: "FbW7",
    showInput: false,
    showYearPopup: false,
    id: "",
    event: "vacation",
    eventColor: "event-red",
    data: [{ id: "", event: "React" }]
  };
  data = {
    id: "093",
    event: "hello"
  };

  year = () => moment().format("Y");
  month = () => moment().format("MMMM");
  daysInMonth = date => moment(date).daysInMonth();
  currentDate = () => moment().get("date");
  currentDay = () => moment().format("D");
  firstDayOfMonth = date => {
    let firstDay = moment(date)
      .startOf("month")
      .format("d");
    return firstDay;
  };

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();
  ///onClick handler////////////////////////////////
  /*   onClickHandler = e => {
    console.log(e.target.id);
    var event = prompt("Enter an event");
    this.setState({ id: e.target.id, event: event });
  }; */
  onClickHandler = e => {
    this.setState({ showInput: true, id: e.target.id });
    // console.log(parseInt(e.target.id.slice(0, 2)));
    console.log(this.months[parseInt(e.target.id.slice(0, 2)) - 1].slice(0, 3));
  };
  /*   buttonClick = e => {
    e.preventDefault();
    this.state.data.unshift({ id: this.state.id, event: this.state.event });
    this.setState({ id: "", event: "", showInput: false });
  }; */
  onChangehandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  yearInput = () => {
    let year = prompt("Enter an year");
    if (year === undefined || year === NaN || year === "") {
      alert("Please enter a valid year - YYYY");
    } else {
      this.setState({ year: parseInt(year) });
    }
  };
  yearIncrement = () => this.setState({ year: this.state.year + 1 });
  yearDecrement = () => this.setState({ year: this.state.year - 1 });

  //////set month//////////////////////////

  setMonth = date => {
    // days in a month
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(date); d++) {
      let className =
        moment().format("YYYY-MM-DD") ===
        date.split("-")[0] +
          "-" +
          date.split("-")[1] +
          "-" +
          (d.toString().length === 1 ? "0" + d : d) //adding zero if d = 1 to 9
          ? "day current-day"
          : "day";

      ///comparing id to get data from predefined events from state object

      if (this.state.data[0].id === date.split("-")[1] + d) {
        daysInMonth.push(
          <td
            className={className}
            key={d}
            id={date.split("-")[1] + d}
            onClick={this.onClickHandler}
          >
            <span>
              {d}
              <span style={{ color: "red" }}> {this.state.data[0].event}</span>
            </span>
          </td>
        );
      } else {
        daysInMonth.push(
          <td
            className={className}
            key={d}
            id={date.split("-")[1] + d}
            onClick={this.onClickHandler}
          >
            <span className="inside-cell d-flex justify-content-around">
              <span>{d}</span>
              <span>
                {this.weekdaysShort[
                  moment(
                    date.split("-")[0] + "-" + date.split("-")[1] + "-" + d // adding week days i.e Su, Mo to each day
                  ).day()
                ].slice(0, 2)}
              </span>
            </span>
          </td>
        );
      }
    }
    // total slots
    return [...daysInMonth];
  };
  // add event//////////////////////////

  buttonClick = e => {
    e.preventDefault();
    var row = document.getElementById(
      this.months[parseInt(this.state.id.slice(0, 2)) - 1].slice(0, 3)
    );

    row.deleteCell(parseInt(this.state.id.slice(2)));
    var x = row.insertCell(parseInt(this.state.id.slice(2)));
    x.innerHTML =
      "<span>" +
      this.state.id.slice(2) +
      "</span>" +
      "-" +
      "<span>" +
      this.state.event +
      "</span>";
    x.classList.add(this.state.eventColor);
    x.classList.add(this.state.id);
    x.classList.add("day");
    var attr = document.createAttribute("id");
    attr.value = this.state.id;
    x.setAttributeNode(attr);
    x.onclick = this.onClickHandler;
    this.setState({ showInput: false, id: "" });
  };
  deleteEvent = () => {
    var row = document.getElementById("Jan");
    row.deleteCell(13);
    var x = row.insertCell(13);
    x.innerHTML = "<span>13</span>";
    x.classList.add("day");
  };

  render() {
    console.log(this.weekdaysShort[0]);
    //days in a week
    /*   let weekdays = this.weekdaysShort.map(d => (
      <td className="week-day" key={d}>
        {d}
      </td>
    )); */
    console.log(this.state.data);
    return (
      <div className="calendar-container">
        <table
          className="calendar table table-striped mb-0"
          border="1"
          id="table-to-xls"
        >
          <thead>
            <tr className="calendar-header" data-height="40">
              <td colSpan="14" style={{ textAlign: "right" }}>
                <span
                  onClick={this.yearDecrement}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  &laquo;
                </span>
              </td>
              <td
                colSpan="4"
                className=" text-center heading"
                data-fill-color="FFFF0000"
                data-a-h="center"
                data-a-v="top"
              >
                <span
                  title="Click to change"
                  className="font-weight-bolder h5"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let name = prompt("Enter a name");
                    if (name == undefined || name == NaN || name == "") {
                      alert("Please enter a valid name");
                    } else {
                      this.setState({ calendarName: name });
                    }
                  }}
                >
                  {this.state.calendarName}
                </span>
                <span
                  title="Click to change"
                  style={{ cursor: "pointer" }}
                  onClick={this.yearInput}
                  className="p-2"
                >
                  {this.state.year}
                </span>
              </td>
              <td colSpan="14" style={{ textAlign: "left" }}>
                <span
                  onClick={this.yearIncrement}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  &raquo;
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            {[
              { index: "01", name: "Jan" },
              { index: "02", name: "Feb" },
              { index: "03", name: "Mar" },
              { index: "04", name: "Apr" },
              { index: "05", name: "May" },
              { index: "06", name: "Jun" },
              { index: "07", name: "Jul" },
              { index: "08", name: "Aug" },
              { index: "09", name: "Sep" },
              { index: 10, name: "Oct" },
              { index: 11, name: "Nov" },
              { index: 12, name: "Dec" }
            ].map(m => (
              <tr key={m.idex} id={m.name}>
                <td
                  className="Month"
                  data-a-h="center"
                  data-a-v="middle"
                  data-fill-color="00bfff"
                  data-b-a-c="FFFFOOOO"
                >
                  {m.name}
                </td>
                {this.setMonth(this.state.year + "-" + m.index + "-01")}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          {/* <ReactHTMLTableToExcel
            id="download-button"
            className="download-table-xls-button"
            table="table-to-xls"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Download as Excel"
          /> */}
          <button
            onClick={() =>
              TableToExcel.convert(document.getElementById("table-to-xls"))
            }
          >
            click
          </button>
          {this.state.showInput ? (
            <form className="form-input bg-light shadow rounded p-3 text-center">
              <div className="p-2">
                <input
                  type="text"
                  name="event"
                  onChange={this.onChangehandler}
                  value={this.state.event}
                  placeholder="Type here..."
                  autoFocus
                />
              </div>
              <div>
                <div className="bg-danger rounded text-white d-inline p-2 m-1">
                  <input
                    type="radio"
                    value="event-red"
                    name="eventColor"
                    onClick={this.onChangehandler}
                  />
                  <label>Red</label>
                </div>
                <div className="bg-success d-inline p-2 m-1 rounded text-white">
                  <input
                    type="radio"
                    value="event-green"
                    name="eventColor"
                    onClick={this.onChangehandler}
                  />
                  <label>Green</label>
                </div>
                <div className="bg-primary d-inline p-2 m-1 rounded text-white">
                  <input
                    type="radio"
                    value="event-blue"
                    name="eventColor"
                    onClick={this.onChangehandler}
                  />
                  <label>Blue</label>
                </div>
              </div>
              <button
                className="btn btn-success mr-1 pr-2"
                onClick={this.buttonClick}
              >
                &#10003;
              </button>
              <button
                className="btn btn-danger"
                onClick={() =>
                  this.setState({ showInput: false, id: "", event: "" })
                }
              >
                &times;
              </button>
            </form>
          ) : null}
        </div>
      </div>
    );
  }
}
