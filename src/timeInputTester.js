let testerInput = document.createElement('input');
testerInput.setAttribute("type", "time");
testerInput.setAttribute("value", "00:00:00");
testerInput.setAttribute("pattern", "^[0-9]{1,9}:[0-5][0-9]:[0-5][0-9]$");
testerInput.setAttribute("step", "1");
testerInput.stepUp();
console.log("testerInput value : ", testerInput.value)
document.body.appendChild(testerInput);

const isTimeInputCompatible = testerInput.value.match(new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$", 'i')) !== null;
export default isTimeInputCompatible;