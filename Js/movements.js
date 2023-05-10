'use strict';

/////////////////////////////////////
//DISPLAY THE DEPOSITS AND WITHDRAWALS
/////////////////////////////////////

const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = ''; //TO MAKE THE ALREADY WRITTEN FIGURES IN HTML TO DISAPPEAR.

  /////////////////////////////////////
  // SORT BUTTON
  /////////////////////////////////////

  const movs = sort
    ? acc.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////
//DISPLAYING THE MAIN BALANCE USING REDUCE METHOD
/////////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

/////////////////////////////////////
// DISPLAY SUMMARY [in, out, interets] USING CHAINING METHOD - ARROW METHOD
/////////////////////////////////////

const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  //BANK INTRODUCE RULE; PAY INT IF IT IS AT LEAST $1
  // .filter((int, i, arr) => {
  //   return int >= 1;
  // })
};
/////////////////////////////////////
// UPDATE UI FUNCTION
/////////////////////////////////////

const updateUI = function (acc) {
  // DISPLAY MOVEMENT
  displayMovement(acc);

  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  displaySummary(acc);
};

/////////////////////////////////////
// LOGOUT TIMER..........
/////////////////////////////////////

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When we reach 0sec, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    // Decrease 1sec
    time--;
  };
  // Set Time to 5mins
  let time = 240;
  // Call Timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
