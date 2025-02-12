'use strict';

/////////////////////////////////////////////////////
//BANKIST APP

////////////////////////////////////////////////////
//data

const account1 = {
  owner: 'Peter Inyope',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],

  movementsDates: [
    '2024-07-25T21:31:17.178Z',
    '2024-07-26T07:42:02.383Z',
    '2024-07-27T09:15:04.904Z',
    '2024-07-28T10:17:24.185Z',
    '2024-07-29T14:11:59.604Z',
    '2024-07-30T17:01:17.194Z',
    '2024-07-31T23:36:17.929Z',
    '2024-08-02T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'fred Stack',
  movements: [25000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2024-07-01T13:15:33.035Z',
    '2019-07-30T09:48:16.867Z',
    '2024-07-25T06:04:23.907Z',
    '2024-07-25T14:18:46.235Z',
    '2024-08-02T16:33:06.386Z',
    '2024-08-02T14:43:26.374Z',
    '2024-08-02T18:49:59.371Z',
    '2024-08-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Margret Inyope',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2024-07-26T13:15:33.035Z',
    '2024-07-27T09:48:16.867Z',
    '2024-07-28T06:04:23.907Z',
    '2024-07-29T14:18:46.235Z',
    '2024-07-30T16:33:06.386Z',
    '2024-07-31T14:43:26.374Z',
    '2024-08-02T18:49:59.371Z',
    '2024-08-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Victor Inyope',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    '2024-07-26T13:15:33.035Z',
    '2024-07-27T09:48:16.867Z',
    '2024-07-28T06:04:23.907Z',
    '2024-07-29T14:18:46.235Z',
    '2024-07-30T16:33:06.386Z',
    '2024-07-31T14:43:26.374Z',
    '2024-08-02T18:49:59.371Z',
    '2024-08-01T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

///////////////////////////////////////////////////
//functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(acc.movements.slice());

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
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
        </div>

    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  //   console.log(acc.balance);
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

/////////////////////////////////////////////////////
//create username

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
// console.log(accounts);

const updateUI = function (acc) {
  //display balance
  calcDisplayBalance(acc);

  //calc display summary
  calcDisplaySummary(acc);

  //display movements
  displayMovements(acc);
};

const starterLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'login to ger started';
      containerApp.style.opacity = 0;
    }

    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// const starterLogOutTimer = function () {
//   const tick = function () {
//     const min = String(Math.trunc(time / 60)).padStart(2, 0);
//     const sec = String(time % 60).padStart(2, 0);
//     //in each call,print the remaining time to UI
//     labelTimer.textContent = `${min}:${sec}`;

//     //when 0 seconds,stop timer and log out user
//     if (time === 0) {
//       clearInterval(timer);
//       labelWelcome.textContent = 'login to get started';
//       containerApp.style.opacity = 0;
//     }
//     //Decrese 1s
//     time--;
//   };

//   //set time to 5 minutes
//   let time = 120;

//   //call the timer every seconds
//   tick();
//   const timer = setInterval(tick, 1000);
//   return timer;
// };

////////////////////////////////////////////////////////
//display balance

// ///////////////////////////////////////////////////////
// //display summary

//FAKE ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//experimenting the API
//for month we can use long or 2-digit
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  //prevent form from default submit
  e.preventDefault();
  // console.log('hi champ');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();

    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);

    timer = starterLogOutTimer();

    //UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //ADD TO TRANSFER
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toDateString());

    //update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = starterLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  //prevent form from submitting default
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add element
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      //update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = starterLogOutTimer();
    }, 2500);
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
    // console.log(index);

    // accounts.splice(index, 3);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  console.log(accounts);
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
// });
