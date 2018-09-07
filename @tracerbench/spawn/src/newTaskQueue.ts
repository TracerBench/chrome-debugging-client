export type Task = () => void;

/**
 * Ensures each message will have its own microtask queue.
 */
export default function newTaskQueue() {
  const queue: Task[] = [];
  let scheduled = false;
  let read = 0;
  let write = 0;
  return enqueue;

  function schedule() {
    scheduled = true;
    setImmediate(next);
  }

  function next() {
    scheduled = false;
    dequeue();
  }

  function enqueue(task: Task) {
    queue[write++] = task;
    if (scheduled) {
      return;
    }
    schedule();
  }

  function dequeue() {
    const task = queue[read];
    queue[read++] = undefined as any;
    if (read < write) {
      schedule();
    } else {
      // empty reset back to zero
      read = write = 0;
    }
    task();
  }
}
