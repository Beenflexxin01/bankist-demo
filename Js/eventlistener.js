'use strict';

// LOGIN FEATURE😀 EVENT HANDLERS USING THE FIND METHOD
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  // PREVENT FORM FROM SUBMITTING
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // DISPLAY UI AND A WELCOME MESSAGE
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    /////////////////////////////////////
    // FIXING THE DATES
    // Experimenting using Internationalization API
    /////////////////////////////////////

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    /////////////////////////////////////
    // CLEAR INPUT FIELDS
    /////////////////////////////////////

    inputLoginUsername.value = inputLoginPin.value = '';

    /////////////////////////////////////
    // BLUR CURSOR
    /////////////////////////////////////

    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

/////////////////////////////////////
// IMPLEMENTING TRANSFER BUTTON USING FIND
/////////////////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    /////////////////////////////////////
    // MAKING THE TRANSFER
    /////////////////////////////////////
    // Debit Giver
    currentAccount.movements.push(-amount);

    // Credit Receiver
    receiverAcc.movements.push(amount);

    // Add Tf Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Updating the account
    updateUI(currentAccount);

    // RESET TIMER 
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

/////////////////////////////////////
// IMPLEMENTING THE LOAN BUTTON USING SOME METHOD
/////////////////////////////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    // ADD MOVEMENT
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
      // UPDATE UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

/////////////////////////////////////
// IMPLEMENTING CLOSING (DELETING) ACCOUNT USING FINDINDEX METHOD
/////////////////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // CALACULATING THE INTENDED DELETING INDEX
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

/////////////////////////////////////
// SORT BTN CONTINUATIONN
/////////////////////////////////////

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
});
