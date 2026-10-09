/**
 * ソートアルゴリズム ジェネレーター関数群
 * 各関数は JavaScript Generator (function*) として実装され、
 * 1ステップごとに比較、スワップ、代入などのイベントを yield します。
 */

// 1. バブルソート (Bubble Sort)
export function* bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', indices: [j, j + 1] };
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  yield { type: 'done', indices: [] };
}

// 2. 選択ソート (Selection Sort)
export function* selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { type: 'highlight', indices: [minIdx] };
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [minIdx, j] };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { type: 'highlight', indices: [minIdx] };
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', indices: [i, minIdx] };
    }
  }
  yield { type: 'done', indices: [] };
}

// 3. 挿入ソート (Insertion Sort)
export function* insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', indices: [j - 1, j] };
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        yield { type: 'swap', indices: [j - 1, j] };
        j--;
      } else {
        break;
      }
    }
  }
  yield { type: 'done', indices: [] };
}

// 4. クイックソート (Quick Sort)
export function* quickSort(arr, low = 0, high = arr.length - 1) {
  function* partition(l, r) {
    const pivot = arr[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
      yield { type: 'compare', indices: [j, r] };
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield { type: 'swap', indices: [i, j] };
        }
      }
    }
    if (i + 1 !== r) {
      [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
      yield { type: 'swap', indices: [i + 1, r] };
    }
    return i + 1;
  }

  // スタックベースで実装して再帰深度の制約を回避
  const stack = [{ low, high }];
  while (stack.length > 0) {
    const { low: l, high: h } = stack.pop();
    if (l < h) {
      // partition を Generator として実行
      const partGen = partition(l, h);
      let step = partGen.next();
      while (!step.done) {
        yield step.value;
        step = partGen.next();
      }
      const pIndex = step.value;
      stack.push({ low: pIndex + 1, high: h });
      stack.push({ low: l, high: pIndex - 1 });
    }
  }
  yield { type: 'done', indices: [] };
}

// 5. マージソート (Merge Sort)
export function* mergeSort(arr) {
  // ボトムアップ（反復的）マージソートでGenerator化を簡潔かつ安定に
  const n = arr.length;
  for (let currSize = 1; currSize < n; currSize = 2 * currSize) {
    for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, n - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, n - 1);

      // マージ処理
      const n1 = mid - leftStart + 1;
      const n2 = rightEnd - mid;
      const L = new Array(n1);
      const R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[leftStart + i];
      for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

      let i = 0, j = 0, k = leftStart;
      while (i < n1 && j < n2) {
        yield { type: 'compare', indices: [leftStart + i, mid + 1 + j] };
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          yield { type: 'overwrite', indices: [k], value: L[i] };
          i++;
        } else {
          arr[k] = R[j];
          yield { type: 'overwrite', indices: [k], value: R[j] };
          j++;
        }
        k++;
      }
      while (i < n1) {
        arr[k] = L[i];
        yield { type: 'overwrite', indices: [k], value: L[i] };
        i++;
        k++;
      }
      while (j < n2) {
        arr[k] = R[j];
        yield { type: 'overwrite', indices: [k], value: R[j] };
        j++;
        k++;
      }
    }
  }
  yield { type: 'done', indices: [] };
}

// 6. ヒープソート (Heap Sort)
export function* heapSort(arr) {
  const n = arr.length;

  function* heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield { type: 'compare', indices: [left, largest] };
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    if (right < size) {
      yield { type: 'compare', indices: [right, largest] };
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      yield { type: 'swap', indices: [root, largest] };
      yield* heapify(size, largest);
    }
  }

  // 最大ヒープ構築
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // ヒープから要素を1つずつ取り出す
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { type: 'swap', indices: [0, i] };
    yield* heapify(i, 0);
  }
  yield { type: 'done', indices: [] };
}

// 7. ボゴソート (Bogo Sort)
// 安全リミット（最大試行回数）付き
export function* bogoSort(arr, maxAttempts = 10000) {
  const n = arr.length;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    // ソート済みチェック
    let sorted = true;
    for (let i = 0; i < n - 1; i++) {
      yield { type: 'compare', indices: [i, i + 1] };
      if (arr[i] > arr[i + 1]) {
        sorted = false;
        break;
      }
    }

    if (sorted) {
      yield { type: 'done', indices: [] };
      return;
    }

    // ランダムシャッフル (Fisher-Yates)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { type: 'swap', indices: [i, j] };
      }
    }
  }

  // 安全停止リミット到達
  yield {
    type: 'limit_reached',
    indices: [],
    message: `安全制限到達 (${maxAttempts} 回試行)`
  };
  yield { type: 'done', indices: [] };
}

// アルゴリズム一覧のメタデータ
export const ALGORITHMS = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    nameJa: 'バブルソート',
    generator: bubbleSort,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: '隣接する要素を比較して大きい方を順次後ろへ送る基本アルゴリズム',
    badgeColor: 'badge-primary',
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    nameJa: '選択ソート',
    generator: selectionSort,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: '未ソート領域から最小（または最大）値を探索し、先頭と交換する',
    badgeColor: 'badge-secondary',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    nameJa: '挿入ソート',
    generator: insertionSort,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: '整列済み部分に新しい要素を適切な位置に順次挿入していく',
    badgeColor: 'badge-accent',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    nameJa: 'クイックソート',
    generator: quickSort,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: '基準値(ピボット)を選び、大小に分割して高速に再帰ソートする代表格',
    badgeColor: 'badge-info',
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    nameJa: 'マージソート',
    generator: mergeSort,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: '配列を分割統治し、整列しながら結合（マージ）する安定ソート',
    badgeColor: 'badge-success',
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    nameJa: 'ヒープソート',
    generator: heapSort,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: '二分ヒープ木を構築し、根の最大値を順次末尾に取り出すアルゴリズム',
    badgeColor: 'badge-warning',
  },
  {
    id: 'bogo',
    name: 'Bogo Sort',
    nameJa: 'ボゴソート',
    generator: bogoSort,
    timeComplexity: 'O((n+1)!)',
    spaceComplexity: 'O(1)',
    description: '配列が整列されるまでランダムな並び替えと検証を繰り返す確率的ソートアルゴリズム',
    badgeColor: 'badge-neutral',
  },
];

