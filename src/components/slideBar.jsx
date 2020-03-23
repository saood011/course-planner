import React from "react";
import SlidingPanel from "react-sliding-side-panel";
import moment from "moment";

const SlideBar = props => {
  return (
    <div>
      <SlidingPanel
        type={"left"}
        isOpen={props.isOpen}
        size={24}
        panelContainerClassName={"slide-bar"}
      >
        <div>
          <div className="d-flex flex-wrap justify-content-center ">
            <h3 className=" p-2 m-1">Vacations</h3>
            <table className="table table-striped table-sm">
              <tbody>
                {props.vacations
                  .sort((a, b) => {
                    var dateA = new Date(a.id),
                      dateB = new Date(b.id);
                    return dateA - dateB;
                  })
                  .map((v, i) => (
                    <tr>
                      <td>{i + 1}.</td>
                      <td>{moment(v.id).format("ll")}</td>
                      <td>{v.event}</td>
                      <td>
                        <span
                          onClick={() => props.delVacation(v.id)}
                          className="delVacation text-danger "
                        >
                          <i class="material-icons">delete_forever</i>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              className="btn btn-sm btn-danger m-1"
              onClick={() => props.handleSlider()}
            >
              close
            </button>
          </div>
        </div>
      </SlidingPanel>
    </div>
  );
};

export default SlideBar;
