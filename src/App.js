import React from "react";
import Die from "./components/Die.js";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
function App() {
  // function to generate new number

  function generateNewDie() {
    const number = {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
    return number;
  }
  // allNewDice function
  const allNewDice = () => {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }

    return newDice;
  };

  // state for after numbers are generated
  const [dice, setDice] = React.useState(allNewDice());

  // state to check whether user have won the game
  const [tenzies, setTenzies] = React.useState(true);

  // record time code
  const storedRecordTime = localStorage.getItem("store");
  const recordTimeAsInt = storedRecordTime
    ? parseInt(storedRecordTime, 10)
    : Number.POSITIVE_INFINITY;

  // state for time taken
  const [transitionTime, setTransitionTime] = React.useState(0);
  const [recordTime, setRecordTime] = React.useState(recordTimeAsInt);

  React.useEffect(() => {
    let intervalId;

    if (!tenzies) {
      setTransitionTime(0);
      intervalId = setInterval(() => {
        setTransitionTime((prevTime) => {
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [tenzies]);

  // ... Rest of the component code

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
    }

    if (allHeld && allSameValue && transitionTime < recordTime) {
      setRecordTime(transitionTime);

      localStorage.setItem("store", transitionTime);

      setTimeout(() => {
        alert("New record time!");
      }, 1000);
    }
  }, [dice, transitionTime, recordTime]);

  // tracking of number of times rolls button was clicked
  const [rollsCount, setRollsCount] = React.useState(0);

  // refresh button function for isHeld false

  function rollDice() {
    setRollsCount((prevRollsCount) => prevRollsCount + 1);

    setDice((oldDice) => {
      return oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      });
    });
  }

  // function to holdDie value
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  // state for error messages
  const [text, setText] = React.useState();
  const [displayText, setDisplayText] = React.useState(false);

  const diceElements = dice.map((die) => {
    const handleClick = () => {
      if (!tenzies) {
        holdDice(die.id);
      } else {
        setText("click new game to start");
        setDisplayText(true);
        setTimeout(() => {
          setDisplayText(false);
        }, 1500);
      }
    };
    return (
      <Die
        onClick={handleClick}
        isHeld={die.isHeld}
        key={die.id}
        value={die.value}
      />
    );
  });

  const startGame = () => {
    setTenzies(false);
    setDice(allNewDice());
    setRollsCount((prevRollsCount) => (prevRollsCount = 0));
  };

  return (
    <main>
      {transitionTime > 0 && tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <div>
        <p className="record-txt">RecordTime:</p>

        {recordTime === Number.POSITIVE_INFINITY ? (
          <p className="record-time">No record yet</p>
        ) : (
          <p className="record-time">{recordTime} secs</p>
        )}
      </div>

      <p className="transition-txt-jsx">
        time taken to game-<span>{transitionTime} secs</span>
      </p>
      <p>
        {displayText ? (
          <p className="disable-txt">
            <i class="fa fa-warning"></i> {text}
          </p>
        ) : null}
      </p>
      <div className="dice-container">
        <div className="grid-each-die-face">{diceElements} </div>
      </div>
      {tenzies ? (
        <button onClick={startGame} className="roll-dice">
          New game
        </button>
      ) : (
        <button className="roll-dice" onClick={rollDice}>
          roll
        </button>
      )}

      <div>
        <p>number of rolls used - {rollsCount}</p>
      </div>
    </main>
  );
}

export default App;
