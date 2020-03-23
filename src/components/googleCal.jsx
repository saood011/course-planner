import React, { Component } from "react";
import { gapi } from "gapi-script";
import SlidingPanel from "react-sliding-side-panel";
import moment from "moment";
import german from "../img/german.jpg";
import english from "../img/english.jpg";

export default class googleCal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      events: [],
      publicHolidays: [],
      language: "en",
      fullDay: "full"
    };
  }

  componentDidMount = () => {
    this.getEvents();
    localStorage.getItem("publicHolidays") &&
      JSON.parse(localStorage.getItem("publicHolidays")).map(v =>
        this.state.publicHolidays.push(v)
      );
  };

  getEvents() {
    let that = this;
    function start() {
      gapi.client
        .init({
          apiKey: "AIzaSyCUdF-tOTd-CcoUIwrzX7_LQ6zgHj3atWk"
        })
        .then(function() {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${that.state.language}.german%23holiday%40group.v.calendar.google.com/events?key=AIzaSyCUdF-tOTd-CcoUIwrzX7_LQ6zgHj3atWk`
          });
        })
        .then(
          response => {
            let events = response.result.items;
            that.setState(
              {
                events,
                isLoading: false
              },
              () => {
                console.log(that.state.events);
              }
            );
          },
          function(reason) {
            console.log(reason);
          }
        );
    }
    gapi.load("client", start);
  }
  languageChange = language => {
    this.setState({ language });
    this.getEvents();
  };
  addHoliday = data => {
    this.state.publicHolidays.push(data);
    console.log(data);
    console.log(this.state.publicHolidays);

    document.getElementsByClassName(data.id)[0].style.background = "lightblue";
    setTimeout(() => {
      document.getElementsByClassName(data.id)[0].style.background =
        "lightgrey";
    }, 1000);
    this.setState({ fullDay: "full" });
    this.forceUpdate();
  };
  addAll = () => {
    this.state.events
      .filter(v => !v.summary.includes("("))
      .map(v =>
        this.state.publicHolidays.push({
          event: v.summary,
          id: v.start.date,
          color: "event-vacation",
          hex: "ff4e50"
        })
      );
    this.forceUpdate();
  };
  delHoliday = id => {
    this.state.publicHolidays.map(v => {
      if (v.id == id) {
        this.state.publicHolidays.splice(
          this.state.publicHolidays.indexOf(v),
          1
        );
      }
    });
    this.forceUpdate();
  };

  render() {
    return (
      <div>
        <SlidingPanel
          type={"right"}
          isOpen={this.props.isOpen}
          size={40}
          panelContainerClassName={"slide-bar"}
        >
          {this.state.isLoading ? (
            <div className="d-flex flex-wrap justify-content-center p-1">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex flex-wrap justify-content-center p-1">
                <div className="d-flex justify-content-between">
                  <p
                    className="bg-danger rounded-left pointer m-3 google-slider-close position-absolute"
                    onClick={() => this.props.handleSlider()}
                  >
                    &times;
                  </p>
                  <h3 className=" p-2  m-1">Public Holidays</h3>
                  <div className="d-flex m-3">
                    <img
                      className=" pointer m-1"
                      onClick={() => this.languageChange("de")}
                      alt="de"
                      src={german}
                      height="20px"
                    />

                    <img
                      className=" pointer m-1"
                      onClick={() => this.languageChange("en")}
                      alt="de"
                      src={english}
                      height="20px"
                    />
                  </div>
                </div>
                <table
                  className="table table-hover table-sm"
                  id="table-public-holidays"
                >
                  <tbody>
                    {this.state.publicHolidays.length > 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center bg-dark text-white"
                        >
                          Holidays to be added to your calendar
                        </td>
                      </tr>
                    )}
                    {this.state.publicHolidays.map((v, i) => (
                      <tr className="bg-secondary text-white" key={i + "a"}>
                        <td style={{ wordBreak: "break-word" }}>{v.event}</td>
                        <td>{moment(v.id).format("ll")}</td>
                        <td></td>
                        <td>
                          <span
                            className="btn btn-sm btn-danger"
                            onClick={() => this.delHoliday(v.id)}
                          >
                            &times;
                          </span>
                        </td>
                      </tr>
                    ))}
                    {this.state.publicHolidays.length > 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <span
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              this.props.setPublicHolidays(
                                this.state.publicHolidays
                              );
                              localStorage.setItem(
                                "publicHolidays",
                                JSON.stringify(this.state.publicHolidays)
                              );
                              window.location.reload();
                            }}
                          >
                            Apply
                          </span>
                        </td>
                        <td>
                          {" "}
                          <span
                            className="pointer"
                            onClick={() => {
                              this.setState({ publicHolidays: [] });
                              localStorage.removeItem("publicHolidays");
                              window.location.reload();
                            }}
                          >
                            Delete All
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-white bg-dark"
                      >
                        Public Holidays in Germany
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-center">
                        <span
                          onClick={this.addAll}
                          className="btn btn-sm btn-success"
                        >
                          Add all except regional
                        </span>
                      </td>
                    </tr>
                    {this.state.events
                      .filter(
                        v => moment(v.start.date).year() !== moment().year() - 1
                      )
                      .map((v, i) => (
                        <tr key={i} className={v.start.date}>
                          <td>{v.summary}</td>
                          <td>{moment(v.start.date).format("ll")}</td>
                          {/*    <td>
                          {moment(v.end.date).diff(
                            moment(v.start.date).format("ll"),
                            "days"
                          )}
                        </td> */}
                          <td>
                            <select
                              id="days"
                              onChange={e =>
                                this.setState({ fullDay: e.target.value })
                              }
                            >
                              <option value="full">FullDay</option>
                              <option value="half">HalfDay</option>
                            </select>
                          </td>
                          <td
                            onClick={() =>
                              this.addHoliday({
                                event:
                                  v.summary +
                                  (this.state.fullDay == "full"
                                    ? ""
                                    : "/ HalfDay"),
                                id: v.start.date,
                                color: "event-vacation",
                                hex: "ff4e50"
                              })
                            }
                          >
                            {" "}
                            <span className="btn btn-sm btn-success ">+</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <button
                  className="btn btn-sm btn-danger m-1"
                  onClick={() => this.props.handleSlider()}
                >
                  close
                </button>
              </div>
            </div>
          )}
        </SlidingPanel>
      </div>
    );
  }
}
