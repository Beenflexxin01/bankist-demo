'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
/*
const account1 = {
  owner: 'Adenola Omotayo',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
// ARRAY METHODS
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE DOES NOT MUTATES THE ORIGINAL ARRAY (SPLICE, SLICE, CONCAT)
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

// CONCAT METHOD (ADD BOTH) // Works like the spread operator
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));
*/
// LOOPING WITH FOR EACH
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${movement}`);
//   }
// }
/*
console.log('--- COUNTER VARIABLE ---- ');
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${1 + i}: You were credited ${movement}`);
  } else {
    console.log(`Movement ${1 + i}: You were debited ${Math.abs(movement)}`);
  }
}

console.log('----- FOR EACH ----');
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
});

console.log('--- FOR EACH COUNTER VARIABLE ----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(
      `Movement ${
        i + 1
      }: ${mov} have just been added to your account. You have xxx bal.`
    );
  } else {
    console.log(
      `Movement ${i + 1}: ${Math.abs(
        mov
      )} have been withdrawn from your account. You have xxx bal`
    );
  }
});
// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value} `);
});
console.log('---- FOR OF----');
for (const [value, key] of currencies) {
  console.log(`${value}: ${key}`);
}

// SET
const currecyUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currecyUnique);

currecyUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// DATA TRANSFORMATION: MAP METHOD
const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// USING ARROW FUNCTION
const movementsUSD = movements.map(mov => mov * euroToUsd);
console.log(movements);
console.log(movementsUSD);

console.log('--- FOR OF -----');
const movementUsdFor = [];
for (const mov of movements) movementUsdFor.push(mov * euroToUsd);
console.log(movementUsdFor);

console.log('--- MAPS WITH ARROW METHOD ----');
const movementDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You deposited ${
      mov > 0 ? 'deposited' : 'withdrew'
    } ${Math.abs(mov)}`
);
console.log(movementDescription);
console.log('--- MAPS WITH FUNCTION METHOD ----');

const movementsMap = movements.map(function (mov, i) {
  if (mov > 0) {
    return `Movement ${i + 1}: You just deposited ${mov}`;
  } else {
    return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  }
});

console.log(movementsMap);
// FILTER METHOD
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (movs) {
  return movs < 0;
});
console.log(withdrawals);

// REDUCE METHOD
console.log(movements);
// ACCUMULATOR IS LIKE A SNOWBALL
const balance = movements.reduce(function (acc, current, i, arr) {
  console.log(`iteration ${i}: ${acc}`); //NOT IMPORTANT
  return acc + current;
}, 0);
console.log(balance);

//ARROW METHOD
// const balance = movements.reduce((acc, current) => acc + current, 0);

//FOR OF METHOD
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// missing value
const max = movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
}, movements[0]);
console.log(max);

const maxF = movements.reduce(function (acc, cur, i, arr) {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
}, movements[0]);
console.log(maxF);


// ARROW CHAINING METHODS [PIPELINE]
const euroToUsd = 1.1;
const totalDepositsToUsd = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * euroToUsd;
  })
  // .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsToUsd);

// FUNCTION CHAINING METHOD
const functions = movements
  .map(function (mov) {
    return mov * euroToUsd;
  })
  .filter(function (mov) {
    return mov > 0;
  })
  .reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
console.log(functions);
*
// THE FIND METHOD
const firstWithdrawal = movements.find(function (mov) {
  return mov < 0;
});
console.log(movements);
console.log(firstWithdrawal);

const account = accounts.find(function (acc) {
  return acc.owner === `Jessica Davis`;
});
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
let accountt = [];
for (const account of accounts)
  if (account.owner === `Jessica Davis`) accountt.push(account);
///////////////////////////////////////
console.log(accountt);
// Coding Challenge #1
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, 
and stored the data into an array (one array for each). For now, they are just interested in knowing 
whether a dog is an adult or a puppy.
 A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and 
the LAST TWO dogs actually have cats,not dogs! 
So create a shallow copy of Julia's array, and remove the cat ages from that copied 
 array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult 
("Dog number 1 is an adult, and is 5 years old") or a puppy 
("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${dog} year old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

/* 
Let's go back to Julia and Kate's study about dogs.
This time, they want to convert dog ages to human ages and 
calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', 
which accepts an arrays of dog's ages ('ages'), 
and does the following things in order:

1. Calculate the dog age in human years using the following formula: 
if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old 
(which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs 
(you should already know from other challenges 
how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const humanAges = 2;
const humans = 4;
const calcAverageHumanAges = function (ages) {
  const humanAge = ages.map(function (dogAge) {
    if (dogAge <= 2) {
      return dogAge * humanAges;
    } else if (dogAge > 2) {
      return 16 + dogAge * humans;
    }
  });
  console.log(humanAge);
  const filterAdults = humanAge.filter(function (avg) {
    return avg >= 18;
  });
  console.log(filterAdults);
  const average = filterAdults.reduce(function (acc, age, i, arr) {
    return acc + age / arr.length;
  }, 0);
  return average;
};

const average1 = calcAverageHumanAges([5, 2, 4, 1, 15, 8, 3]);
const average2 = calcAverageHumanAges([16, 6, 10, 5, 6, 1, 4]);
console.log(average1, average2);

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   // 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5

//   return average;
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
const humanAges = 2;
const humans = 4;
const calcAverageHumanAges = function (ages) {
  const humanAge = ages.map(function (dogAge) {
    if (dogAge <= 2) {
      return dogAge * humanAges;
    } else if (dogAge > 2) {
      return 16 + dogAge * humans;
    }
  });
  console.log(humanAge);
  const filterAdults = humanAge.filter(function (avg) {
    return avg >= 18;
  });
  console.log(filterAdults);
  const average = filterAdults.reduce(function (acc, age, i, arr) {
    return acc + age / arr.length;
  }, 0);
  return average;
};

const average1 = calcAverageHumanAges([5, 2, 4, 1, 15, 8, 3]);
const average2 = calcAverageHumanAges([16, 6, 10, 5, 6, 1, 4]);
console.log(average1, average2);

console.log('--- ARROW CHAINING METHOD ----');
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age > 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const average01 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const average02 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(average01, average02);

console.log('--- FUNCTION CHAINING ------');
const humanAges = 2;
const humans = 4;
const calcAverageHumansAge = function (ages) {
  const humansAge = ages
    .map(function (mov) {
      if (mov <= 2) {
        return mov * humanAges;
      } else if (mov > 2) {
        return 16 + mov * humans;
      }
    })
    .filter(function (greater) {
      return greater > 18;
    })
    .reduce(function (acc, cur, i, arr) {
      return acc + cur / arr.length;
    }, 0);
  return humansAge;
};
const avg1 = calcAverageHumansAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumansAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
// INCLUDES 
// console.log(movements);
// console.log(movements.includes(-130));

// SOME METHOD
const anyDeposits = movements.some(function (mov) {
  return mov > 100;
});
console.log(anyDeposits);

//EVERY METHOD
console.log(
  movements.every(function (mov) {
    return mov > 0;
  })
);

//SEPARATE CALLBACS
const deposit = function (mov) {
  return mov > 0;
};
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// FLAT METHOD
// const arr = [[1, 2, 3, 4], [5, 6, 7], 8, 9];
// console.log(arr.flat());

const accoutnMovements = accounts.map(function (acc) {
  return acc.movements;
});
console.log(accoutnMovements);
const allMovements = accoutnMovements.flat();
console.log(allMovements);
const overallBal = allMovements.reduce(function (acc, cur, i, arr) {
  return acc + cur;
}, 0);
console.log(overallBal);

// Using Chaining For Flat
const overallBalance = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .reduce(function (acc, mov, i, arr) {
    return acc + mov;
  });

console.log(overallBalance);

// FLATMAP METHOD
const overallBalance2 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, mov, i, arr) {
    return acc + mov;
  });

console.log(overallBalance2);

// SORT WIT STRINGS
const owners = [`Adenola`, 'Omotayo', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// SORT WIT NUMBERS
console.log(movements);
// console.log(movements.sort());

// return < 0 A, B [KEEP ORDER]
// return > 0 B, A [SWITCH ORDER]
// ASCENDING ORDER
movements.sort((a, b) => a - b);
// return < 0 A, B [KEEP ORDER]
// return > 0 B, A [SWITCH ORDER]
// DESCENDING ORDER
console.log(movements);
// movements.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (b > a) {
//     return 1;
//   }
// });

// movements.sort((a, b) => b - a);
movements.sort(function (a, b) {
  return b - a;
});

console.log(movements);

// ARRAYSSSSSSS WITH FILL, FROM,
const x = new Array(7);
console.log(x);

console.log(
  x.map(function () {
    return 5;
  })
);

// EXPERIMENTING WITH FILL
x.fill(1, 3, 5);
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7, 8];
arr.fill(23, 2, 6);
console.log(arr);

// ARRAY.FROM create = arrays like array like sructures.
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value')
  ).map(function (el) {
    return Number(el.textContent.replace('€', ''));
  });
  console.log(movementUI);
});
// MORE ARRAY PRACTCEEEEEEEEEEE
// 1.
const bankDepositSum = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .filter(function (mov) {
    return mov > 0;
  })
  .reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
console.log(bankDepositSum);

// 2. Counting
// const numDeposits1000 = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .filter(function (mov) {
//     return mov >= 1000;
//   }) .length

// METHOD 2
const numDeposits1000 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, cur, i, arr) {
    return cur >= 1000 ? ++acc : acc;
  }, 0);
console.log(numDeposits1000);

let a = 10;
console.log(++a); //PREFIXED ++ OPERATOR
console.log(a);

// 3. Creating New Obj
const { deposits, withdrawals } = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(
    function (sums, cur, i, arr) {
      // cur > 0 ? (sums.deposit += cur) : (sums.withdrawals += cur);
      // return sums;
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// 4. FUNCTIONS TO CONVERT STRING TO CAPITALIZE
// This is a nice title - This Is a Nice Title
const convertTitle = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'the', 'and', 'but', 'or', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return exceptions.includes(word) ? word : capitalize(word);
    })
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitle(`This is a nice title`));
console.log(convertTitle(`this is a LONG title but not too long`));
console.log(convertTitle(`and here is another title with an EXAMPLE`));
*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time 
they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is 
larger than the recommended portion, and eating too
little is the opposite.
Eating an okay amount means the dog's current food 
portion is within a range 10% above and 10% below 
the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, 
calculate the recommended food portion and add it to the object as a new property. 
Do NOT create a new array, simply loop over the array. 
Forumla: recommendedFood = weight ** 0.75 * 28. 
(The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether
it's eating too much or too little. 
HINT: Some dogs have multiple owners, 
so you first need to find Sarah in the owners array, 
and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much 
('ownersEatTooMuch') and an array with all owners of dogs who eat 
too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., 
like this: "Matilda and Alice and Bob's dogs eat too much!" and 
"Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating 
EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an 
OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY 
amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by 
recommended food portion in an ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, 
you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the 
recommended portion means: current > (recommended * 0.90) && 
current < (recommended * 1.10). Basically, the current portion 
should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1.
dogs.forEach(function (dog) {
  return (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
});
console.log(dogs);

// 2. Find Sarah's Dog using Find
const dogSarah = dogs.find(function (dogs) {
  return dogs.owners.includes('Sarah');
});
if (dogSarah.curFood > dogSarah.recFood) {
  console.log(`Sarah's dog is eating too much`);
} else {
  console.log(`Sarah's dog is eating too little`);
}
console.log(dogSarah);

// 3.
const ownersEatTooMuch = dogs
  .filter(function (toomuch) {
    return toomuch.curFood > toomuch.recFood;
  })
  .flatMap(function (dogs) {
    return dogs.owners;
  });
// .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(function (toolittle) {
    return toolittle.curFood < toolittle.recFood;
  })
  .flatMap(function (dogs) {
    return dogs.owners;
  })
  .flat();
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

// 5.
console.log(
  dogs.some(function (dog) {
    return dog.curFood === dog.recFood;
  })
);

// 6.
// current > (recommended * 0.9) && current < recommended * 1.1;
const checkEatingOkay = function (dog) {
  return dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
};
console.log(dogs.some(checkEatingOkay));

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
const dogsSorted = dogs.slice().sort(function (a, b) {
  return a.recFood - b.Food;
});
console.log(dogsSorted);

// CONVERTING AND CHECING NUMBERS
console.log(23 === 23.0);
// Base 10 - 0 to 9
// Binary Base 2 - 0 1
console.log(0.1 + 0.2);

// CONVERTING STRINGS TO NUMBES
console.log(Number('23'));
console.log(+'23');

// PARSING
console.log(Number.parseInt('360px'));
console.log(Number.parseInt('2.5rem'));

// Read a value out of a string
console.log(Number.parseFloat('2.5rem'));

// Check if value is not a number
console.log(Number.isNaN('vee'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Best way to check if a value is a real lnumber and not a ''
console.log(Number.isFinite(20));
console.log(Number.isFinite(+'20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(20 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(+'23.0'));

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));

console.log(Math.max(5, 10, 30, 15, 20, 25));
console.log(Math.min(5, 10, 30, 15, 20, 25));

// Checking for radius
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// Math.trunc removes any decimal part
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
};
console.log(randomInt(10, 20));

// Rounding Integers
console.log(Math.round(23.7));
console.log(Math.round(23.2));

console.log(Math.ceil(23.7));
console.log(Math.ceil(23.2));

console.log(Math.floor(23.2));
console.log(Math.floor(23.7));

console.log(Math.trunc(-23.7));
console.log(Math.floor(-23.7));

// Floating point / Decimals
console.log((2.5).toFixed(0));
console.log((2.5).toFixed(3));
console.log(+(2.345).toFixed(2));

// REMAINDER OPERATOR %
console.log(5 % 2);
console.log(5 / 2); //5 = 2 * 2 + 1
console.log(8 % 3);

console.log(6 % 2);
console.log(7 % 2);

const isEven = function (n) {
  return n % 2 === 0;
};
console.log(isEven(8));
console.log(isEven(7));
console.log(isEven(23));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered';
    }
    if (i % 3 === 0) {
      row.style.backgroundColor = 'blue';
    }
  });
});

// NUMERIC SEPARATORS === FORMATTING
const diameter = 287_460_000_000;
console.log(diameter);

const priceInCents = 345_99;
console.log(priceInCents);

const transferFee = 15_00;

// To show restrictions of the underscore
const PI = 3.14_15;
console.log(PI);

console.log(Number('23000'));
console.log(Number('23_000'));
console.log(parseInt('23_000'));

// WORING WITH BigInt
console.log(2 ** 53 - 1);
console.log(2 ** 53 + 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(58975678090967547676709898654695496n);
console.log(BigInt(589756780909)); //SMALL

// Operations
console.log(10000n + 10000n);

// EXCEPTIONS
console.log(20n > 14);
console.log(20n === 20);
console.log(20n == 20);
console.log(20n == '20');
console.log(typeof 20n);

const huge = 3638764356734597984656675468
console.log(huge + ' is really big!!!');

// Division 
console.log(10n / 3n); //Cut of decimal part
console.log(10 / 3);

// CREATING DATES - 4 DIFFERENT WAYS
// 1.
const now = new Date();
console.log(now);

console.log(new Date('December 25 2015'));
console.log(new Date(accounts1.movementsDates[0]));

// console.log(new Date(2027, 10, 19, 15, 23, 5));
console.log(new Date(2027, 10, 34));

console.log(new Date(0));
// To calc three days later -- Time stamp of day 3
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates 
const future = new Date(2027, 10, 19, 15, 23)
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
// Time stamp 
console.log(new Date(1826634180000));
console.log(Date.now());

future.se tFullYear(2040)
console.log(future);

// Calculating With Dates
const future = new Date(2037, 10, 19, 23, 15);
// console.log(+future);

const calcDaysPassed = function (date1, date2) {
  return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
};

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);

// Intl Object
const options = {
  style: 'currency',
  unit: 'mile-per-hour',
  currency: 'EUR',
  // useGrouping: false
}
// Initializing Numbers 
const num = 465646.57
console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Ger: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log('Browser: ', new Intl.NumberFormat(navigator.langauge, options).format(num));

// TIMERS --Asynchronous Javascript
const ingredients = ['Olives', 'Spinach'];
const pizzaTimer = setTimeout(
  function (ing1, ing2) {
    console.log(`Here is your pizza🍕🍕 with ${ing1} and ${ing2}`);
  },
  3000,
  ...ingredients
);
console.log('Waiting...');

// DELETING OR CLEARING THE TIMER 
if (ingredients.includes('Spinach')) clearTimeout(pizzaTimer);

// SET INTERVALS running over and over again 
setInterval(function () {
  const now = new Date()
  console.log(now);
}, 4000)
*/
