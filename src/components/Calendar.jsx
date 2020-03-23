import React from "react";
import moment from "moment";
import "./calendar.css";
import TableToExcel from "@linways/table-to-excel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SlideBar from "./slideBar";
import GoogleCal from "./googleCal";
require("moment-weekday-calc");

export default class Calendar extends React.Component {
  state = {
    today: moment(),
    start: "",
    active: "kickoff",
    isKickOff: true,
    year: 2020,
    calendarName: "FbW7",
    showInput: false,
    showYearPopup: false,
    id: "",
    event: "Vacation",
    eventColor: "event-vacation",
    courseRendered: false,
    internshipStarts: "",
    data: [],
    mentoring: [],
    languageCourse: [],
    isSliderOpen: false,
    vacations: [
      {
        id: "2020-02-01",
        event: "Vacation",
        color: "event-vacation",
        hex: "ff4e50"
      }
    ],
    publicHolidays: [],
    initialDay: {
      days: 8,
      event: "Basic Comp Lit",
      color: "event-blue",
      hex: "a8e6cf"
    },
    days: [
      { event: "UI Basics", color: "event-red", days: 32, hex: "ffb3ba" },
      { event: "Prog. Basics", color: "event-green", days: 32, hex: "dcedc1" },
      { event: "Browser", color: "event-orange", days: 12, hex: "ffd3b6" },
      { event: "Node", color: "event-yellow", days: 8, hex: "ffeead" },
      { event: "SPA", color: "event-blue", days: 24, hex: "a8e6cf" },
      { event: "Data Server", color: "event-red", days: 24, hex: "ffb3ba" },
      {
        event: "Full-Stack Server",
        color: "event-green",
        days: 8,
        hex: "dcedc1"
      },
      {
        event: "Digital Skills Training",
        color: "event-orange",
        days: 4,
        hex: "ffd3b6"
      },
      {
        event: "Final Project",
        color: "event-yellow",
        days: 28,
        hex: "ffeead"
      },
      {
        event: "Internship",
        color: "event-green",
        days: 40,
        hex: "dcedc1"
      }
    ],
    googleCalSliderOpen: true
  };
  setPublicHolidays = data => {
    this.setState({ publicHolidays: data });
  };

  handleSlider = () => {
    this.setState({ isSliderOpen: false });
  };
  handleGoogleSlider = () => {
    this.setState({ googleCalSliderOpen: false });
  };
  savedData = data => {
    if (parseInt(data.id.slice(0, 4)) === this.state.year) {
      var cell = document.getElementById(data.id);
      cell.innerHTML =
        //converting if 01 to 1 and 10 remains 10
        (data.id.slice(-2).charAt(0) == "0"
          ? data.id.slice(-1)
          : data.id.slice(-2)) +
        " " +
        this.weekdaysShort[moment(data.id).day()].slice(0, 2) +
        " | " +
        data.event;
      cell.classList.add(data.color);
      cell.classList.add("pl-2");
      var attr = document.createAttribute("data-fill-color");
      attr.value = data.hex;
      cell.setAttributeNode(attr);
      // adding an span to show delete icon on hover
      var node = document.createElement("span");
      var textnode = document.createTextNode(" ");
      node.appendChild(textnode);
      document.getElementById(data.id).appendChild(node);
      var attr2 = document.createAttribute("class");
      attr2.value = "delete";
      node.setAttributeNode(attr2);
      var attr3 = document.createAttribute("data-f-color");
      attr3.value = "FFFFOOOO";
      node.setAttributeNode(attr3);
      node.onclick = () =>
        this.state.active === "mentoring"
          ? this.delMentoring(data.id)
          : this.state.active === "language"
          ? this.delLanguage(data.id)
          : null;
    }
  };

  notify = () =>
    toast.success(
      this.state.event.toUpperCase() +
        " event successfully added on " +
        moment(this.state.id).format("ll"),
      {
        position: toast.POSITION.BOTTOM_RIGHT
      }
    );
  notifyWrongClick = () =>
    toast.error("Wrong Click, Please click on the empty space!!!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });

  notifyClickToStart = () =>
    toast.success("Click on a day to select a starting date!!!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  notifyDelVacWrongYear = id =>
    toast.error(`Go to the year ${moment(id).year()} to delete it.`, {
      position: toast.POSITION.TOP_CENTER
    });

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

  onClickHandler = async e => {
    await this.setState({ showInput: true, id: e.target.id });
    // console.log(parseInt(e.target.id.slice(0, 2)));
    console.log(this.state.id.slice(-2));
    console.log(this.state.id.slice(5, 7));
  };
  onClickKickOff = async e => {
    if (this.state.start === "") {
      await this.setState({ start: e.target.id });
    }
  };

  onChangehandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  yearInput = () => {
    let year = prompt("Enter an year");
    console.log(year);
    if (year === undefined || isNaN(year) || year === "" || year === null) {
      alert("Please enter a valid year - YYYY");
    } else {
      this.setState({ year: parseInt(year) });
    }
  };
  courseInput = () => {
    let name = prompt("Enter a course name");
    console.log(name);
    if (name === undefined || name === "" || name === null) {
      alert("Please enter a valid name");
    } else {
      this.setState({ calendarName: name });
    }
  };

  yearIncrement = () => {
    this.setState({ year: this.state.year + 1 });
    setTimeout(() => {
      this.setState({ isKickOff: !this.state.isKickOff });
    }, 200);
  };
  yearDecrement = () => {
    this.setState({ year: this.state.year - 1 });
    setTimeout(() => {
      this.setState({ isKickOff: !this.state.isKickOff });
    }, 200);
  };

  // add month rows//////////////////////////
  monthRow = day => {
    let monthsGrid = [];
    for (let month = 1; month <= 12; month++) {
      let date =
        this.state.year +
        "-" +
        (month.toString().length === 1 ? "0" + month : month) +
        "-" +
        (day.toString().length === 1 ? "0" + day : day);
      //Current day or normal day ? - adding class
      let className =
        moment().format("YYYY-MM-DD") === date //adding zero if d = 1 to 9
          ? "day current-day"
          : "day";

      if (this.daysInMonth(this.state.year + "-" + month) >= day) {
        monthsGrid.push(
          <td
            data-f-sz="8"
            data-b-a-s="thin"
            data-a-v="top"
            data-a-wrap="true"
            id={date}
            className={className}
            onClick={
              this.state.active === "kickoff"
                ? this.onClickKickOff
                : this.state.active === "vacations"
                ? () => this.buttonClick(date)
                : this.state.active === "mentoring"
                ? () => this.mentoringClick(date)
                : this.state.active === "language"
                ? () => this.languageCourseClick(date)
                : this.state.active === "internship"
                ? this.internshipClick
                : null
            }
          >
            {" "}
            &nbsp;
            <span style={{ paddingRight: "8px" }}>{day}</span>
            <span>&nbsp; </span>
            <span style={{ color: "grey" }}>
              {this.weekdaysShort[
                moment(
                  // eslint-disable-next-line
                  this.state.year + "-" + "0" + month + "-" + day // adding week days i.e Su, Mo to each day
                ).day()
              ].slice(0, 2)}
            </span>
          </td>
        );
      } else {
        monthsGrid.push(<td></td>);
      }
    }
    // console.log(monthsGrid);
    return [...monthsGrid];
  };
  internshipClick = e => {
    if (this.state.start === "") {
      alert("Please start the course first");
    } else {
      this.setState({ internshipStarts: e.target.id });
    }
  };
  printMonth = () => {
    return [...Array(31)].map((v, i) => (
      <tr
        id={i.toString().length === 1 && i !== 9 ? "0" + (i + 1) : i + 1}
        key={this.state.year + "" + i}
        data-height="25"
      >
        {this.monthRow(i + 1)}
      </tr>
    ));
  };
  buttonClick = id => {
    this.setState({ data: [] });

    document.querySelectorAll(".day").forEach(el => {
      el.classList.remove("event-red");
      el.classList.remove("event-green");
      el.classList.remove("event-blue");
      el.classList.remove("event-orange");
      el.classList.remove("event-yellow");
    });
    if (this.state.vacations.length <= 23) {
      this.state.vacations.push({
        id: id,
        event: this.state.event,
        color: "event-vacation",
        hex: "ff4e50"
      });

      this.setState({ id: "" });
    } else {
      alert("Can not add more than 24 vacations in a year");
    }

    this.printCalendar(); // to update calendar and vacation in real time
  };
  mentoringClick = id => {
    this.setState({ data: [] });
    document.querySelectorAll(".day").forEach(el => {
      el.classList.remove("event-red");
      el.classList.remove("event-green");
      el.classList.remove("event-blue");
      el.classList.remove("event-orange");
      el.classList.remove("event-yellow");
    });
    if (this.state.mentoring.length <= 11) {
      this.state.mentoring.push({
        id: id,
        event: "mentoring",
        color: "event-mentoring"
      });

      this.setState({ id: "" });
    } else {
      alert("Can not add more than 12 mentoring in a year");
    }
    this.printCalendar(); // to update calendar and vacation in real time
  };

  languageCourseClick = id => {
    this.setState({ data: [] });
    document.querySelectorAll(".day").forEach(el => {
      el.classList.remove("event-red");
      el.classList.remove("event-green");
      el.classList.remove("event-blue");
      el.classList.remove("event-orange");
      el.classList.remove("event-yellow");
    });
    if (this.state.languageCourse.length <= 24) {
      this.state.languageCourse.push({
        id: id,
        event: "Language",
        color: "event-language"
      });

      this.setState({ id: "" });
    } else {
      alert("Can not add more than 12 language in a year");
    }
    this.printCalendar(); // to update calendar and vacation in real time
  };
  componentDidMount() {
    this.notifyClickToStart();
    localStorage.getItem("publicHolidays") &&
      JSON.parse(localStorage.getItem("publicHolidays")).map(v =>
        this.savedData(v)
      );
  }
  shouldComponentUpdate() {
    this.state.data.map(v => this.savedData(v));
    this.state.vacations.map(v => this.savedData(v));
    this.state.mentoring.map(v => this.savedData(v));
    this.state.languageCourse.map(v => this.savedData(v));
    localStorage.getItem("publicHolidays") &&
      JSON.parse(localStorage.getItem("publicHolidays")).map(v =>
        this.savedData(v)
      );
    return true;
  }
  internshipDays(date, days) {
    date = moment(date); // clone
    while (days > 0) {
      // decrease "days" only if it's a weekday.
      if (
        date.isoWeekday() !== 6 &&
        date.isoWeekday() !== 7 &&
        date.isoWeekday() !== 5 &&
        // eslint-disable-next-line
        !this.state.vacations.some(v => v.id === date.format("YYYY-MM-DD")) &&
        !this.state.publicHolidays.some(v => v.id === date.format("YYYY-MM-DD"))
      ) {
        days -= 1;
        this.state.data.push({
          id: date.format("YYYY-MM-DD"),
          event: "Internship",
          color: "event-blue",
          hex: "fff"
        });
      }
      date = date.add(1, "days");
    }
  }

  start = "";
  workingDays(date, days, event, color, hex) {
    date = moment(date); // clone
    while (days > 0) {
      // decrease "days" only if it's a weekday.
      if (
        date.isoWeekday() !== 6 &&
        date.isoWeekday() !== 7 &&
        date.isoWeekday() !== 5 &&
        // eslint-disable-next-line
        !this.state.vacations.some(v => v.id === date.format("YYYY-MM-DD")) &&
        !this.state.mentoring.some(v => v.id === date.format("YYYY-MM-DD")) &&
        !this.state.languageCourse.some(
          v => v.id === date.format("YYYY-MM-DD")
        ) &&
        !this.state.publicHolidays.some(v => v.id === date.format("YYYY-MM-DD"))
      ) {
        days -= 1;
        this.state.data.push({
          id: date.format("YYYY-MM-DD"),
          event: event,
          color: color,
          hex: hex
        });
      }
      date = date.add(1, "days");
    }
    this.start = date;
  }

  blankDays(start, end) {
    start = moment(start);
    end = moment(end);
    let days = end.diff(start, "days");
    console.log(days);

    this.state.start &&
      // eslint-disable-next-line
      [...Array(days - 1)].map(v => {
        start = start.add(1, "days");
        this.state.data.push({
          id: start.format("YYYY-MM-DD"),
          event: this.weekdaysShort[start.day()],
          color: "event-grey",
          hex: "d4d8d4"
        });
      });
  }
  countKickOffDays = () => {
    return this.state.data.filter(v => v.color !== "event-grey");
  };

  printCalendar = () => {
    if (this.countKickOffDays() >= 230) {
      this.setState({ data: [] });
    }
    this.workingDays(
      this.state.start,
      this.state.initialDay.days,
      this.state.initialDay.event,
      this.state.initialDay.color,
      this.state.initialDay.hex
    );
    this.blankDays("2020-01-01", this.state.start);

    // Rest of the event takes the value emitted by the function to start variable
    this.state.days.map(v =>
      this.workingDays(this.start, v.days, v.event, v.color, v.hex)
    );
  };
  delVacation = id => {
    if (moment(id).year() === this.state.year) {
      this.setState({ data: [] });
      document.querySelectorAll(".day").forEach(el => {
        el.classList.remove("event-red");
        el.classList.remove("event-green");
        el.classList.remove("event-blue");
        el.classList.remove("event-orange");
        el.classList.remove("event-yellow");
      });
      this.state.vacations.map(v => {
        console.log(id);

        if (id === v.id) {
          this.state.vacations.splice(this.state.vacations.indexOf(v), 1);
          document.getElementById(v.id).classList.remove("event-vacation");
          document.getElementById(v.id).innerHTML = `  <span class="reborn">${
            id.slice(-2).charAt(0) == "0" ? id.slice(-1) : id.slice(-2)
          }</span>
          <span style='color:grey;'>
          ${this.weekdaysShort[moment(id).day()].slice(0, 2)}
          </span>`;
        }
      });
      this.printCalendar();
    } else {
      this.notifyDelVacWrongYear();
    }
  };
  delMentoring = id => {
    this.setState({ data: [] });

    document.querySelectorAll(".day").forEach(el => {
      el.classList.remove("event-red");
      el.classList.remove("event-green");
      el.classList.remove("event-blue");
      el.classList.remove("event-orange");
      el.classList.remove("event-yellow");
    });
    this.state.mentoring.map(v => {
      console.log(id);

      if (id === v.id) {
        this.state.mentoring.splice(this.state.mentoring.indexOf(v), 1);
        document.getElementById(v.id).classList.remove("event-mentoring");
        document.getElementById(v.id).innerHTML = `  <span class='reborn'>${
          id.slice(-2).charAt(0) == "0" ? id.slice(-1) : id.slice(-2)
        }</span>
        <span  style="color:grey;">
          ${this.weekdaysShort[moment(id).day()].slice(0, 2)}
        </span>`;
      }
    });
    this.printCalendar();
    this.setState({ isKickOff: !this.state.isKickOff });
  };
  delLanguage = id => {
    this.setState({ data: [] });

    document.querySelectorAll(".day").forEach(el => {
      el.classList.remove("event-red");
      el.classList.remove("event-green");
      el.classList.remove("event-blue");
      el.classList.remove("event-orange");
      el.classList.remove("event-yellow");
    });
    this.state.languageCourse.map(v => {
      console.log(id);

      if (id === v.id) {
        this.state.languageCourse.splice(
          this.state.languageCourse.indexOf(v),
          1
        );
        document.getElementById(v.id).classList.remove("event-language");
        document.getElementById(v.id).innerHTML = `  <span class='reborn'>${
          id.slice(-2).charAt(0) == "0" ? id.slice(-1) : id.slice(-2)
        }</span>
        <span  style="color:grey;">
          ${this.weekdaysShort[moment(id).day()].slice(0, 2)}
        </span>`;
      }
    });
    this.printCalendar();
    this.setState({ isKickOff: !this.state.isKickOff });
  };

  render() {
    //First event takes start date from state
    console.log(this.state.data.length);
    console.log(this.state.vacations);
    console.log(this.countKickOffDays());
    this.internshipDays(this.state.internshipStarts, 40);
    return (
      <div className="calendar-container">
        <ToastContainer />
        <SlideBar
          vacations={this.state.vacations}
          isOpen={this.state.isSliderOpen}
          delVacation={this.delVacation}
          handleSlider={this.handleSlider}
        />
        <GoogleCal
          isOpen={this.state.googleCalSliderOpen}
          handleSlider={this.handleGoogleSlider}
          setPublicHolidays={this.setPublicHolidays}
        />
        <table
          className="calendar table table-striped mb-0"
          border="1"
          id="table-to-xls"
          data-cols-width="11,11,11,11,11,11,11,11,11,11,11,11"
        >
          <thead>
            <tr className="calendar-header border-dark" data-exclude="true">
              <td colSpan="10" className="bg-dark p-0 ">
                <span
                  className={
                    this.state.active === "kickoff"
                      ? "btn btn-sm m-2 btn-danger"
                      : "btn btn-sm m-2 btn-dark"
                  }
                  onClick={() => {
                    this.setState({
                      isKickOff: !this.state.isKickOff,
                      active: "kickoff"
                    });
                  }}
                >
                  Course Kickoff
                </span>

                <span
                  class="dropdown"
                  onClick={() => {
                    this.setState({
                      isKickOff: !this.state.isKickOff,
                      active: "vacations"
                    });
                  }}
                >
                  <button
                    className={
                      this.state.active === "vacations"
                        ? "btn btn-sm m-2 btn-danger"
                        : "btn btn-sm m-2 btn-dark"
                    }
                    type="button"
                    id="dropdownMenu2"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.event}
                    <span class="badge badge-warning ml-1">
                      {this.state.vacations.length}
                    </span>
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        this.setState({
                          isKickOff: !this.state.isKickOff,
                          event: "Vacation"
                        });
                      }}
                    >
                      Full-day vacation
                    </button>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        this.setState({
                          isKickOff: !this.state.isKickOff,
                          event: "Half day vacation"
                        });
                      }}
                    >
                      Half-day vacation
                    </button>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        this.setState({
                          isKickOff: !this.state.isKickOff,
                          isSliderOpen: !this.state.isSliderOpen
                        });
                      }}
                    >
                      Show List/Delete
                    </button>
                  </div>
                </span>

                <span
                  className={
                    this.state.active === "mentoring"
                      ? "btn btn-sm m-2 btn-danger"
                      : "btn btn-sm m-2 btn-dark"
                  }
                  onClick={() => this.setState({ active: "mentoring" })}
                >
                  Mentoring
                  <span class="badge badge-warning ml-1">
                    {this.state.mentoring.length}
                  </span>
                </span>
                <span
                  className={
                    this.state.active === "language"
                      ? "btn btn-sm m-2 btn-danger"
                      : "btn btn-sm m-2 btn-dark"
                  }
                  onClick={() => this.setState({ active: "language" })}
                >
                  Langugage Course
                  <span class="badge badge-warning ml-1">
                    {this.state.languageCourse.length}
                  </span>
                </span>
                <span
                  className={
                    this.state.active === "internship"
                      ? "btn btn-sm m-2 btn-danger"
                      : "btn btn-sm m-2 btn-dark"
                  }
                  onClick={() => this.setState({ active: "internship" })}
                >
                  Internship
                </span>

                <span className="btn btn-sm m-2 btn-dark pr-2 pl-2">+</span>
                {this.state.start ? (
                  <>
                    <button
                      className="btn btn-sm btn-primary blink"
                      id="blink"
                      onClick={() => {
                        this.printCalendar();
                        this.setState({ isKickOff: !this.state.isKickOff });
                        document
                          .getElementById("blink")
                          .classList.remove("blink");
                      }}
                    >
                      Start{this.state.data.length > 121 ? "ed" : ""} from{" "}
                      {moment(this.state.start).format("Do MMM")}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary ml-1"
                      onClick={() => {
                        this.setState({ start: "", data: [] });
                        setTimeout(() => {
                          document.querySelectorAll(".day").forEach(el => {
                            el.classList.remove("event-red");
                            el.classList.remove("event-green");
                            el.classList.remove("event-blue");
                            el.classList.remove("event-orange");
                            el.classList.remove("event-yellow");
                            el.classList.remove("event-grey");
                          });
                          this.notifyClickToStart();
                        }, 1000);
                      }}
                    >
                      Reset
                    </button>
                  </>
                ) : null}
              </td>
              <td className="bg-dark text-right p-0 setting-icon">
                <span
                  class="nav-link text-white"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="material-icons settings">settings</i>
                </span>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <span
                    class="dropdown-item"
                    onClick={() => this.setState({ googleCalSliderOpen: true })}
                  >
                    Public Holidays
                  </span>
                  <span class="dropdown-item">Color setting</span>
                  <span class="dropdown-item">Curriculum setting</span>
                  <div class="dropdown-divider"></div>
                  <span class="dropdown-item">Close</span>
                </div>
              </td>
              <td className="bg-dark text-center p-0 setting-icon">
                <button
                  id="download-button"
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    TableToExcel.convert(
                      document.getElementById("table-to-xls"),
                      {
                        name: `Calendar-${this.state.calendarName}-${this.state.year}.xlsx`,
                        sheet: {
                          name: this.state.year
                        }
                      }
                    )
                  }
                >
                  Download
                </button>
              </td>
            </tr>
            <tr
              className="bg-dark text-center h3 calendar-header"
              data-height="35"
            >
              <td colSpan="11" className="p-0" data-f-sz="20" data-a-h="center">
                {" "}
                <span
                  style={{
                    marginRight: "20px",
                    padding: "10px",
                    cursor: "pointer"
                  }}
                  className="text-white font-weight-bolder"
                  onClick={this.courseInput}
                >
                  {this.state.calendarName}
                </span>
                <span
                  className="text-white"
                  onClick={this.yearDecrement}
                  style={{ cursor: "pointer" }}
                >
                  &laquo;
                </span>
                <span
                  className="text-white"
                  onClick={this.yearInput}
                  style={{ padding: "10px", cursor: "pointer" }}
                >
                  {this.state.year}
                </span>
                <span
                  className="text-white"
                  onClick={this.yearIncrement}
                  style={{ cursor: "pointer" }}
                >
                  &raquo;
                </span>
              </td>
              <td data-exclude="true">
                <span
                  className="text-white"
                  title="Go to current year"
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "68px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                  onClick={() => this.setState({ year: moment().year() })}
                >
                  {moment().format("LLLL")}
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="Month" data-height="28">
              {moment.monthsShort().map(v => (
                <td
                  data-fill-color="FFCF40"
                  data-b-a-s="thin"
                  className="month-cell"
                  data-a-h="center"
                  data-a-v="middle"
                >
                  {v}
                </td>
              ))}
            </tr>
            {this.printMonth()}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <footer className="bg-dark w-100 text-white p-1">
            SA7 Inc. &copy; {moment().year()} - Programmed and Designed by Saood
          </footer>
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
