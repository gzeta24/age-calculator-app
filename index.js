const inputDay = document.querySelector(".input-day");
const inputMonth = document.querySelector(".input-month");
const inputYear = document.querySelector(".input-year");
const submit = document.getElementById("button");
const outDays = document.getElementById("days");
const outMonths = document.getElementById("months");
const outYears = document.getElementById("years");
const date = new Date();
const currentYear = date.getFullYear();
const errorMessages = [document.getElementById("required-p-day"), document.getElementById("required-p-month"), document.getElementById("required-p-year")];
const inputTitles = [document.getElementById("title-day"), document.getElementById("title-month"), document.getElementById("title-year")];

// FUNCTIONS

const is_leap_year = (year) => { // verify if the year is a leap year or not
    if (year != 0 && year % 4 == 0) {
        if (year % 100 == 0) {
            return (year % 400 == 0);
        } else {
        return true;
        }
    }
    return false;
}

const fields_required = (v, p, t, i, msg) => { // v = valid or not. p = p element. t = title, ex: day, month. i = input element.
    if (v == 0) {
        p.innerText = "";
        p.style.marginTop = '0';
        t.style.color = 'hsl(0, 1%, 44%)';
        i.style.borderColor = 'hsl(0, 0%, 93%)';
    } else {
        if (i.value == "") {
            p.innerText = "This field is required";
        } else if (i == inputYear && parseInt(i.value) <= 0) {
            p.innerText = "Year must be greater than zero";
        } else {
            p.innerText = msg;
        }
        p.style.marginTop = '0.3rem';
        t.style.color = 'hsl(0, 100%, 67%)';
        i.style.borderColor = 'hsl(0, 100%, 67%)';
    }
}

const validate_input = (input, min, max) => {
    if (input > min && input <= max) {
        return 0;
    }
    return 1;
}

const is_valid_date = (date, dpm) => {
    let states = [0, 0, 0] // 0 is valid, 1 is invalid
    let dateInputs = [inputDay, inputMonth, inputYear]
    const messages = ["Must be a valid day", "Must be a valid month", "Must be in the past"]
    const day = parseInt(date.substr(0, 2));
    const month = parseInt(date.substr(2, 2));
    const year = parseInt(date.substr(4, 4));
    if (month != "00") {
        states[0] = validate_input(day, 0, dpm[month - 1]);
    } else {
        states[0] = validate_input(day, 0, 31);
    }
    states[1] = validate_input(month, 0, 12);
    states[2] = validate_input(year, 0, currentYear);
    for (let i = 0; i < 3; i++) {
        fields_required(states[i], errorMessages[i], inputTitles[i], dateInputs[i], messages[i]);
    }
    if (states[0] == 0 && states[1] == 0 && states[2] == 0) {
        return true
    }
}

const calculate_age = () => {
    outDays.innerText = "- -"
    outMonths.innerText = "- -"
    outYears.innerText = "- -"
    const currentDay = date.getDate();
    const currentMonth = date.getMonth() + 1;
    let daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (is_leap_year(inputYear.value)) {
        daysPerMonth[1] = 29;
    } else {
        daysPerMonth[1] = 28;
    }
    const dayValue = (inputDay.value == "") ? "00" : inputDay.value;
    const monthValue = (inputMonth.value == "") ? "00" : inputMonth.value;
    const yearValue = (inputYear.value == "") ? "00" : inputYear.value;
    if (is_valid_date((dayValue.toString() + monthValue.toString() + yearValue.toString()), daysPerMonth)) {
        outYears.innerText = currentYear - inputYear.value - 1;
        calculate_months(inputMonth.value);
        calculate_days(inputDay.value, daysPerMonth);
        if (outMonths.innerText == "11" && inputMonth.value == currentMonth && parseInt(outDays.innerText) >= 0 && inputDay.value <= currentDay) {
            outMonths.innerText = "0"
            outYears.innerText = parseInt(outYears.innerText) + 1
        }
    }
}

const calculate_days = (day, dpm) => { // in: input day and dayspermonth array
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    if (day <= currentDay) {
        outDays.innerText = currentDay - day
    } else if (day > currentDay) {
        outDays.innerText = (dpm[currentMonth - 1] - day) + currentDay;
    }
}

const calculate_months = (month) => { // month: inputMonth
    const currentMonth = date.getMonth() + 1;
    if (month < currentMonth) {
        outYears.innerText = parseInt(outYears.innerText, 10) + 1
        outMonths.innerText = currentMonth - month;
    } else if (month == currentMonth) {
        outMonths.innerText = 11;
    } else {
        outMonths.innerText = 12 - Math.abs(currentMonth - month);
    }
}

const update_value = (input, max) => { // add zeros to complete the field
    if (input.value > 0) {
        if (input.value.length > max) {
            input.value = input.value.slice(1);
        } else {
            let newString = "";
            for (let i = 0; (newString + input.value).length < max; i++) {
                newString += "0";
            }
            input.value = newString + input.value;
        }
    }
}

document.addEventListener('keypress', function(k) {if (k.key == 'Enter') {calculate_age()}})
inputDay.addEventListener('input', () => {update_value(inputDay, 2)});
inputMonth.addEventListener('input', () => {update_value(inputMonth, 2)});
inputYear.addEventListener('input', () => {update_value(inputYear, 4)});
submit.addEventListener('click', calculate_age);