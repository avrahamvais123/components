"use client";

import { watch, store as createStore } from "hyperactiv/react";

const store = createStore({
  value1: [],
  value2: [],
});

const Test1 = watch(() => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Test 1</h2>
      <ul>
        {store.value1.map((item, index) => (
          <li key={index}>
            <button onClick={() => store.value1.splice(index, 1)}>
              Remove
            </button>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
});

const Test2 = watch(() => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Test 2</h2>
      <ul>
        {store.value2.map((item, index) => (
          <li key={index}>
            <button onClick={() => store.value2.splice(index, 1)}>
              Remove
            </button>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
});

const Page = () => {
  return (
    <div className="min-h-screen p-8 border-4 border-red-600">
      <h1 className="text-2xl font-bold mb-4">Hyperactiv Example</h1>

      <Test1 />
      <Test2 />

      <button
        onClick={() => store.value1.push(`הכפתור עובד!-${store.value1.length}`)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        לחץ כאן לבדיקה 1
      </button>

      <button
        onClick={() => store.value2.push(`הכפתור עובד!-${store.value2.length}`)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
      >
        לחץ כאן לבדיקה 2
      </button>
    </div>
  );
};

export default Page;
