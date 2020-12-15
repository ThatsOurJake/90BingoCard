import rng from './rng';

class Card {
  constructor() {
    this.numbers = new Array(3).fill('').map(x => new Array(9));
  }

  getRowCount(r) {
    return this.numbers[r].filter(x => x != undefined).length;
  }

  getColCount(c) {
    return this.numbers.reduce((prev, acc) => {
      return prev + acc.find(x => x != undefined).length;
    }, 0);
  }

  getNumbers() {
    return this.numbers.reduce((acc, current) => {
      return acc.concat(current);
    }, []).filter(x => x != undefined).sort((a, b) => a - b);
  }
};

const countElementsInSet = (set) => {
  return set.reduce((prev, acc) => {
    return prev + acc.length;
  }, 0);
};


const fillRow = (initialSize, rowIndex, currentSet, card) => {
  for(let size = initialSize; size > 0; size--) {
    if(card.getRowCount(rowIndex) == 5) {
      break;
    }

    for (let colIndex = 0; colIndex < 9; colIndex++) {
      if  (card.getRowCount(rowIndex) == 5) {
        break;
      }

      if (card.numbers[rowIndex][colIndex] != undefined) {
        continue;
      }

      const currentSetColumn = currentSet[colIndex];

      if (currentSetColumn.length != size) {
        continue;
      }

      card.numbers[rowIndex][colIndex] = currentSetColumn.pop();
    }
  }
}

const fillRandomSpots = (sets, columns, maxSetSize) => {
  for (let i = 0; i < 9; i++) {
    const column = columns[i];
    
    if (column.length == 0) {
      continue;
    }

    const passRandNumberIndex = rng(0, column.length - 1);
    const passRandColNumber = column[passRandNumberIndex];

    let validSetFound = false;
    
    while(!validSetFound) {
      const passRandSetIndex = rng(0, sets.length - 1);
      const passRandSet = sets[passRandSetIndex];

      if (countElementsInSet(passRandSet) == 15 || passRandSet[i].length == maxSetSize) {
        continue;
      }

      validSetFound = true;
      passRandSet[i].push(passRandColNumber);

      column.splice(passRandNumberIndex, 1);
    }
  }
}

export default () => {
  const cards = new Array(6).fill('').map(x => new Card());
  const columns = new Array(9).fill('').map((x, i) => {
      if (i == 0) {
        return new Array(9).fill('').map((_, j) => j + 1);
      } else if (i == 8) {
        return new Array(11).fill('').map((_, j) => (i * 10) + j);
      }

      return new Array(10).fill('').map((_, j) => (i * 10) + j);
  });

  const sets = new Array(6).fill('').map(() => new Array(9).fill('').map(x => []));

  for (let i = 0; i < 9; i++) {
    const column = columns[i];

    for (let j = 0; j < 6; j++) {
      const randIndex = rng(0, column.length - 1);
      const randNumber = column[randIndex];

      sets[j][i].push(randNumber);
      column.splice(randIndex, 1);
    }
  }

  // Assign element from last column to random card;
  const lastColumn = columns[8];
  const randNumIndex = rng(0, lastColumn.length - 1);
  const randNumber = lastColumn[randNumIndex];

  const randSetIndex = rng(0, sets.length - 1);
  const randSet = sets[randSetIndex][8];
  randSet.push(randNumber);

  lastColumn.splice(randNumIndex, 1);

  for (let pass = 0; pass < 3; pass++) {
    fillRandomSpots(sets, columns, 2);
  }

  fillRandomSpots(sets, columns, 3);

  for(let i = 0; i < 6; i++) {
    for (let j = 0; j < 9; j++) {
      const column = sets[i][j];
      sets[i][j] = column.sort((a, b) => a - b);
    }
  }

  for(let setIndex = 0; setIndex < 6; setIndex++) {
    const currentSet = sets[setIndex];
    const card = cards[setIndex];

    fillRow(3, 0, currentSet, card);
    fillRow(2, 1, currentSet, card);
    fillRow(1, 2, currentSet, card);
  }

  return cards;
};
