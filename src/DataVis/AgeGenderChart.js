import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import Grid from "@material-ui/core/Grid";
// import ageGenderData from "../data/ageGenderData";

import ageGenderData from "../data/ageGender";

const color = {
  male: "#ff0000",
  female: "#0000ff",
  notStated: "#000000"
};

/**
 * get gender data for expect state
 * @param {Object} expectState state object contains age and gender data
 * @return {Array} list of gender data
 */
function getGenderData(expectState) {
  return expectState["gender"];
}

/**
 * get age chart labels
 * @param {Object} expectState state object contains age and gender data
 * @return {Array} age chart labels
 */
function getAgeChartLabels(expectState) {
  return Object.keys(expectState["age"]);
}

/**
 * get different age range data for different state
 * @param {Array} ageLabel list of different age range
 * @param {int} genderIndex gender indicator, 0 for all, 1 for male, 2 for female, 3 for not stated
 * @param {String} expectState expect state
 * @return {Array} list of age data
 */
function getAgeData(ageLabel, genderIndex, expectState) {
  let list = [];
  for (let i = 0; i < ageLabel.length; i++) {
    list.push(expectState["age"][ageLabel[i]][genderIndex]);
  }
  return list;
}

/**
 * get choosen state data
 * @param {String} state user chosed state
 * @return {Object} object which contains age and gender data for a specific state. Return null if the choosen state data is not available
 */
function getExpectStateData(state) {
  return state.toUpperCase() in ageGenderData ? ageGenderData[state] : null;
}

function AgeGenderChart({ state }) {
  // get choosen state data
  const expectStateData = getExpectStateData(state);
  // gender chart
  const genderChartRef = React.createRef();

  useEffect(() => {
    // only draw graph when state data is available
    if (expectStateData === null) {
      return;
    }
    const genderData = getGenderData(expectStateData);
    let myGenderChartRef = genderChartRef;
    myGenderChartRef = myGenderChartRef.current.getContext("2d");
    new Chart(myGenderChartRef, {
      type: "doughnut",
      data: {
        labels: ["male", "female", "not stated"],
        datasets: [
          {
            label: "Sales",
            data: genderData,
            backgroundColor: [color.male, color.female, color.notStated]
          }
        ]
      }
    });
  }, [ageGenderData]);

  // age chart
  const ageChartRef = React.createRef();

  useEffect(() => {
    // only draw graph when state data is available
    if (expectStateData === null) {
      return;
    }
    const ageChartLabels = getAgeChartLabels(expectStateData);
    const allAgeData = getAgeData(ageChartLabels, 0, expectStateData);
    const maleAgeData = getAgeData(ageChartLabels, 1, expectStateData);
    const femaleAgeData = getAgeData(ageChartLabels, 2, expectStateData);
    const notStatedAgeData = getAgeData(ageChartLabels, 3, expectStateData);

    let myAgeChartRef = ageChartRef;
    myAgeChartRef = myAgeChartRef.current.getContext("2d");
    new Chart(myAgeChartRef, {
      type: "bar",
      data: {
        labels: ageChartLabels,
        datasets: [
          {
            label: "male",
            data: maleAgeData,
            backgroundColor: color.male
          },
          {
            label: "female",
            data: femaleAgeData,
            backgroundColor: color.female
          },
          {
            label: "not stated",
            data: notStatedAgeData,
            backgroundColor: color.notStated
          },
          {
            label: "all",
            data: allAgeData,
            borderColor: "#ebe134",
            fill: false,
            hidden: true,
            type: "line"
          }
        ]
      }
    });
  }, [ageGenderData]);

  if (expectStateData !== null) {
    return (
      <Grid item xs={11} sm={11} md={4}>
        <div className="card">
          <h2>{state.toUpperCase()} Chart</h2>
          <p>Cases by gender</p>
          <canvas id="vicGenderChart" ref={genderChartRef} />
          <p>Cases by age group</p>
          <canvas id="vicAgeRangeChart" ref={ageChartRef} />
        </div>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={11} sm={11} md={4}>
        <h1>Our data team is collecting data for {state}!</h1>
      </Grid>
    );
  }
}

export default AgeGenderChart;
